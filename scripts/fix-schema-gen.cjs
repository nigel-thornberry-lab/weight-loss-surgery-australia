// Quick fix: update the generator to output Schema objects in frontmatter, not pre-stringified

const fs = require('fs');
const script = fs.readFileSync('scripts/generate-ultimate-seo-profiles.cjs', 'utf-8');

// Replace the Schema output section
const fixed = script.replace(
  /\/\/ Schema markup\nconst physicianSchemaJson[\s\S]*?const breadcrumbSchemaJson[^;]+;/,
  `// Schema objects (will be stringified in template)
const physicianSchema = ${'{'}...physicianSchema${'}'};
const breadcrumbSchema = ${'{'}...breadcrumbSchema${'}'};
${'{'}faqSchema ? 'const faqSchema = {...faqSchema};' : ''${'}'}`
).replace(
  /<script type="application\/ld\+json" set:html=\{physicianSchemaJson\} \/>/,
  '<script type="application/ld+json" set:html={JSON.stringify(physicianSchema)} />'
).replace(
  /<script type="application\/ld\+json" set:html=\{faqSchemaJson\} \/>/g,
  '<script type="application/ld+json" set:html={JSON.stringify(faqSchema)} />'
).replace(
  /<script type="application\/ld\+json" set:html=\{breadcrumbSchemaJson\} \/>/,
  '<script type="application/ld+json" set:html={JSON.stringify(breadcrumbSchema)} />'
);

fs.writeFileSync('scripts/generate-ultimate-seo-profiles-fixed.cjs', fixed, 'utf-8');
console.log('✅ Created fixed generator');
