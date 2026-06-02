import fs from 'fs';
import path from 'path';

// Load calculator metadata once at cold start
const calcInfoPath = path.join(process.cwd(), 'src', 'calculators', 'calcinfo.json');
let calculators = [];
try {
  const raw = fs.readFileSync(calcInfoPath, 'utf-8');
  calculators = JSON.parse(raw);
} catch (e) {
  console.error('Failed to load calcinfo.json', e);
}

export default function handler(req, res) {
  const { slug } = req.query; // e.g., ?slug=parkland_formula
  const calc = calculators.find(c => c.id === slug);

  const title = calc ? `${calc.name} – CalcForDocs` : 'CalcForDocs';
  const description = calc?.description || 'Clinical decision‑support calculator';
  const url = `https://${req.headers.host}/calc/${slug || ''}`;
  // Use shared calculator icon for all previews
  const image = `https://${req.headers.host}/calculator-icon.png`;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${title}</title>

  <!-- Open Graph -->
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="${image}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />

  <script>
    // After meta tags are read by crawlers, redirect real users to the SPA
    if (typeof window !== 'undefined') {
      window.location.replace("${url}");
    }
  </script>
</head>
<body></body>
</html>`;

  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
