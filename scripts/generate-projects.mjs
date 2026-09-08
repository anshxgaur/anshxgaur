// scripts/generate-projects.mjs
//
// Generates:
//   dist/projects.svg       -> visual project dashboard for README
//   dist/index.html         -> interactive architecture explorer
//
// Designed for the ans hxgaur GitHub profile repository.
//
// Environment:
//   GITHUB_USER_NAME
//   GITHUB_REPOSITORY
//   GITHUB_TOKEN             optional
//

const GITHUB_USER =
  process.env.GITHUB_USER_NAME ||
  process.env.GITHUB_REPOSITORY?.split("/")[0] ||
  "anshxgaur";

const REPOSITORY =
  process.env.GITHUB_REPOSITORY ||
  `${GITHUB_USER}/${GITHUB_USER}`;

const REPO_URL = `https://github.com/${REPOSITORY}`;

const PROJECTS = [
  {
    id: "nexus",
    number: "01",
    name: "Nexus Workspace",
    type: "AI CORPORATE WORKSPACE",
    desc:
      "Self-hosted AI-powered corporate workspace with team chat, meetings, live transcription, RAG search, and task extraction.",
    tech: [
      "FastAPI",
      "React",
      "Tauri",
      "TailwindCSS",
      "Zustand",
      "PostgreSQL",
      "Redis",
      "Qdrant",
      "Whisper",
      "LiveKit",
      "Ollama",
      "WebSockets",
    ],
    accent: "#00D9FF",

    architecture: [
      ["Users", "client"],
      ["React + Tauri", "client"],
      ["FastAPI", "api"],
      ["Realtime Gateway", "realtime"],
      ["RAG Engine", "ai"],
      ["Qdrant", "database"],
      ["PostgreSQL", "database"],
      ["Redis", "database"],
      ["Whisper", "ai"],
      ["LiveKit", "realtime"],
      ["Ollama", "ai"],
    ],

    flow: [
      ["USER", "CLIENT"],
      ["CLIENT", "API"],
      ["API", "RAG"],
      ["API", "REALTIME"],
      ["RAG", "VECTOR"],
      ["RAG", "LLM"],
      ["REALTIME", "WHISPER"],
      ["REALTIME", "LIVEKIT"],
      ["API", "POSTGRES"],
      ["API", "REDIS"],
    ],

    layers: [
      {
        name: "CLIENT",
        items: ["React", "Tauri", "TailwindCSS", "Zustand"],
      },
      {
        name: "BACKEND",
        items: ["FastAPI", "WebSockets"],
      },
      {
        name: "AI",
        items: ["RAG", "Qdrant", "Whisper", "Ollama"],
      },
      {
        name: "DATA",
        items: ["PostgreSQL", "Redis"],
      },
      {
        name: "REALTIME",
        items: ["LiveKit", "WebSockets"],
      },
    ],
  },

  {
    id: "vista",
    number: "02",
    name: "VISTA",
    type: "HEALTHCARE DATA INTELLIGENCE",
    desc:
      "Healthcare data intelligence system for EDA, disease prediction, risk stratification, and clinical decision support.",
    tech: [
      "Python",
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "Streamlit",
      "Matplotlib",
      "Seaborn",
      "ML Pipelines",
    ],
    accent: "#7C3AED",

    architecture: [
      ["Healthcare Data", "input"],
      ["Data Cleaning", "processing"],
      ["EDA", "analytics"],
      ["Feature Engineering", "processing"],
      ["ML Pipeline", "ml"],
      ["Risk Stratification", "ml"],
      ["Disease Prediction", "ml"],
      ["Clinical Dashboard", "ui"],
    ],

    flow: [
      ["DATA", "CLEAN"],
      ["CLEAN", "EDA"],
      ["EDA", "FEATURES"],
      ["FEATURES", "MODEL"],
      ["MODEL", "RISK"],
      ["MODEL", "PREDICTION"],
      ["RISK", "DASHBOARD"],
      ["PREDICTION", "DASHBOARD"],
    ],

    layers: [
      {
        name: "DATA",
        items: ["Healthcare Data", "Pandas", "NumPy"],
      },
      {
        name: "ANALYTICS",
        items: ["EDA", "Matplotlib", "Seaborn"],
      },
      {
        name: "ML",
        items: ["Scikit-learn", "Feature Engineering", "ML Pipelines"],
      },
      {
        name: "APPLICATION",
        items: ["Streamlit", "Risk Dashboard", "Clinical Support"],
      },
    ],
  },

  {
    id: "nova",
    number: "03",
    name: "NOVA",
    type: "LOCAL AI ASSISTANT",
    desc:
      "Personal AI assistant architecture focused on local inference, voice interaction, security checks, and task orchestration.",
    tech: [
      "TypeScript",
      "AI Architecture",
      "STT/TTS",
      "Prompt Defense",
      "Local Inference",
      "Task Routing",
      "Modular Orchestration",
    ],
    accent: "#F97316",

    architecture: [
      ["User", "input"],
      ["Voice Input", "voice"],
      ["STT", "voice"],
      ["Security Layer", "security"],
      ["Intent Router", "orchestration"],
      ["Task Agent", "agent"],
      ["Local LLM", "ai"],
      ["TTS", "voice"],
    ],

    flow: [
      ["USER", "VOICE"],
      ["VOICE", "STT"],
      ["STT", "SECURITY"],
      ["SECURITY", "ROUTER"],
      ["ROUTER", "AGENT"],
      ["AGENT", "LLM"],
      ["LLM", "TTS"],
      ["TTS", "USER"],
    ],

    layers: [
      {
        name: "INTERFACE",
        items: ["Voice Input", "STT", "TTS"],
      },
      {
        name: "SECURITY",
        items: ["Prompt-Injection Defense", "Security Checks"],
      },
      {
        name: "ORCHESTRATION",
        items: ["Intent Router", "Task Routing", "Agents"],
      },
      {
        name: "INFERENCE",
        items: ["Local LLM", "Local-First AI"],
      },
    ],
  },

  {
    id: "f1",
    number: "04",
    name: "F1 Data Analytics",
    type: "FORMULA 1 STRATEGY ENGINE",
    desc:
      "Formula 1 analytics platform for tire degradation, pit-window reasoning, and driver performance comparison.",
    tech: [
      "TypeScript",
      "Next.js",
      "Data Visualization",
      "Analytics Dashboards",
      "Strategy Modeling",
    ],
    accent: "#22C55E",

    architecture: [
      ["Race Data", "input"],
      ["Telemetry", "input"],
      ["Driver Data", "input"],
      ["Data Processing", "processing"],
      ["Tire Model", "model"],
      ["Pit Window", "strategy"],
      ["Driver Performance", "analytics"],
      ["Strategy Dashboard", "ui"],
    ],

    flow: [
      ["RACE", "PROCESS"],
      ["TELEMETRY", "PROCESS"],
      ["DRIVER", "PROCESS"],
      ["PROCESS", "TIRE"],
      ["PROCESS", "DRIVER_MODEL"],
      ["TIRE", "STRATEGY"],
      ["DRIVER_MODEL", "STRATEGY"],
      ["STRATEGY", "DASHBOARD"],
    ],

    layers: [
      {
        name: "INPUT",
        items: ["Race Data", "Telemetry", "Driver Data"],
      },
      {
        name: "PROCESSING",
        items: ["Data Processing", "Normalization"],
      },
      {
        name: "MODELS",
        items: ["Tire Degradation", "Driver Performance"],
      },
      {
        name: "STRATEGY",
        items: ["Pit Windows", "Race Strategy"],
      },
      {
        name: "UI",
        items: ["Next.js", "Analytics Dashboard"],
      },
    ],
  },

  {
    id: "astra",
    number: "05",
    name: "ASTRA",
    type: "SEMANTIC RESEARCH ENGINE",
    desc:
      "AI-powered unified search platform merging 1,000 resumes, 20 research papers, and 6 fragmented data sources into one semantic search + RAG Q&A portal.",
    tech: [
      "FastAPI",
      "PostgreSQL",
      "pgvector",
      "fastembed",
      "Groq LLM",
      "Text-to-SQL",
      "RAG",
      "Docker",
    ],
    accent: "#EC4899",

    architecture: [
      ["User", "input"],
      ["Search / Q&A", "ui"],
      ["FastAPI", "api"],
      ["Embedding", "ai"],
      ["pgvector", "database"],
      ["Text-to-SQL", "ai"],
      ["Groq LLM", "ai"],
      ["RAG Context", "ai"],
      ["Sources", "data"],
    ],

    flow: [
      ["USER", "SEARCH"],
      ["SEARCH", "API"],
      ["API", "EMBED"],
      ["EMBED", "VECTOR"],
      ["VECTOR", "RAG"],
      ["API", "SQL"],
      ["SQL", "LLM"],
      ["RAG", "LLM"],
      ["LLM", "ANSWER"],
    ],

    layers: [
      {
        name: "INTERFACE",
        items: ["Search", "Q&A"],
      },
      {
        name: "API",
        items: ["FastAPI"],
      },
      {
        name: "RETRIEVAL",
        items: ["fastembed", "pgvector", "Semantic Search"],
      },
      {
        name: "REASONING",
        items: ["RAG", "Text-to-SQL", "Groq LLM"],
      },
      {
        name: "DATA",
        items: ["1,000 Resumes", "20 Papers", "6 Sources"],
      },
    ],
  },
];

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function truncate(value, max) {
  if (value.length <= max) return value;
  return value.slice(0, max - 1).trimEnd() + "…";
}

