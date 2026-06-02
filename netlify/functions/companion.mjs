import Anthropic from '@anthropic-ai/sdk';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const CATALOG_URL = 'https://jfsn.com/catalog-lite.json';
const MODEL_FAST  = 'claude-haiku-4-5-20251001';
const MODEL_DEEP  = 'claude-sonnet-4-6-20250514';

// Module-level cache: survives across warm invocations of the same function instance.
let catalogCache = null;

async function getCatalog() {
  if (catalogCache) return catalogCache;
  const res = await fetch(CATALOG_URL);
  if (!res.ok) throw new Error(`Failed to fetch catalog: ${res.status}`);
  catalogCache = await res.json();
  return catalogCache;
}

function searchWorks(catalog, { themes, keywords, work_type, series, limit = 30 }) {
  const lc = (s) => (s || '').toLowerCase();
  const kws = (keywords || []).map(lc);
  const tms = (themes   || []).map(lc);

  let results = catalog.filter(w => {
    if (work_type && w.work_type !== work_type) return false;
    if (series    && w.series    !== series)    return false;

    const wThemes = (w.themes   || []).map(lc);
    const wKws    = (w.keywords || []).map(lc);
    const blob    = lc(`${w.title} ${w.description} ${wThemes.join(' ')} ${wKws.join(' ')}`);

    if (tms.length && !tms.some(t => wThemes.includes(t) || blob.includes(t))) return false;
    if (kws.length && !kws.some(k => blob.includes(k))) return false;
    return true;
  });

  // Shuffle so repeated calls surface different works.
  results = results.sort(() => Math.random() - 0.5).slice(0, limit);

  return results.map(w => {
    const year  = w.year || 'undated';
    const theme = (w.themes || []).join(', ') || 'no theme';
    const desc  = w.description || '';
    const kw    = (w.keywords || []).join(', ');
    return `${w.file.replace('.avif', '')}: "${w.title}" (${year}) — ${theme} — ${desc}${kw ? ' [' + kw + ']' : ''}`;
  }).join('\n');
}

const SEARCH_TOOL = {
  name: 'search_works',
  description: 'Search the archive for artworks matching themes, keywords, work type, or series. Call this to find candidates before selecting the best matches for the visitor.',
  input_schema: {
    type: 'object',
    properties: {
      themes:    { type: 'array',  items: { type: 'string' }, description: 'Theme names to filter by (e.g. "Memory", "Accumulation", "Targets")' },
      keywords:  { type: 'array',  items: { type: 'string' }, description: 'Keywords or phrases to match against title, description, and keywords fields' },
      work_type: { type: 'string', description: 'Filter by work type: collage, sculpture, painting, photograph' },
      series:    { type: 'string', description: 'Filter by named series (e.g. "Guernica") or omit for all' },
      limit:     { type: 'number', description: 'Max works to return (default 30, max 50)' },
    },
  },
};

const SYSTEM = `You are the Companion to an archive of 1,084 artworks by Jeffrey F.S. Neumann — 50 years of collage, sculpture, and photography from Cleveland, Ohio. Works explore memory, time, found objects, targets, faces, and the weight of accumulated material.

A visitor has described something they are looking for. Use the search_works tool to find candidates, then select the 1–3 works that most resonate with what they described. Choose fewer if fewer genuinely fit.

After searching, respond ONLY with a valid JSON array — no preamble, no explanation outside the array:
[{"id":"artXXXX","reason":"one evocative sentence about why this work fits"}]

Use the work's file stem (e.g. "art0042") as the id. If no works genuinely fit, return [].`;

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: 'Method not allowed' };
  }

  let prompt, deep;
  try {
    ({ prompt, deep } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, headers: CORS, body: 'Invalid JSON' };
  }
  if (!prompt) {
    return { statusCode: 400, headers: CORS, body: 'Missing prompt' };
  }

  const catalog = await getCatalog();
  const client  = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const model   = deep ? MODEL_DEEP : MODEL_FAST;

  const messages = [{ role: 'user', content: prompt }];

  // Agentic loop: let Claude call search_works as many times as it needs.
  for (let turn = 0; turn < 5; turn++) {
    const params = {
      model,
      max_tokens: deep ? 4000 : 1024,
      system:     SYSTEM,
      tools:      [SEARCH_TOOL],
      messages,
    };

    if (deep) {
      params.thinking = { type: 'enabled', budget_tokens: 2000 };
    }

    const msg = await client.messages.create(params);

    // Collect all tool uses in this response.
    const toolUses = msg.content.filter(b => b.type === 'tool_use');

    if (toolUses.length === 0 || msg.stop_reason === 'end_turn') {
      // Model finished — extract JSON from the text block.
      const textBlock = msg.content.find(b => b.type === 'text');
      const raw       = textBlock?.text?.trim() || '';
      const jsonStr   = raw.match(/\[[\s\S]*\]/)?.[0];
      if (!jsonStr) {
        return { statusCode: 502, headers: CORS, body: 'Unexpected model response' };
      }
      let matches;
      try {
        matches = JSON.parse(jsonStr);
      } catch {
        return { statusCode: 502, headers: CORS, body: 'Could not parse model response' };
      }
      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ matches }),
      };
    }

    // Execute all tool calls and feed results back.
    messages.push({ role: 'assistant', content: msg.content });
    const toolResults = toolUses.map(tu => {
      const input   = tu.input;
      const results = searchWorks(catalog, {
        themes:    input.themes,
        keywords:  input.keywords,
        work_type: input.work_type,
        series:    input.series,
        limit:     Math.min(input.limit || 30, 50),
      });
      return {
        type:        'tool_result',
        tool_use_id: tu.id,
        content:     results || '(no matching works found)',
      };
    });
    messages.push({ role: 'user', content: toolResults });
  }

  return { statusCode: 502, headers: CORS, body: 'Companion loop did not converge' };
};
