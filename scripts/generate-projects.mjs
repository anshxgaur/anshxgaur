// scripts/generate-projects.mjs
// Renders a curated project grid as a static SVG "dashboard".
// Redesigned: 2-column card grid, per-project accent colors, pill-style
// tech tags, index badges — instead of one stacked column of identical
// bricks.

const GITHUB_USER = process.env.GITHUB_USER_NAME || "anshxgaur";

// ---- Your project data lives here ----
// Edit this array whenever you want to add/update/remove a project.
const PROJECTS = [
  {
    name: "Nexus Workspace",
    desc: "Self-hosted AI-powered corporate workspace with team chat, meetings, live transcription, RAG search, and task extraction.",
    tech: "FastAPI, React, Tauri, TailwindCSS, Zustand, PostgreSQL, Redis, Qdrant, Whisper, LiveKit, Ollama, WebSockets",
  },
  {
    name: "VISTA",
    desc: "Healthcare data intelligence system for EDA, disease prediction, risk stratification, and clinical decision support.",
    tech: "Python, Pandas, NumPy, Scikit-learn, Streamlit, Matplotlib, Seaborn, ML pipelines",
  },
  {
    name: "NOVA",
    desc: "Personal AI assistant architecture focused on local inference, voice interaction, security checks, and task orchestration.",
    tech: "TypeScript, AI architecture, STT/TTS pipeline, prompt-injection defense, modular orchestration",
  },
  {
    name: "F1 Data Analytics",
    desc: "Formula 1 analytics platform for tire degradation, pit-window reasoning, and driver performance comparison.",
    tech: "TypeScript, Next.js, data visualization, analytics dashboards, strategy modeling",
  },
  {
    name: "ASTRA",
    desc: "AI-powered unified search platform merging 1,000 resumes, 20 research papers, and 6 fragmented data sources into one semantic search + RAG Q&A portal.",
    tech: "FastAPI, PostgreSQL + pgvector, fastembed, Groq LLM (text-to-SQL + RAG), Docker",
  },
];

// One accent color per project, cycled if there are more projects than colors.
const ACCENTS = ["#00D9FF", "#7C3AED", "#F97316", "#22C55E", "#EC4899", "#FACC15"];

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function truncate(str, max) {
  if (str.length <= max) return str;
  return str.slice(0, max - 1).trimEnd() + "…";
}

function wrapText(str, maxCharsPerLine, maxLines) {
  const words = str.split(" ");
  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxCharsPerLine) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
    if (lines.length === maxLines) break;
  }
  if (lines.length < maxLines && current) lines.push(current);

  if (lines.length === maxLines) {
    const last = lines[maxLines - 1];
    if (last.length > maxCharsPerLine - 1) {
      lines[maxLines - 1] = truncate(last, maxCharsPerLine);
    } else if (words.join(" ").length > lines.join(" ").length) {
      lines[maxLines - 1] = truncate(last + "…", maxCharsPerLine);
    }
  }

  return lines;
}

// Lay out a project's tech string as small pill/chip badges that wrap
// within `maxWidth`. Returns the chip markup and how tall the block ended
// up being, so the caller can size the card correctly.
function buildChips(techStr, accent, x0, y0, maxWidth, maxRows) {
  const tags = techStr.split(",").map((t) => t.trim()).filter(Boolean);
  const chipHeight = 20;
  const rowGap = 8;
  const chipGap = 7;
  const charW = 6.3; // approx width of an 11px monospace character
  const paddingX = 10;

  let x = x0;
  let y = y0;
  let row = 0;
  const chips = [];

  for (const tag of tags) {
    if (row >= maxRows) {
      // Signal overflow with a "+N more" chip on the last row.
      break;
    }
    const label = tag;
    const w = Math.round(label.length * charW + paddingX * 2);

    if (x + w > x0 + maxWidth) {
      row += 1;
      if (row >= maxRows) break;
      x = x0;
      y += chipHeight + rowGap;
    }

    chips.push(
      `<g>
        <rect x="${x}" y="${y}" width="${w}" height="${chipHeight}" rx="${chipHeight / 2}" fill="${accent}" fill-opacity="0.12" stroke="${accent}" stroke-opacity="0.55" stroke-width="1"/>
        <text x="${x + w / 2}" y="${y + chipHeight / 2 + 4}" text-anchor="middle" class="chip-text" fill="${accent}">${escapeXml(label)}</text>
      </g>`
    );

    x += w + chipGap;
  }

  const usedRows = row + 1;
  const blockHeight = usedRows * chipHeight + (usedRows - 1) * rowGap;
  return { markup: chips.join("\n"), height: blockHeight };
}