function wrapText(text, maxChars, maxLines) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;

    if (candidate.length > maxChars) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = candidate;
    }

    if (lines.length >= maxLines) break;
  }

  if (lines.length < maxLines && current) {
    lines.push(current);
  }

  if (lines.length === maxLines) {
    const reconstructed = lines.join(" ");

    if (reconstructed.length < text.length) {
      lines[maxLines - 1] =
        truncate(lines[maxLines - 1], maxChars - 1) + "…";
    }
  }

  return lines;
}

// ------------------------------------------------------------
// SVG chip builder
// ------------------------------------------------------------

function buildChips(tags, accent, x, y, maxWidth, maxRows = 2) {
  const chipHeight = 22;
  const gapX = 7;
  const gapY = 7;
  const charWidth = 6.2;
  const padding = 10;

  let currentX = x;
  let currentY = y;
  let row = 0;

  const result = [];

  for (let i = 0; i < tags.length; i++) {
    if (row >= maxRows) break;

    const label = tags[i];
    const width =
      Math.round(label.length * charWidth + padding * 2);

    if (currentX + width > x + maxWidth) {
      row += 1;

      if (row >= maxRows) break;

      currentX = x;
      currentY += chipHeight + gapY;
    }

    result.push(`
      <g>
        <rect
          x="${currentX}"
          y="${currentY}"
          width="${width}"
          height="${chipHeight}"
          rx="11"
          fill="${accent}"
          fill-opacity="0.08"
          stroke="${accent}"
          stroke-opacity="0.38"
        />

        <text
          x="${currentX + width / 2}"
          y="${currentY + 15}"
          text-anchor="middle"
          class="chip"
          fill="${accent}"
        >${escapeXml(label)}</text>
      </g>
    `);

    currentX += width + gapX;
  }

  return result.join("\n");
}

