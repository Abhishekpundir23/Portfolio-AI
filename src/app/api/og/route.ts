import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'Portfolio Case Study';
  const username = searchParams.get('username') || 'user';
  const tools = searchParams.get('tools') || '';

  // Generate an SVG-based OG image (no external dependencies needed)
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0a0a0a"/>
          <stop offset="50%" style="stop-color:#0f0d1a"/>
          <stop offset="100%" style="stop-color:#0a0f1a"/>
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#6366f1"/>
          <stop offset="50%" style="stop-color:#8b5cf6"/>
          <stop offset="100%" style="stop-color:#ec4899"/>
        </linearGradient>
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ffffff"/>
          <stop offset="100%" style="stop-color:#c4b5fd"/>
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bg)"/>
      
      <!-- Decorative circles -->
      <circle cx="1050" cy="100" r="200" fill="#6366f1" opacity="0.08"/>
      <circle cx="150" cy="530" r="180" fill="#ec4899" opacity="0.06"/>
      
      <!-- Top accent bar -->
      <rect x="0" y="0" width="1200" height="4" fill="url(#accent)"/>
      
      <!-- Grid dots pattern -->
      ${Array.from({ length: 20 }, (_, i) =>
        Array.from({ length: 10 }, (_, j) =>
          `<circle cx="${60 + i * 60}" cy="${60 + j * 60}" r="1" fill="#ffffff" opacity="0.06"/>`
        ).join('')
      ).join('')}
      
      <!-- Case Study badge -->
      <rect x="60" y="60" width="140" height="32" rx="6" fill="#6366f1" opacity="0.2"/>
      <rect x="60" y="60" width="140" height="32" rx="6" fill="none" stroke="#6366f1" stroke-width="1" opacity="0.4"/>
      <text x="130" y="82" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#818cf8" text-anchor="middle" letter-spacing="2">CASE STUDY</text>
      
      <!-- Username -->
      <text x="220" y="82" font-family="monospace" font-size="14" fill="#666666">portfolio.ai/${escapeXml(username)}</text>
      
      <!-- Main title (word-wrapped) -->
      ${wrapText(title, 60, 160, 1040, 42, '#ffffff', '800')}
      
      <!-- Tools tags -->
      ${tools ? generateToolTags(tools, 60, 460) : ''}
      
      <!-- Bottom bar -->
      <rect x="0" y="590" width="1200" height="40" fill="#000000" opacity="0.5"/>
      <text x="60" y="616" font-family="system-ui, sans-serif" font-size="14" fill="#666666">Built with</text>
      <text x="135" y="616" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#a78bfa">Portfolio.ai</text>
      <text x="1140" y="616" font-family="system-ui, sans-serif" font-size="13" fill="#444444" text-anchor="end">AI-Powered Proof of Work</text>
    </svg>
  `;

  // Convert SVG to PNG-like response (SVG works fine for OG images on most platforms)
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function wrapText(text: string, x: number, y: number, maxWidth: number, fontSize: number, fill: string, fontWeight: string): string {
  const safeText = escapeXml(text);
  const charsPerLine = Math.floor(maxWidth / (fontSize * 0.52));
  const words = safeText.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    if ((current + ' ' + word).trim().length > charsPerLine) {
      lines.push(current.trim());
      current = word;
    } else {
      current += ' ' + word;
    }
  }
  if (current.trim()) lines.push(current.trim());

  // Max 3 lines
  const displayLines = lines.slice(0, 3);
  if (lines.length > 3) {
    displayLines[2] = displayLines[2].slice(0, -3) + '...';
  }

  return displayLines.map((line, i) =>
    `<text x="${x}" y="${y + i * (fontSize + 12)}" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="${fontWeight}" fill="${fill}" letter-spacing="-0.5">${line}</text>`
  ).join('\n');
}

function generateToolTags(tools: string, startX: number, y: number): string {
  const items = tools.split(',').map(t => t.trim()).filter(Boolean).slice(0, 5);
  let x = startX;
  return items.map(tool => {
    const width = tool.length * 9 + 24;
    const tag = `
      <rect x="${x}" y="${y}" width="${width}" height="28" rx="6" fill="#ffffff" opacity="0.06"/>
      <rect x="${x}" y="${y}" width="${width}" height="28" rx="6" fill="none" stroke="#ffffff" stroke-width="0.5" opacity="0.15"/>
      <text x="${x + width / 2}" y="${y + 18}" font-family="monospace" font-size="12" fill="#999999" text-anchor="middle">${escapeXml(tool)}</text>
    `;
    x += width + 10;
    return tag;
  }).join('');
}