function buildCard(project, index, x, y, cardWidth, cardHeight) {
  const accent = ACCENTS[index % ACCENTS.length];
  const pad = 18;
  const contentWidth = cardWidth - pad * 2;

  const name = escapeXml(truncate(project.name, 28));
  const idx = String(index + 1).padStart(2, "0");

  // How many chars fit per description line at this card width
  // (~6.5px per character at 12px monospace).
  const maxChars = Math.max(20, Math.floor(contentWidth / 6.6));
  const descLines = wrapText(project.desc, maxChars, 3).map(escapeXml);
  const descTspans = descLines
    .map((line, i) => `<tspan x="${x + pad}" dy="${i === 0 ? 0 : 16}">${line}</tspan>`)
    .join("");

  const titleY = y + 34;
  const descY = titleY + 22;
  const chipsY = descY + descLines.length * 16 + 6;

  const chips = buildChips(project.tech, accent, x + pad, chipsY, contentWidth, 2);

  return `
  <g>
    <!-- card shell -->
    <rect x="${x}" y="${y}" width="${cardWidth}" height="${cardHeight}" rx="12" fill="#0d1117" fill-opacity="0.55" stroke="${accent}" stroke-opacity="0.35" stroke-width="1.2"/>
    <!-- top accent stripe -->
    <rect x="${x}" y="${y}" width="${cardWidth}" height="3" rx="1.5" fill="${accent}"/>
    <!-- index badge -->
    <circle cx="${x + cardWidth - 26}" cy="${y + 24}" r="14" fill="${accent}" fill-opacity="0.12" stroke="${accent}" stroke-opacity="0.6" stroke-width="1"/>
    <text x="${x + cardWidth - 26}" y="${y + 28}" text-anchor="middle" class="idx-text" fill="${accent}">${idx}</text>

    <text x="${x + pad}" y="${titleY}" class="proj-name">${name}</text>
    <text y="${descY}" class="proj-desc">${descTspans}</text>
    ${chips.markup}
  </g>`;
}

function buildSvg(projects, username) {
  const width = 800;
  const marginX = 40;
  const gap = 18;
  const headerHeight = 34;
  const topPad = 22;
  const bottomPad = 24;
  const cardHeight = 172;
  const contentWidth = width - marginX * 2;
  const colWidth = (contentWidth - gap) / 2;

  const fullRowCount = Math.floor(projects.length / 2);
  const hasOddCard = projects.length % 2 === 1;
  const rowCount = fullRowCount + (hasOddCard ? 1 : 0);
  const height =
    headerHeight + topPad + rowCount * cardHeight + (rowCount - 1) * gap + bottomPad;

  const cards = [];
  let row = 0;
  for (let i = 0; i < projects.length; i += 2) {
    const y = headerHeight + topPad + row * (cardHeight + gap);
    const isLastOdd = hasOddCard && i === projects.length - 1;

    if (isLastOdd) {
      // Odd one out spans the full width instead of leaving a gap,
      // so the grid never ends on an awkward half-empty row.
      cards.push(buildCard(projects[i], i, marginX, y, contentWidth, cardHeight));
    } else {
      cards.push(buildCard(projects[i], i, marginX, y, colWidth, cardHeight));
      if (projects[i + 1]) {
        cards.push(
          buildCard(projects[i + 1], i + 1, marginX + colWidth + gap, y, colWidth, cardHeight)
        );
      }
    }
    row += 1;
  }

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#050810"/>
      <stop offset="100%" stop-color="#0a0e1a"/>
    </linearGradient>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#0ff" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
    <style>
      .title { font-family: 'Courier New', monospace; font-size: 13px; fill: #0ff; letter-spacing: 2px; }
      .proj-name { font-family: 'Courier New', monospace; font-weight: bold; font-size: 16px; fill: #e6f7ff; }
      .proj-desc { font-family: 'Courier New', monospace; font-size: 12px; fill: #8b949e; }
      .chip-text { font-family: 'Courier New', monospace; font-size: 10.5px; font-weight: 600; }
      .idx-text { font-family: 'Courier New', monospace; font-size: 11px; font-weight: bold; }
      .footer { font-family: 'Courier New', monospace; font-size: 11px; fill: #484f58; }
    </style>
    <clipPath id="rounded"><rect width="${width}" height="${height}" rx="10" ry="10"/></clipPath>
  </defs>

  <g clip-path="url(#rounded)">
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    <rect width="${width}" height="${height}" fill="url(#grid)"/>

    <rect width="${width}" height="${headerHeight}" fill="#0d1117" fill-opacity="0.85"/>
    <circle cx="20" cy="17" r="5" fill="#ff5f56"/>
    <circle cx="38" cy="17" r="5" fill="#ffbd2e"/>
    <circle cx="56" cy="17" r="5" fill="#27c93f"/>
    <text x="${width / 2}" y="22" text-anchor="middle" class="title">PROJECTS.SYS — ${escapeXml(username)}</text>

    <rect x="0" y="0" width="${width}" height="2" fill="#0ff" opacity="0.5">
      <animate attributeName="y" values="34;${height};34" dur="6s" repeatCount="indefinite"/>
    </rect>

    ${cards.join("\n")}

    <text x="${width - 20}" y="${height - 10}" text-anchor="end" class="footer">${projects.length} project(s) tracked</text>
  </g>
</svg>`;
}

async function main() {
  const svg = buildSvg(PROJECTS, GITHUB_USER);

  const fs = await import("fs/promises");
  await fs.mkdir("dist", { recursive: true });
  await fs.writeFile("dist/projects.svg", svg, "utf-8");
  console.log(`Generated projects.svg with ${PROJECTS.length} project(s) in a grid layout.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
