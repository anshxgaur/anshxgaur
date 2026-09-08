// scripts/generate-projects.mjs
// Renders a curated list of projects as a cycling,
// futuristic "terminal scanner" animated SVG.

const GITHUB_USER = process.env.GITHUB_USER_NAME || "anshxgaur";

// ---- Your project data lives here ----
// Edit this array whenever you want to add/update/remove a project.
// "desc"  -> shown as the main description line ("what it solves")
// "tech"  -> shown as the tech/stack line
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
  const width = 760;
  const height = 220;
  const perSlot = 5.5;
  const fadeFrac = 0.08;
  const n = projects.length;
  const total = perSlot * n;

  const cards = projects
    .map((p, i) => {
      const start = i / n;
      const end = (i + 1) / n;
      const fadeIn = start + (end - start) * fadeFrac;
      const fadeOut = end - (end - start) * fadeFrac;
      const keyTimes = [0, start, fadeIn, fadeOut, end, 1]
        .map((t) => Math.min(1, Math.max(0, t)).toFixed(4))
        .join(";");
      const values = "0;0;1;1;0;0";

      const name = escapeXml(truncate(p.name, 30));
      const descLines = wrapText(p.desc, 78, 2).map(escapeXml);
      const techLine = escapeXml(truncate(p.tech, 78));

      const descTspans = descLines
        .map(
          (line, idx) =>
            `<tspan x="60" dy="${idx === 0 ? 0 : 16}">${line}</tspan>`
        )
        .join("");

      return `
    <g opacity="0">
      <animate attributeName="opacity" values="${values}" keyTimes="${keyTimes}" dur="${total}s" begin="0s" repeatCount="indefinite" />

      <!-- glitch scan-in bar -->
      <rect x="40" y="70" width="4" height="105" fill="#0ff" opacity="0.8">
        <animate attributeName="x" values="40;660;660" keyTimes="0;0.15;1" dur="${total}s" begin="0s" repeatCount="indefinite" />
      </rect>

      <text x="60" y="95" class="proj-name">${name}</text>
      <text y="120" class="proj-desc">${descTspans}</text>
      <text x="60" y="160" class="proj-meta">${techLine}</text>
      <rect x="55" y="65" width="650" height="115" rx="6" fill="none" stroke="#0ff" stroke-opacity="0.35" stroke-width="1"/>
    </g>`;
    })
    .join("\n");

  const dots = projects
    .map((_, i) => {
      const start = i / n;
      const end = (i + 1) / n;
      return `<circle cx="${60 + i * 22}" cy="200" r="4" fill="#30363d">
        <animate attributeName="fill" values="#30363d;#0ff;#30363d" keyTimes="0;${(
          (start + end) /
          2
        ).toFixed(4)};1" dur="${total}s" begin="0s" repeatCount="indefinite" />
      </circle>`;
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
      .proj-name { font-family: 'Courier New', monospace; font-weight: bold; font-size: 19px; fill: #e6f7ff; }
      .proj-desc { font-family: 'Courier New', monospace; font-size: 12.5px; fill: #8b949e; }
      .proj-meta { font-family: 'Courier New', monospace; font-size: 12px; fill: #7ee787; }
      .footer { font-family: 'Courier New', monospace; font-size: 11px; fill: #484f58; }
    </style>
    <clipPath id="rounded"><rect width="${width}" height="${height}" rx="10" ry="10"/></clipPath>
  </defs>

  <g clip-path="url(#rounded)">
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    <rect width="${width}" height="${height}" fill="url(#grid)"/>

    <rect width="${width}" height="34" fill="#0d1117" fill-opacity="0.85"/>
    <circle cx="20" cy="17" r="5" fill="#ff5f56"/>
    <circle cx="38" cy="17" r="5" fill="#ffbd2e"/>
    <circle cx="56" cy="17" r="5" fill="#27c93f"/>
    <text x="${width / 2}" y="22" text-anchor="middle" class="title">PROJECTS.SYS — ${escapeXml(username)}</text>

    <rect x="0" y="0" width="${width}" height="2" fill="#0ff" opacity="0.5">
      <animate attributeName="y" values="34;${height};34" dur="6s" repeatCount="indefinite"/>
    </rect>

    ${cards}
    ${dots}

    <text x="${width - 20}" y="${height - 10}" text-anchor="end" class="footer">auto-scanning repositories…</text>
  </g>
</svg>`;
}

async function main() {
  const svg = buildSvg(PROJECTS, GITHUB_USER);

  const fs = await import("fs/promises");
  await fs.mkdir("dist", { recursive: true });
  await fs.writeFile("dist/projects.svg", svg, "utf-8");
  console.log(`Generated projects.svg with ${PROJECTS.length} project(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
