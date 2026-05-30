// Inject per-work meta tags server-side so social sharing crawlers
// (Slack, iMessage, Twitter) get the right title/description/image
// without needing to execute JavaScript.

const TYPE_LABELS = {
  collage:           'Collage',
  sculpture:         'Sculpture',
  painting:          'Painting',
  photograph:        'Photograph',
  installation_view: 'Installation',
};

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default async (request, context) => {
  const url = new URL(request.url);
  const id  = url.searchParams.get('id');

  // Only process valid artwork IDs; let everything else pass through.
  if (!id || !/^art\d+$/.test(id)) return context.next();

  // Fetch the HTML and catalog in parallel.
  const [response, catalogRes] = await Promise.all([
    context.next(),
    fetch(new URL('/catalog-lite.json', url.origin)),
  ]);

  if (!catalogRes.ok) return response;

  let catalog;
  try { catalog = await catalogRes.json(); }
  catch { return response; }

  const work = catalog.find(w => w.file === id + '.avif');
  if (!work) return response;

  const title    = work.title || id;
  const year     = work.year  || 'undated';
  const typeLabel = TYPE_LABELS[work.work_type] || (work.work_type || '').replace(/_/g, ' ');
  const fallbackDesc = `${title}, ${year}${typeLabel ? '. ' + typeLabel : ''}. From the archive of Jeffrey F. S. Neumann.`;
  const desc     = (work.description || fallbackDesc).slice(0, 200);
  const imgUrl   = `${url.origin}/artworks/thumbs/${id}.avif`;
  const fullTitle = `${title} — Jeffrey F. S. Neumann`;

  let html = await response.text();

  html = html
    .replace(
      '<title>Artwork — Jeffrey F. S. Neumann</title>',
      `<title>${esc(fullTitle)}</title>`
    )
    .replace(
      'content="https://jfsn.com/artwork.html"',
      `content="${esc(url.href)}"`
    )
    .replace(
      '<meta name="description" content="">',
      `<meta name="description" content="${esc(desc.slice(0, 160))}">`
    )
    .replace(
      'content="Jeffrey F. S. Neumann"',
      `content="${esc(fullTitle)}"`
    )
    .replace(
      'content="Work from the archive of Jeffrey F. S. Neumann, 1974–present."',
      `content="${esc(desc)}"`
    )
    .replace(
      'content="https://jfsn.com/og-card.jpg"',
      `content="${esc(imgUrl)}"`
    )
    .replace(
      '<link rel="canonical" href="https://jfsn.com/artwork.html">',
      `<link rel="canonical" href="${esc(url.href.replace(url.origin, 'https://jfsn.com'))}">`
    );

  return new Response(html, {
    status:  response.status,
    headers: response.headers,
  });
};

export const config = { path: '/artwork.html' };