// ------------------------------------------------------------
// Mini architecture visualization
// ------------------------------------------------------------

function buildMiniArchitecture(project, x, y, width) {
  const accent = project.accent;

  const nodes = project.architecture.slice(0, 7);

  const nodeW = Math.min(125, (width - 50) / 3);
  const nodeH = 32;
  const gapX = 14;
  const gapY = 15;

  let output = "";

  nodes.forEach((node, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);

    const nx = x + col * (nodeW + gapX);
    const ny = y + row * (nodeH + gapY);

    output += `
      <g>
        <rect
          x="${nx}"
          y="${ny}"
          width="${nodeW}"
          height="${nodeH}"
          rx="7"
          fill="#080C13"
          stroke="${accent}"
          stroke-opacity="0.30"
        />

        <circle
          cx="${nx + 10}"
          cy="${ny + 16}"
          r="3"
          fill="${accent}"
        />

        <text
          x="${nx + 19}"
          y="${ny + 20}"
          class="architecture-node"
        >${escapeXml(truncate(node[0], 19))}</text>
      </g>
    `;

    if (index < nodes.length - 1) {
      const nextCol = (index + 1) % 3;
      const nextRow = Math.floor((index + 1) / 3);

      const x1 =
        col < 2
          ? nx + nodeW
          : nx + nodeW / 2;

      const y1 =
        col < 2
          ? ny + nodeH / 2
          : ny + nodeH;

      const nextX =
        x +
        nextCol * (nodeW + gapX);

      const nextY =
        y +
        nextRow * (nodeH + gapY);

      const x2 =
        col < 2
          ? nextX
          : nextX + nodeW / 2;

      const y2 =
        col < 2
          ? nextY + nodeH / 2
          : nextY;

      output += `
        <line
          x1="${x1}"
          y1="${y1}"
          x2="${x2}"
          y2="${y2}"
          stroke="${accent}"
          stroke-opacity="0.22"
          stroke-width="1"
          stroke-dasharray="4 4"
        />
      `;
    }
  });

  return output;
}

