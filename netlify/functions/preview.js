const path = require('path');
const calcInfo = require(path.resolve(__dirname, '../../src/calculators/calcinfo.json'));

exports.handler = async function(event, context) {
  const slug = event.queryStringParameters && event.queryStringParameters.slug;
  const calc = calcInfo.find(c => c.id === slug);
  const title = calc ? `${calc.name} – CalcForDocs` : 'CalcForDocs';
  const description = calc && calc.description ? calc.description : 'Clinical decision‑support calculator';
  const url = `https://${event.headers.host}/calc/${slug || ''}`;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
</head>
<body>
  <script>window.location = "${url}";</script>
</body>
</html>`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
    body: html,
  };
};
