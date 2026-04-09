const fs = require('fs');
let code = fs.readFileSync('src/calculators/CalculatorRenderer.js', 'utf8');

// Replace imports
code = code.replace(/import (\w+) from "\.\/([^"]+)";/g, 'const $1 = lazy(() => import("./$2"));');

// Add suspense import
if (!code.includes("import { Suspense, lazy }")) {
    code = 'import { Suspense, lazy } from "react";\n' + code;
}

// Update the renderer
code = code.replace(
    /return Component \? <Component \/> : null;/g,
    'return Component ? (\n    <Suspense fallback={<div style={{ textAlign: "center", padding: "20px", color: "#666" }}>Loading calculator...</div>}>\n      <Component />\n    </Suspense>\n  ) : null;'
);

fs.writeFileSync('src/calculators/CalculatorRenderer.js', code);
console.log("Lazy loading enabled!");