// ------------------------------------------------------------
// SVG card
// ------------------------------------------------------------

function buildCard(project, x, y, width, height) {
  const accent = project.accent;
  const pad = 20;

  const titleY = y + 35;
  const typeY = y + 53;
  const descY = y + 78;

  const descLines = wrapText(
    project.desc,
    Math.floor((width - pad * 2) / 6.6),
    2
  );

  const descSvg = descLines
    .map(
      (line, i) => `
        <tspan
          x="${x + pad}"
          dy="${i === 0 ? 0 : 15}"
        >${escapeXml(line)}</tspan>
      `
    )
    .join("");

  const architectureY = y + 117;

  const architecture = buildMiniArchitecture(
    project,
    x + pad,
    architectureY,
    width - pad * 2
  );

  const chips = buildChips(
    project.tech,
    accent,
    x + pad,
    y + height - 48,
    width - pad * 2,
    1
  );

  const projectUrl = `${REPO_URL}/tree/main/projects/${project.id}`;

  return `
    <a href="${escapeXml(projectUrl)}">
      <g class="project-card">

        <rect
          x="${x}"
          y="${y}"
          width="${width}"
          height="${height}"
          rx="14"
          fill="#0B1018"
          stroke="${accent}"
          stroke-opacity="0.25"
          stroke-width="1"
        />

        <rect
          x="${x}"
          y="${y}"
          width="4"
          height="${height}"
          rx="2"
          fill="${accent}"
        />

        <!-- project number -->
        <text
          x="${x + pad}"
          y="${titleY}"
          class="project-number"
          fill="${accent}"
        >${project.number}</text>

        <!-- project title -->
        <text
          x="${x + pad + 30}"
          y="${titleY}"
          class="project-title"
        >${escapeXml(project.name)}</text>

        <!-- project type -->
        <text
          x="${x + pad + 30}"
          y="${typeY}"
          class="project-type"
          fill="${accent}"
        >${escapeXml(project.type)}</text>

        <!-- description -->
        <text
          x="${x + pad}"
          y="${descY}"
          class="project-description"
        >${descSvg}</text>

        <!-- mini architecture -->
        ${architecture}

        <!-- technologies -->
        ${chips}

        <!-- open indicator -->
        <g class="open-indicator">
          <text
            x="${x + width - 20}"
            y="${y + height - 18}"
            text-anchor="end"
            class="open-text"
            fill="${accent}"
          >OPEN ARCHITECTURE →</text>
        </g>

      </g>
    </a>
  `;
}

// ------------------------------------------------------------
// Main SVG
// ------------------------------------------------------------

