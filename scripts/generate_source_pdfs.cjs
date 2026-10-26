const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Source files in architectural order
const projectFiles = [
  'server.ts',
  'index.html',
  'src/main.tsx',
  'src/index.css',
  'src/App.tsx',
  'src/components/AuraInkLogo.tsx',
  'src/components/BirthPlaceMapModal.tsx',
  'src/components/TattooMockupCanvas.tsx',
  'src/data.ts',
  'src/sigilData.ts',
  'src/premiumData.ts',
  'src/indiaLocations.ts'
];

function buildUnifiedCodeLines() {
  const unifiedLines = [];
  for (const relPath of projectFiles) {
    const fullPath = path.join(process.cwd(), relPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      unifiedLines.push({
        type: 'banner',
        text: `/* ========================================================================= */`,
        file: relPath
      });
      unifiedLines.push({
        type: 'banner',
        text: `/* FILE: ${relPath} (Lines: ${lines.length}) */`,
        file: relPath
      });
      unifiedLines.push({
        type: 'banner',
        text: `/* ========================================================================= */`,
        file: relPath
      });
      lines.forEach((l, idx) => {
        unifiedLines.push({
          type: 'code',
          file: relPath,
          lineNum: idx + 1,
          text: l
        });
      });
    }
  }
  return unifiedLines;
}

function buildAppTsxLines() {
  const unifiedLines = [];
  const relPath = 'src/App.tsx';
  const fullPath = path.join(process.cwd(), relPath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((l, idx) => {
      unifiedLines.push({
        type: 'code',
        file: relPath,
        lineNum: idx + 1,
        text: l
      });
    });
  }
  return unifiedLines;
}

function generate10PagePdf({ lines, outputPath, title, subtitle, isEndingSection }) {
  const LINES_PER_PAGE = 50;
  const TOTAL_PAGES = 10;
  const targetLinesCount = LINES_PER_PAGE * TOTAL_PAGES; // 500 lines

  let selectedLines = [];
  if (isEndingSection) {
    const startIdx = Math.max(0, lines.length - targetLinesCount);
    selectedLines = lines.slice(startIdx);
  } else {
    selectedLines = lines.slice(0, targetLinesCount);
  }

  // Create PDF Document with zero auto-margins to prevent unintended page overflow
  const doc = new PDFDocument({
    size: 'LETTER',
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    autoFirstPage: false
  });

  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  const pageWidth = 612;
  const pageHeight = 792;
  const marginLeft = 36;
  const marginRight = 36;
  const contentWidth = pageWidth - marginLeft - marginRight; // 540 pt

  for (let pageNum = 1; pageNum <= TOTAL_PAGES; pageNum++) {
    doc.addPage();

    // 1. Top Header Banner
    doc.rect(marginLeft, 24, contentWidth, 22).fill('#0f172a');
    doc.fillColor('#f8fafc').font('Courier-Bold').fontSize(8.5);
    doc.text(
      `AURA INK (AstroPsyche Tattoo Suggester) • SOURCE CODE IDENTIFYING DEPOSIT`,
      marginLeft + 8,
      30,
      { width: contentWidth - 110, lineBreak: false }
    );
    doc.fillColor('#38bdf8').font('Courier-Bold').fontSize(8.5);
    doc.text(
      `PAGE ${pageNum} OF ${TOTAL_PAGES}`,
      marginLeft + contentWidth - 95,
      30,
      { width: 85, align: 'right', lineBreak: false }
    );

    // 2. Subheader Section
    doc.rect(marginLeft, 48, contentWidth, 15).fill('#f1f5f9');
    doc.fillColor('#334155').font('Courier-Bold').fontSize(7.5);
    doc.text(
      `${title.toUpperCase()} • ${subtitle.toUpperCase()}`,
      marginLeft + 6,
      52,
      { width: contentWidth - 12, lineBreak: false }
    );

    // 3. Line Number Gutter separator
    doc.rect(marginLeft + 44, 65, 1, 665).fill('#cbd5e1');

    // 4. Lines of Code
    const pageLineOffset = (pageNum - 1) * LINES_PER_PAGE;
    let yPos = 67;
    const lineHeight = 13.2;

    for (let i = 0; i < LINES_PER_PAGE; i++) {
      const lineObj = selectedLines[pageLineOffset + i];
      if (!lineObj) break;

      // Subtle zebra striping
      if (i % 2 === 1) {
        doc.rect(marginLeft, yPos - 1, contentWidth, lineHeight).fill('#f8fafc');
      }

      if (lineObj.type === 'banner') {
        doc.fillColor('#64748b').font('Courier-Bold').fontSize(7.5);
        doc.text('----', marginLeft + 4, yPos + 1, { width: 36, align: 'right', lineBreak: false });
        doc.fillColor('#0284c7').font('Courier-Bold').fontSize(7.5);
        doc.text(lineObj.text.slice(0, 88), marginLeft + 50, yPos + 1, { width: contentWidth - 54, lineBreak: false });
      } else {
        const numStr = String(lineObj.lineNum || (pageLineOffset + i + 1)).padStart(4, '0');
        doc.fillColor('#94a3b8').font('Courier').fontSize(7.5);
        doc.text(numStr, marginLeft + 4, yPos + 1, { width: 36, align: 'right', lineBreak: false });

        const cleanText = lineObj.text.replace(/\t/g, '  ');
        const truncated = cleanText.length > 90 ? cleanText.slice(0, 87) + '...' : cleanText;
        doc.fillColor('#0f172a').font('Courier').fontSize(7.5);
        doc.text(truncated, marginLeft + 50, yPos + 1, { width: contentWidth - 54, lineBreak: false });
      }

      yPos += lineHeight;
    }

    // 5. Bottom Footer
    doc.rect(marginLeft, 742, contentWidth, 0.5).fill('#cbd5e1');
    doc.fillColor('#64748b').font('Courier').fontSize(7);
    doc.text(
      `Confidential & Proprietary • Identifying Deposit for Copyright / IP Protection • Aura Ink`,
      marginLeft,
      748,
      { width: contentWidth - 140, lineBreak: false }
    );
    doc.text(
      `Page ${pageNum} of ${TOTAL_PAGES}`,
      marginLeft + contentWidth - 100,
      748,
      { width: 100, align: 'right', lineBreak: false }
    );
  }

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => resolve(outputPath));
    writeStream.on('error', reject);
  });
}

