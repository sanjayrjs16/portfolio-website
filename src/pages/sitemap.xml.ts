const SITE_URL = 'https://sanjayrajesh.in';

const routes = [
  '/',
  '/posts',
  '/works',
  '/works/goat-life',
  '/works/goatlife',
  '/works/ohc-network',
  '/works/picturama',
  '/works/sunroad',
  '/yt-redirect'
];

const today = new Date().toISOString().split('T')[0];

function createSitemapXml() {
  const urls = routes
    .map((route) => {
      const loc = `${SITE_URL}${route === '/' ? '' : route}`;
      return [
        '<url>',
        `  <loc>${loc}</loc>`,
        `  <lastmod>${today}</lastmod>`,
        '  <changefreq>weekly</changefreq>',
        '  <priority>0.7</priority>',
        '</url>'
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>'
  ].join('\n');
}

export function GET() {
  return new Response(createSitemapXml(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}
