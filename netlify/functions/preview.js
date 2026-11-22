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
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="${image}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/assets/index.js"></script>
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
