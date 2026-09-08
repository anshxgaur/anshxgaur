// scripts/generate-projects.mjs
// Renders a curated list of projects as a static "terminal dashboard" SVG
// showing ALL projects at once (no cycling/animation between them).

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

function buildSvg(projects, username) {
  const width = 800;
  const headerHeight = 34;
  const topPad = 20;
  const cardHeight = 92;
  const cardGap = 14;
  const bottomPad = 24;
  const n = projects.length;

  const height =
    headerHeight + topPad + n * cardHeight + (n - 1) * cardGap + bottomPad;

  const cards = projects
    .map((p, i) => {
      const cardY = headerHeight + topPad + i * (cardHeight + cardGap);
      const name = escapeXml(truncate(p.name, 30));
      const descLines = wrapText(p.desc, 82, 2).map(escapeXml);
      const techLine = escapeXml(truncate(p.tech, 82));

      const descTspans = descLines
        .map(
          (line, idx) =>
            `<tspan x="80" dy="${idx === 0 ? 0 : 16}">${line}</tspan>`
        )
        .join("");

      return `
    <g>
      <rect x="55" y="${cardY}" width="690" height="${cardHeight}" rx="6" fill="#0d1117" fill-opacity="0.5" stroke="#0ff" stroke-opacity="0.3" stroke-width="1"/>
      <rect x="55" y="${cardY}" width="4" height="${cardHeight}" fill="#0ff" opacity="0.8"/>
      <text x="80" y="${cardY + 24}" class="proj-name">${name}</text>
      <text y="${cardY + 44}" class="proj-desc">${descTspans}</text>
      <text x="80" y="${cardY + 84}" class="proj-meta">${techLine}</text>
    </g>`;
    })
    .join("\n");

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#050810"/>
      <stop offset="100%" stop-color="#0a0e1a"/>
    </linearGradient>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#0ff" stroke-opacity="0.06" stroke-width="1"/>
    </pattern>
    <style>
      .title { font-family: 'Courier New', monospace; font-size: 13px; fill: #0ff; letter-spacing: 2px; }
      .proj-name { font-family: 'Courier New', monospace; font-weight: bold; font-size: 17px; fill: #e6f7ff; }
      .proj-desc { font-family: 'Courier New', monospace; font-size: 12px; fill: #8b949e; }
      .proj-meta { font-family: 'Courier New', monospace; font-size: 11.5px; fill: #7ee787; }
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

    ${cards}

    <text x="${width - 20}" y="${height - 10}" text-anchor="end" class="footer">${n} project(s) tracked</text>
  </g>
</svg>`;
}

async function main() {
  const svg = buildSvg(PROJECTS, GITHUB_USER);

  const fs = await import("fs/promises");
  await fs.mkdir("dist", { recursive: true });
  await fs.writeFile("dist/projects.svg", svg, "utf-8");
  console.log(`Generated projects.svg with ${PROJECTS.length} project(s), all shown statically.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