async function main() {
  console.log('Generating exactly 10-page PDF source code deposits...');

  const unifiedLines = buildUnifiedCodeLines();
  console.log(`Unified codebase: ${unifiedLines.length} lines total.`);

  const appLines = buildAppTsxLines();
  console.log(`src/App.tsx: ${appLines.length} lines total.`);

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Unified Project: First 10 Pages
  const p1 = path.join(publicDir, 'first_10_pages_source_code.pdf');
  await generate10PagePdf({
    lines: unifiedLines,
    outputPath: p1,
    title: 'First 10 Pages of Source Code',
    subtitle: 'Unified Project Deposit: server.ts, index.html, main.tsx, src/App.tsx',
    isEndingSection: false
  });
  console.log(`Generated: ${p1}`);

  // 2. Unified Project: Last 10 Pages
  const p2 = path.join(publicDir, 'last_10_pages_source_code.pdf');
  await generate10PagePdf({
    lines: unifiedLines,
    outputPath: p2,
    title: 'Last 10 Pages of Source Code',
    subtitle: 'Unified Project Concluding Deposit: Vedic Algorithms & Indian Ephemeris Coordinates',
    isEndingSection: true
  });
  console.log(`Generated: ${p2}`);

  // 3. src/App.tsx Core File: First 10 Pages
  const p3 = path.join(publicDir, 'first_10_pages_app_tsx.pdf');
  await generate10PagePdf({
    lines: appLines,
    outputPath: p3,
    title: 'First 10 Pages of Core Source Code (src/App.tsx)',
    subtitle: 'State Machine, Zodiac Archetypes, Audio Engine & Modals',
    isEndingSection: false
  });
  console.log(`Generated: ${p3}`);

  // 4. src/App.tsx Core File: Last 10 Pages
  const p4 = path.join(publicDir, 'last_10_pages_app_tsx.pdf');
  await generate10PagePdf({
    lines: appLines,
    outputPath: p4,
    title: 'Last 10 Pages of Core Source Code (src/App.tsx)',
    subtitle: 'Ending Component Hierarchy, Modals, Render Tree & Export Root',
    isEndingSection: true
  });
  console.log(`Generated: ${p4}`);

  // Copy to root as well
  fs.copyFileSync(p1, path.join(process.cwd(), 'first_10_pages_source_code.pdf'));
  fs.copyFileSync(p2, path.join(process.cwd(), 'last_10_pages_source_code.pdf'));

  console.log('Done!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