function buildSvg(projects, username) {
  const width = 1000;
  const margin = 32;
  const gap = 18;

  const cardWidth = (width - margin * 2 - gap) / 2;
  const cardHeight = 300;

  const rows = Math.ceil(projects.length / 2);

  const headerHeight = 62;
  const footerHeight = 42;

  const height =
    headerHeight +
    margin +
    rows * cardHeight +
    (rows - 1) * gap +
    footerHeight +
    margin;

  const cards = [];

  projects.forEach((project, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;

    const x =
      col === 0
        ? margin
        : margin + cardWidth + gap;

    const y =
      headerHeight +
      margin +
      row * (cardHeight + gap);

    // Last odd project spans the entire row.
    if (index === projects.length - 1 && projects.length % 2 === 1) {
      cards.push(
        buildCard(
          project,
          margin,
          y,
          width - margin * 2,
          cardHeight
        )
      );
    } else {
      cards.push(
        buildCard(
          project,
          x,
          y,
          cardWidth,
          cardHeight
        )
      );
    }
  });

  return `
<svg
  width="${width}"
  height="${height}"
  viewBox="0 0 ${width} ${height}"
  xmlns="http://www.w3.org/2000/svg"
>

  <defs>

    <linearGradient
      id="background"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop offset="0%" stop-color="#05070C"/>
      <stop offset="100%" stop-color="#0A101A"/>
    </linearGradient>

    <pattern
      id="grid"
      width="25"
      height="25"
      patternUnits="userSpaceOnUse"
    >
      <path
        d="M 25 0 L 0 0 0 25"
        fill="none"
        stroke="#00D9FF"
        stroke-opacity="0.045"
      />
    </pattern>

    <filter id="glow">
      <feGaussianBlur
        stdDeviation="3"
        result="blur"
      />
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <style>

      .terminal-title {
        font-family:
          "Courier New",
          monospace;

        font-size: 13px;
        letter-spacing: 2px;
        fill: #BDEFFF;
      }

      .terminal-subtitle {
        font-family:
          "Courier New",
          monospace;

        font-size: 10px;
        letter-spacing: 1px;
        fill: #59636F;
      }

      .project-number {
        font-family:
          "Courier New",
          monospace;

        font-size: 13px;
        font-weight: bold;
      }

      .project-title {
        font-family:
          "Courier New",
          monospace;

        font-size: 17px;
        font-weight: bold;
        fill: #EAF7FF;
      }

      .project-type {
        font-family:
          "Courier New",
          monospace;

        font-size: 9px;
        letter-spacing: 1.3px;
      }

      .project-description {
        font-family:
          "Courier New",
          monospace;

        font-size: 11px;
        fill: #89939F;
      }

      .architecture-node {
        font-family:
          "Courier New",
          monospace;

        font-size: 8px;
        fill: #AAB5C0;
      }

      .chip {
        font-family:
          "Courier New",
          monospace;

        font-size: 8.5px;
        font-weight: bold;
      }

      .open-text {
        font-family:
          "Courier New",
          monospace;

        font-size: 8px;
        letter-spacing: 1px;
        opacity: 0.65;
      }

      .project-card {
        transition:
          transform 160ms ease,
          filter 160ms ease;
      }

      .project-card:hover {
        filter: brightness(1.25);
      }

    </style>

  </defs>

  <!-- background -->
  <rect
    width="${width}"
    height="${height}"
    fill="url(#background)"
  />

  <rect
    width="${width}"
    height="${height}"
    fill="url(#grid)"
  />

  <!-- top terminal bar -->
  <rect
    width="${width}"
    height="62"
    fill="#080C13"
    stroke="#151C25"
  />

  <circle
    cx="25"
    cy="23"
    r="5"
    fill="#FF5F56"
  />

  <circle
    cx="43"
    cy="23"
    r="5"
    fill="#FFBD2E"
  />

  <circle
    cx="61"
    cy="23"
    r="5"
    fill="#27C93F"
  />

  <text
    x="82"
    y="27"
    class="terminal-title"
  >PROJECTS.SYS — ${escapeXml(username)}</text>

  <text
    x="82"
    y="44"
    class="terminal-subtitle"
  >SYSTEM ARCHITECTURE / SELECT A PROJECT TO EXPLORE</text>

  <!-- scanning line -->
  <rect
    x="0"
    y="61"
    width="${width}"
    height="1"
    fill="#00D9FF"
    opacity="0.35"
  >
    <animate
      attributeName="opacity"
      values="0.15;0.6;0.15"
      dur="3s"
      repeatCount="indefinite"
    />
  </rect>

  ${cards.join("\n")}

  <!-- footer -->
  <text
    x="${width - margin}"
    y="${height - 17}"
    text-anchor="end"
    class="terminal-subtitle"
  >${projects.length} SYSTEMS / ARCHITECTURES TRACKED</text>

</svg>
`;
}

