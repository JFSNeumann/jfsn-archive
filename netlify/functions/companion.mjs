import Anthropic from '@anthropic-ai/sdk';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: 'Method not allowed' };
  }

  let prompt, works;
  try {
    ({ prompt, works } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, headers: CORS, body: 'Invalid JSON' };
  }
  if (!prompt || !works?.length) {
    return { statusCode: 400, headers: CORS, body: 'Missing prompt or works' };
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const worksText = works.map(w => {
    const year  = w.year  || 'undated';
    const theme = (w.themes || []).join(', ') || 'no theme';
    const desc  = w.description || '';
    const kw    = (w.keywords || []).join(', ');
    return `${w.id}: "${w.title}" (${year}) — ${theme} — ${desc}${kw ? ' [' + kw + ']' : ''}`;
  }).join('\n');

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `You are the companion to an archive of 1,084 artworks by Jeffrey F.S. Neumann — 50 years of collage, sculpture, and photography from Cleveland, Ohio. Works explore memory, time, found objects, targets, faces, and the weight of accumulated material.

A visitor wrote: "${prompt}"

From the works below, select the 1–3 that most resonate with what they described. Choose fewer if fewer genuinely fit. Respond ONLY with a valid JSON array — no preamble, no explanation outside the array:
[{"id":"artXXXX","reason":"one evocative sentence about why this work fits"}]

Works:
${worksText}`,
    }],
  });

  const raw     = msg.content[0].text.trim();
  const jsonStr = raw.match(/\[[\s\S]*\]/)?.[0];
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
};
