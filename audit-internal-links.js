import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all .astro files in src/pages
function getAllPages(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      getAllPages(fullPath, files);
    } else if (item.endsWith('.astro')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Extract internal links from a file
function extractInternalLinks(content) {
  const links = new Set();
  
  // Match href="/..." or href='/...'
  const hrefPattern = /href=["']([^"']+)["']/g;
  let match;
  
  while ((match = hrefPattern.exec(content)) !== null) {
    const href = match[1];
    
    // Only count internal links (start with /)
    if (href.startsWith('/') && !href.startsWith('//')) {
      // Normalize link (remove trailing slash, anchors)
      let normalized = href.split('#')[0].split('?')[0];
      if (normalized.endsWith('/') && normalized !== '/') {
        normalized = normalized.slice(0, -1);
      }
      links.add(normalized);
    }
  }
  
  return Array.from(links);
}

// Convert file path to URL path
function filePathToUrlPath(filePath) {
  let urlPath = filePath
    .replace(/\\/g, '/')
    .replace(/^.*src\/pages/, '')
    .replace(/\.astro$/, '')
    .replace(/\/index$/, '');
  
  if (urlPath === '') urlPath = '/';
  
  return urlPath;
}

// Main audit function
function auditInternalLinks() {
  const pagesDir = path.join(__dirname, 'src/pages');
  const pages = getAllPages(pagesDir);
  
  console.log(`\n📊 Internal Link Audit - Found ${pages.length} pages\n`);
  
  // Track outgoing and incoming links
  const outgoingLinks = new Map(); // page -> [links]
  const incomingLinks = new Map(); // page -> [pages that link to it]
  
  // First pass: extract all links
  for (const pagePath of pages) {
    const urlPath = filePathToUrlPath(pagePath);
    const content = fs.readFileSync(pagePath, 'utf-8');
    const links = extractInternalLinks(content);
    
    outgoingLinks.set(urlPath, links);
    
    // Track incoming links
    for (const link of links) {
      if (!incomingLinks.has(link)) {
        incomingLinks.set(link, []);
      }
      incomingLinks.get(link).push(urlPath);
    }
  }
  
  // Calculate stats
  const pageStats = [];
  
  for (const pagePath of pages) {
    const urlPath = filePathToUrlPath(pagePath);
    const outgoing = outgoingLinks.get(urlPath) || [];
    const incoming = incomingLinks.get(urlPath) || [];
    
    pageStats.push({
      url: urlPath,
      file: pagePath.replace(/^.*src\/pages\//, ''),
      outgoing: outgoing.length,
      incoming: incoming.length,
      incomingFrom: incoming
    });
  }
  
  // Sort by incoming links (ascending)
  pageStats.sort((a, b) => a.incoming - b.incoming);
  
  // Report orphaned pages (0-2 incoming links)
  console.log('🚨 ORPHANED PAGES (0-2 incoming links):');
  console.log('=' .repeat(80));
  
  const orphaned = pageStats.filter(p => p.incoming <= 2);
  for (const page of orphaned) {
    console.log(`\n❌ ${page.url}`);
    console.log(`   File: ${page.file}`);
    console.log(`   Incoming: ${page.incoming} | Outgoing: ${page.outgoing}`);
    if (page.incomingFrom.length > 0) {
      console.log(`   Linked from: ${page.incomingFrom.join(', ')}`);
    }
  }
  
  console.log('\n\n' + '='.repeat(80));
  console.log(`\n📊 SUMMARY:`);
  console.log(`   Total pages: ${pages.length}`);
  console.log(`   Orphaned (≤2 incoming): ${orphaned.length}`);
  console.log(`   Well-linked (≥10 incoming): ${pageStats.filter(p => p.incoming >= 10).length}`);
  
  // Most linked pages
  console.log('\n\n✅ MOST LINKED PAGES (Top 20):');
  console.log('=' .repeat(80));
  
  const topPages = [...pageStats].sort((a, b) => b.incoming - a.incoming).slice(0, 20);
  for (const page of topPages) {
    console.log(`\n✓ ${page.url}`);
    console.log(`   Incoming: ${page.incoming} | Outgoing: ${page.outgoing}`);
  }
  
  // Specific pages we care about
  console.log('\n\n🎯 KEY PAGES STATUS:');
  console.log('=' .repeat(80));
  
  const keyPages = [
    '/faq',
    '/compare/surgery-vs-medication',
    '/compare/gastric-bypass-vs-mini-bypass',
    '/procedures/gastric-sleeve',
    '/procedures/gastric-bypass',
    '/blog/overseas-bariatric-surgery-risks-australia-comparison',
    '/cost-calculator'
  ];
  
  for (const url of keyPages) {
    const page = pageStats.find(p => p.url === url);
    if (page) {
      console.log(`\n${page.incoming <= 2 ? '❌' : page.incoming >= 10 ? '✅' : '⚠️'} ${url}`);
      console.log(`   Incoming: ${page.incoming} | Outgoing: ${page.outgoing}`);
      if (page.incoming <= 5) {
        console.log(`   Linked from: ${page.incomingFrom.join(', ') || 'NONE'}`);
      }
    } else {
      console.log(`\n❓ ${url} - NOT FOUND`);
    }
  }
  
  // Write detailed report to file
  fs.writeFileSync(
    'internal-links-audit.json',
    JSON.stringify(pageStats, null, 2)
  );
  
  console.log('\n\n💾 Detailed report saved to: internal-links-audit.json\n');
}

auditInternalLinks();