// ------------------------------------------------------------
// Interactive architecture explorer
// ------------------------------------------------------------

function buildHtml(projects, username) {
  const projectJson = JSON.stringify(projects);

  return `<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>${escapeHtml(username)} — Architecture Lab</title>

<style>

:root {
  --bg: #05070c;
  --panel: #0a0f17;
  --panel2: #0d131d;
  --text: #e6f7ff;
  --muted: #7d8895;
  --border: #1b2531;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background:
    radial-gradient(
      circle at top,
      #101b29 0,
      var(--bg) 45%
    );

  color: var(--text);

  font-family:
    "Courier New",
    monospace;
}

body::before {
  content: "";

  position: fixed;
  inset: 0;

  pointer-events: none;

  background-image:
    linear-gradient(
      rgba(0,217,255,.025) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(0,217,255,.025) 1px,
      transparent 1px
    );

  background-size: 25px 25px;
}

.container {
  width: min(1250px, calc(100% - 32px));
  margin: 0 auto;
}

header {
  padding: 35px 0 25px;

  border-bottom:
    1px solid var(--border);
}

.terminal {
  color: #00d9ff;

  font-size: 12px;
  letter-spacing: 2px;
}

h1 {
  margin: 10px 0 6px;

  font-size: clamp(28px, 5vw, 52px);

  letter-spacing: -2px;
}

.subtitle {
  color: var(--muted);

  max-width: 700px;

  line-height: 1.7;
}

.layout {
  display: grid;

  grid-template-columns:
    270px
    1fr;

  gap: 22px;

  padding: 25px 0 60px;
}

.sidebar {
  position: sticky;

  top: 20px;

  height: fit-content;

  border:
    1px solid var(--border);

  background:
    rgba(10,15,23,.82);

  backdrop-filter: blur(12px);

  border-radius: 12px;

  padding: 14px;
}

.sidebar-title {
  color: #59636f;

  font-size: 10px;

  letter-spacing: 1.5px;

  padding: 8px;
}

.project-button {
  width: 100%;

  display: block;

  text-align: left;

  border: 0;

  background: transparent;

  color: var(--muted);

  padding: 13px 10px;

  border-radius: 8px;

  cursor: pointer;

  font-family: inherit;

  transition: .15s ease;
}

.project-button:hover,
.project-button.active {
  background: var(--panel2);

  color: var(--text);
}

.project-button .number {
  margin-right: 9px;
}

.project-button .type {
  display: block;

  font-size: 8px;

  margin:
    4px 0 0 29px;

  opacity: .55;

  letter-spacing: 1px;
}

.main {
  min-width: 0;
}

.project-header {
  border:
    1px solid var(--border);

  border-radius: 14px;

  padding: 25px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,.025),
      rgba(255,255,255,.005)
    );
}

.project-meta {
  display: flex;

  align-items: center;

  gap: 10px;

  color: var(--muted);

  font-size: 10px;

  letter-spacing: 1.5px;
}

.status {
  display: inline-flex;

  align-items: center;

  gap: 7px;

  color: #6ee7a0;
}

.status-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: currentColor;

  box-shadow:
    0 0 10px currentColor;
}

.project-title {
  margin:
    12px 0 8px;

  font-size: clamp(27px, 4vw, 45px);
}

.project-description {
  color: var(--muted);

  line-height: 1.7;

  max-width: 800px;
}

.architecture {
  position: relative;

  margin-top: 18px;

  min-height: 550px;

  border:
    1px solid var(--border);

  border-radius: 14px;

  overflow: hidden;

  background:
    radial-gradient(
      circle at center,
      rgba(0,217,255,.035),
      transparent 50%
    ),
    #070b11;
}

.architecture-top {
  padding: 15px 18px;

  border-bottom:
    1px solid var(--border);

  display: flex;

  justify-content: space-between;
}

.architecture-label {
  font-size: 10px;

  letter-spacing: 1.5px;

  color: #687482;
}

.canvas {
  position: relative;

  height: 490px;

  overflow: auto;

  padding: 35px;
}

.flow {
  min-width: 760px;

  min-height: 410px;

  position: relative;

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 30px;
}

.layer {
  width: min(700px, 100%);

  display: flex;

  justify-content: center;

  gap: 13px;

  flex-wrap: wrap;
}

.node {
  position: relative;

  min-width: 125px;

  padding: 14px 15px;

  background:
    rgba(10,16,24,.95);

  border:
    1px solid var(--accent);

  border-radius: 9px;

  cursor: pointer;

  transition:
    transform .18s ease,
    box-shadow .18s ease,
    background .18s ease;
}

.node:hover {
  transform:
    translateY(-3px);

  box-shadow:
    0 0 25px color-mix(
      in srgb,
      var(--accent),
      transparent 75%
    );

  background:
    rgba(20,28,39,.98);
}

.node-title {
  font-weight: bold;

  font-size: 11px;
}

.node-type {
  color: #65717d;

  font-size: 8px;

  margin-top: 6px;

  text-transform: uppercase;
}

.connector {
  width: 1px;

  height: 30px;

  background:
    linear-gradient(
      var(--accent),
      transparent
    );

  opacity: .5;
}

.tech {
  margin-top: 18px;

  display: flex;

  gap: 8px;

  flex-wrap: wrap;
}

.tech span {
  border:
    1px solid var(--border);

  background:
    #0b1119;

  padding:
    7px 10px;

  border-radius: 999px;

  font-size: 9px;

  color: var(--muted);
}

.inspector {
  position: fixed;

  right: 20px;

  bottom: 20px;

  width: min(350px, calc(100vw - 40px));

  background:
    rgba(8,12,18,.96);

  backdrop-filter: blur(18px);

  border:
    1px solid var(--border);

  border-radius: 12px;

  padding: 17px;

  box-shadow:
    0 20px 70px rgba(0,0,0,.45);

  transform:
    translateY(20px);

  opacity: 0;

  pointer-events: none;

  transition: .2s ease;
}

.inspector.visible {
  transform:
    translateY(0);

  opacity: 1;

  pointer-events: auto;
}

.inspector-close {
  float: right;

  background: none;

  border: 0;

  color: #65717d;

  cursor: pointer;
}

.inspector h3 {
  margin:
    0 0 7px;
}

.inspector p {
  color: var(--muted);

  font-size: 11px;

  line-height: 1.7;
}

@media (max-width: 850px) {

  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: relative;
    top: 0;
  }

  .architecture {
    min-height: 500px;
  }

}

</style>
</head>

<body>

<div class="container">

<header>

<div class="terminal">
PROJECTS.SYS / ARCHITECTURE.LAB
</div>

<h1>${escapeHtml(username)} — Systems</h1>

<div class="subtitle">
Interactive architecture explorer for selected software,
AI, data, and analytics systems.
Select a project to inspect its architecture.
</div>

</header>

<div class="layout">

<aside class="sidebar">

<div class="sidebar-title">
PROJECT INDEX
</div>

<div id="projectList"></div>

</aside>

<main class="main">

<section class="project-header">

<div class="project-meta">

<span id="projectNumber"></span>

<span>•</span>

<span id="projectType"></span>

<span>•</span>

<span class="status">
<span class="status-dot"></span>
SYSTEM ONLINE
</span>

</div>

<h2 class="project-title" id="projectTitle"></h2>

<div
  class="project-description"
  id="projectDescription"
></div>

<div class="tech" id="tech"></div>

</section>

<section class="architecture">

<div class="architecture-top">

<span class="architecture-label">
SYSTEM ARCHITECTURE
</span>

<span class="architecture-label">
CLICK NODE → INSPECT
</span>

</div>

<div class="canvas">

<div
  class="flow"
  id="flow"
></div>

</div>

</section>

</main>

</div>

</div>

<div
  class="inspector"
  id="inspector"
>

<button
  class="inspector-close"
  onclick="closeInspector()"
>
×
</button>

<div
  id="inspectorContent"
></div>

</div>

<script>

const PROJECTS = ${projectJson};

let currentProject = PROJECTS[0];

const list =
  document.getElementById("projectList");

const flow =
  document.getElementById("flow");

const inspector =
  document.getElementById("inspector");

const inspectorContent =
  document.getElementById("inspectorContent");

function selectProject(id) {

  currentProject =
    PROJECTS.find(
      p => p.id === id
    );

  if (!currentProject) return;

  renderSidebar();

  renderProject();

  history.replaceState(
    null,
    "",
    "#" + currentProject.id
  );
}

function renderSidebar() {

  list.innerHTML =
    currentProject
      ? PROJECTS.map(p => \`
        <button
          class="project-button \${p.id === currentProject.id ? "active" : ""}"
          onclick="selectProject('\${p.id}')"
        >

          <span
            class="number"
            style="color:\${p.accent}"
          >
            \${p.number}
          </span>

          \${p.name}

          <span class="type">
            \${p.type}
          </span>

        </button>
      \`).join("")
      : "";
}

function renderProject() {

  const p = currentProject;

  document
    .getElementById("projectNumber")
    .textContent = p.number;

  document
    .getElementById("projectType")
    .textContent = p.type;

  document
    .getElementById("projectTitle")
    .textContent = p.name;

  document
    .getElementById("projectDescription")
    .textContent = p.desc;

  document
    .getElementById("tech")
    .innerHTML =
      p.tech
        .map(t => \`
          <span style="border-color:\${p.accent}55">
            \${t}
          </span>
        \`)
        .join("");

  renderArchitecture();
}

function renderArchitecture() {

  const p = currentProject;

  document.documentElement.style
    .setProperty(
      "--accent",
      p.accent
    );

  const layers = [];

  // Build architecture layers
  const architecture =
    p.architecture;

  const chunkSize = 3;

  for (
    let i = 0;
    i < architecture.length;
    i += chunkSize
  ) {

    layers.push(
      architecture.slice(
        i,
        i + chunkSize
      )
    );

  }

  flow.innerHTML =
    layers
      .map(
        (layer, index) => \`

          <div class="layer">

            \${layer.map(node => \`

              <div
                class="node"
                style="--accent:\${p.accent}"
                onclick="inspectNode('\${escapeHtml(node[0])}', '\${escapeHtml(node[1])}')"
              >

                <div class="node-title">
                  \${node[0]}
                </div>

                <div class="node-type">
                  \${node[1]}
                </div>

              </div>

            \`).join("")}

          </div>

          \${index < layers.length - 1
            ? '<div class="connector"></div>'
            : ""}

        \`
      )
      .join("");
}

function inspectNode(name, type) {

  inspectorContent.innerHTML = \`

    <div
      style="
        color:\${currentProject.accent};
        font-size:9px;
        letter-spacing:1.5px;
        margin-bottom:8px;
      "
    >
      COMPONENT
    </div>

    <h3>
      \${name}
    </h3>

    <p>
      Architecture component in the
      \${currentProject.name}
      system.
    </p>

    <p>
      <strong>Layer:</strong>
      \${type}
    </p>

  \`;

  inspector.classList.add(
    "visible"
  );
}

function closeInspector() {

  inspector.classList.remove(
    "visible"
  );

}

const hash =
  location.hash.replace("#", "");

if (
  PROJECTS.some(
    p => p.id === hash
  )
) {

  currentProject =
    PROJECTS.find(
      p => p.id === hash
    );

}

renderSidebar();
renderProject();

</script>

</body>
</html>
`;
}

// ------------------------------------------------------------
// Write files
// ------------------------------------------------------------

async function main() {

  const fs =
    await import("fs/promises");

  await fs.mkdir(
    "dist",
    { recursive: true }
  );

  const svg =
    buildSvg(
      PROJECTS,
      GITHUB_USER
    );

  const html =
    buildHtml(
      PROJECTS,
      GITHUB_USER
    );

  await fs.writeFile(
    "dist/projects.svg",
    svg,
    "utf8"
  );

  await fs.writeFile(
    "dist/index.html",
    html,
    "utf8"
  );

  console.log(
    `Generated architecture showcase for ${PROJECTS.length} project(s).`
  );

  console.log(
    "Generated: dist/projects.svg"
  );

  console.log(
    "Generated: dist/index.html"
  );
}

main().catch(error => {

  console.error(
    "Project generation failed:"
  );

  console.error(error);

  process.exit(1);

});
