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

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function injectMetadata(html, { title, description, url, image, structuredData }) {
  let updatedHtml = html;

  // Replace <title>...</title>
  if (title) {
    updatedHtml = updatedHtml.replace(/<title>.*?<\/title>/is, `<title>${escapeHtml(title)}</title>`);
  }

  // Replace or inject Open Graph tags
  if (title) {
    updatedHtml = updatedHtml.replace(
      /<meta\s+property=["']og:title["'][^>]*>/i,
      `<meta property="og:title" content="${escapeHtml(title)}" />`
    );
  }
  if (description) {
    updatedHtml = updatedHtml.replace(
      /<meta\s+property=["']og:description["'][^>]*>/i,
      `<meta property="og:description" content="${escapeHtml(description)}" />`
    );
    updatedHtml = updatedHtml.replace(
      /<meta\s+name=["']description["'][^>]*>/i,
      `<meta name="description" content="${escapeHtml(description)}" />`
    );
  }
  if (url) {
    updatedHtml = updatedHtml.replace(
      /<meta\s+property=["']og:url["'][^>]*>/i,
      `<meta property="og:url" content="${escapeHtml(url)}" />`
    );
    updatedHtml = updatedHtml.replace(
      /<link\s+rel=["']canonical["'][^>]*>/i,
      `<link rel="canonical" href="${escapeHtml(url)}" />`
    );
  }
  if (image) {
    updatedHtml = updatedHtml.replace(
      /<meta\s+property=["']og:image["'][^>]*>/i,
      `<meta property="og:image" content="${escapeHtml(image)}" />`
    );
  }

  // Replace or inject Twitter tags
  if (title) {
    updatedHtml = updatedHtml.replace(
      /<meta\s+property=["']twitter:title["'][^>]*>/i,
      `<meta property="twitter:title" content="${escapeHtml(title)}" />`
    );
  }
  if (description) {
    updatedHtml = updatedHtml.replace(
      /<meta\s+property=["']twitter:description["'][^>]*>/i,
      `<meta property="twitter:description" content="${escapeHtml(description)}" />`
    );
  }
  if (url) {
    updatedHtml = updatedHtml.replace(
      /<meta\s+property=["']twitter:url["'][^>]*>/i,
      `<meta property="twitter:url" content="${escapeHtml(url)}" />`
    );
  }
  if (image) {
    updatedHtml = updatedHtml.replace(
      /<meta\s+property=["']twitter:image["'][^>]*>/i,
      `<meta property="twitter:image" content="${escapeHtml(image)}" />`
    );
  }

  // Replace Structured Data JSON-LD
  if (structuredData) {
    const jsonLdScript = `<script type="application/ld+json">\n${JSON.stringify(structuredData, null, 2)}\n</script>`;
    updatedHtml = updatedHtml.replace(
      /<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i,
      jsonLdScript
    );
  }

  return updatedHtml;
}

export default function handler(req, res) {
  // Read built index.html with fallback
  const indexPath = path.join(process.cwd(), 'build', 'index.html');
  let rawHtml = '';
  try {
    rawHtml = fs.readFileSync(indexPath, 'utf-8');
  } catch (err) {
    console.error('Failed to read build/index.html:', err);
  }

  // If built index.html cannot be read, fallback to a safe baseline
  if (!rawHtml) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(500).send('<h1>Server Error: built assets missing</h1>');
  }

  try {
    const { slug } = req.query || {};
    const calc = calculators.find(c => c.id === slug);

    // Host header handling
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'calcfordocs.vercel.app';
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const baseUrl = `${proto}://${host}`;

    const title = calc ? `${calc.name} – CalcForDocs` : 'CalcForDocs';
    const description = calc?.description || (calc ? `${calc.name} calculator for healthcare professionals. ${calc.keywords?.join(', ')}` : 'Free, professional medical calculators for doctors and healthcare professionals.');
    const url = slug ? `${baseUrl}/calc/${slug}` : `${baseUrl}/`;
    const image = `${baseUrl}/calculator-icon.png`;

    const structuredData = calc ? {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "name": title,
      "description": description,
      "url": url,
      "medicalAudience": "Healthcare Professionals",
      "keywords": calc.keywords?.join(', ') || "medical calculator"
    } : {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "name": "CalcForDocs",
      "description": "Professional medical calculators for healthcare providers.",
      "url": baseUrl,
      "medicalAudience": "Healthcare Professionals",
      "keywords": "medical calculator, doctor tools, clinical scores, GCS, eGFR, BMI"
    };

    const finalHtml = injectMetadata(rawHtml, {
      title,
      description,
      url,
      image,
      structuredData
    });

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(finalHtml);
  } catch (injectError) {
    console.error('Error injecting metadata, serving raw build/index.html:', injectError);
    // Requirement 6: If metadata injection fails, serve original built HTML
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(rawHtml);
  }
}
