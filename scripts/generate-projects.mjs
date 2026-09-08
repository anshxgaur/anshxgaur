// scripts/generate-projects.mjs
//
// Generates a readable cyberpunk-style project terminal SVG.
// Designed specifically for GitHub profile README rendering.
//
// Output:
//   dist/projects.svg

const GITHUB_USER = process.env.GITHUB_USER_NAME || "anshxgaur";

// ============================================================
// PROJECT DATA
// ============================================================

const PROJECTS = [
  {
    name: "Nexus Workspace",
    subtitle: "AI CORPORATE WORKSPACE",
    desc: "Self-hosted AI-powered corporate workspace with team chat, meetings, live transcription, RAG search, and task extraction.",
    architecture: [
      "Team Chat",
      "Meetings",
      "Live Transcription",
      "RAG Search",
      "Task Extraction",
      "Real-time Gateway",
    ],
    tech: [
      "FastAPI",
      "React",
      "Tauri",
      "Qdrant",
      "PostgreSQL",
      "Ollama",
    ],
    url: "https://github.com/anshxgaur/nexus",
  },

  {
    name: "VISTA",
    subtitle: "HEALTHCARE DATA INTELLIGENCE",
    desc: "Healthcare data intelligence system for EDA, disease prediction, risk stratification, and real-time patient insights.",
    architecture: [
      "Healthcare Data",
      "Data Cleaning",
      "EDA",
      "Feature Engineering",
      "ML Pipelines",
      "Risk Stratification",
    ],
    tech: [
      "Python",
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "Streamlit",
      "ML",
    ],
    url: "https://github.com/anshxgaur/VISTA",
  },

  {
    name: "NOVA",
    subtitle: "LOCAL AI ASSISTANT",
    desc: "Personal AI assistant architecture focused on local inference, voice interaction, security checks, and task orchestration.",
    architecture: [
      "Voice Input",
      "STT / TTS",
      "Security Layer",
      "Intent Router",
      "Task Agent",
      "Local LLM",
    ],
    tech: [
      "TypeScript",
      "AI Architecture",
      "STT/TTS",
      "Prompt Defense",
      "Local AI",
    ],
    url: "https://github.com/anshxgaur/NOVA",
  },

  {
    name: "F1 Data Analytics",
    subtitle: "FORMULA 1 STRATEGY ENGINE",
    desc: "Formula 1 analytics platform for tire degradation, pit-window reasoning, and driver performance comparison.",
    architecture: [
      "Race Data",
      "Telemetry",
      "Driver Data",
      "Data Processing",
      "Tire Model",
      "Pit Window",
    ],
    tech: [
      "TypeScript",
      "Next.js",
      "Data Visualization",
      "Analytics",
      "Strategy Modeling",
    ],
    url: "https://github.com/anshxgaur/F1",
  },

  {
    name: "ASTRA",
    subtitle: "SEMANTIC RESEARCH ENGINE",
    desc: "AI-powered unified search platform merging 1,000 resumes, 20 research papers, and 6 fragmented AICTE data sources into one semantic search and RAG Q&A portal.",
    architecture: [
      "Unified Search",
      "Embeddings",
      "Vector Database",
      "Text-to-SQL",
      "RAG Q&A",
      "Multi-source Data",
    ],
    tech: [
      "FastAPI",
      "PostgreSQL",
      "pgvector",
      "fastembed",
      "Groq LLM",
      "Docker",
    ],
    url: "https://github.com/anshxgaur/astra",
  },
];

// ============================================================
// COLORS
// ============================================================

const ACCENTS = [
  "#00D9FF", // cyan
  "#8B5CF6", // violet
  "#FF7A00", // orange
  "#22C55E", // green
  "#EC4899", // pink
];

// ============================================================
// HELPERS
// ============================================================

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncate(text, maxLength) {
  const value = String(text);

  if (value.length <= maxLength) {
    return value;
  }

  return value.slice(0, maxLength - 1).trimEnd() + "…";
}

function wrapText(text, maxChars, maxLines = 2) {
  const words = String(text).split(/\s+/);

  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current
      ? `${current} ${word}`
      : word;

    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) {
        lines.push(current);
      }

      current = word;

      if (lines.length >= maxLines) {
        break;
      }
    }
  }

  if (lines.length < maxLines && current) {
    lines.push(current);
  }

  if (lines.length > maxLines) {
    lines.length = maxLines;
  }

  // Add ellipsis if text was cut.
  const reconstructed = lines.join(" ");

  if (
    reconstructed.length < String(text).length &&
    lines.length > 0
  ) {
    lines[lines.length - 1] =
      truncate(lines[lines.length - 1], maxChars);
  }

  return lines;
}

// ============================================================
// ARCHITECTURE BOXES
// ============================================================

function buildArchitectureBoxes(
  items,
  accent,
  x,
  y,
  width
) {
  const columns = 3;

  const gap = 10;
  const boxHeight = 30;

  const boxWidth =
    (width - gap * (columns - 1)) / columns;

  const rows = Math.ceil(items.length / columns);

  const markup = [];

  items.forEach((item, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;

    const boxX =
      x + col * (boxWidth + gap);

    const boxY =
      y + row * (boxHeight + gap);

    markup.push(`
      <g>
        <rect
          x="${boxX}"
          y="${boxY}"
          width="${boxWidth}"
          height="${boxHeight}"
          rx="6"
          fill="#0B1018"
          stroke="${accent}"
          stroke-opacity="0.38"
          stroke-width="1"
        />

        <circle
          cx="${boxX + 11}"
          cy="${boxY + boxHeight / 2}"
          r="3"
          fill="${accent}"
        />

        <text
          x="${boxX + 20}"
          y="${boxY + 19}"
          class="architecture"
        >
          ${escapeXml(truncate(item, 20))}
        </text>
      </g>
    `);
  });

  return {
    markup: markup.join("\n"),
    height:
      rows * boxHeight +
      (rows - 1) * gap,
  };
}

// ============================================================
// TECH PILLS
// ============================================================

function buildTechPills(
  items,
  accent,
  x,
  y,
  width
) {
  const gap = 8;
  const pillHeight = 22;

  const charWidth = 6.2;
  const horizontalPadding = 12;

  let currentX = x;
  let currentY = y;

  const markup = [];

  for (const item of items) {
    const label = truncate(item, 20);

    const pillWidth =
      label.length * charWidth +
      horizontalPadding * 2;

    if (
      currentX + pillWidth >
      x + width
    ) {
      currentX = x;
      currentY += pillHeight + gap;
    }

    markup.push(`
      <g>
        <rect
          x="${currentX}"
          y="${currentY}"
          width="${pillWidth}"
          height="${pillHeight}"
          rx="11"
          fill="${accent}"
          fill-opacity="0.10"
          stroke="${accent}"
          stroke-opacity="0.55"
          stroke-width="1"
        />

        <text
          x="${currentX + pillWidth / 2}"
          y="${currentY + 15}"
          text-anchor="middle"
          class="tech"
          fill="${accent}"
        >
          ${escapeXml(label)}
        </text>
      </g>
    `);

    currentX += pillWidth + gap;
  }

  return markup.join("\n");
}

// ============================================================
// PROJECT CARD
// ============================================================

function buildCard(
  project,
  index,
  x,
  y,
  width,
  height
) {
  const accent =
    ACCENTS[index % ACCENTS.length];

  const number =
    String(index + 1).padStart(2, "0");

  const padding = 20;

  const contentWidth =
    width - padding * 2;

  const descriptionLines =
    wrapText(
      project.desc,
      Math.floor(contentWidth / 7.1),
      2
    );

  const descriptionMarkup =
    descriptionLines
      .map(
        (line, lineIndex) => `
          <tspan
            x="${x + padding}"
            dy="${lineIndex === 0 ? 0 : 18}"
          >
            ${escapeXml(line)}
          </tspan>
        `
      )
      .join("");

  const architectureY =
    y + 103;

  const architecture =
    buildArchitectureBoxes(
      project.architecture,
      accent,
      x + padding,
      architectureY,
      contentWidth
    );

  const techY =
    architectureY +
    architecture.height +
    14;

  const tech =
    buildTechPills(
      project.tech,
      accent,
      x + padding,
      techY,
      contentWidth
    );

  return `
    <g>

      <!-- Card -->
      <rect
        x="${x}"
        y="${y}"
        width="${width}"
        height="${height}"
        rx="12"
        fill="#0B1018"
        stroke="${accent}"
        stroke-opacity="0.38"
        stroke-width="1.2"
      />

      <!-- Accent line -->
      <rect
        x="${x}"
        y="${y}"
        width="4"
        height="${height}"
        rx="2"
        fill="${accent}"
      />

      <!-- Project number -->
      <text
        x="${x + padding}"
        y="${y + 28}"
        class="number"
        fill="${accent}"
      >
        ${number}
      </text>

      <!-- Project name -->
      <text
        x="${x + padding + 31}"
        y="${y + 29}"
        class="project-name"
      >
        ${escapeXml(truncate(project.name, 28))}
      </text>

      <!-- Subtitle -->
      <text
        x="${x + padding + 31}"
        y="${y + 48}"
        class="subtitle"
        fill="${accent}"
      >
        ${escapeXml(project.subtitle)}
      </text>

      <!-- Description -->
      <text
        x="${x + padding}"
        y="${y + 72}"
        class="description"
      >
        ${descriptionMarkup}
      </text>

      <!-- Architecture label -->
      <text
        x="${x + padding}"
        y="${architectureY - 10}"
        class="section-label"
        fill="${accent}"
      >
        SYSTEM COMPONENTS
      </text>

      <!-- Architecture boxes -->
      ${architecture.markup}

      <!-- Tech pills -->
      ${tech}

      <!-- Repository indicator -->
      <text
        x="${x + width - padding}"
        y="${y + height - 12}"
        text-anchor="end"
        class="repo"
        fill="${accent}"
      >
        OPEN REPOSITORY →
      </text>

    </g>
  `;
}

// ============================================================
// SVG BUILDER
// ============================================================

function buildSvg(projects, username) {
  const width = 900;

  const marginX = 34;

  const headerHeight = 58;

  const topPadding = 26;

  const bottomPadding = 34;

  const columnGap = 18;

  const rowGap = 18;

  const cardHeight = 265;

  const contentWidth =
    width - marginX * 2;

  const columnWidth =
    (contentWidth - columnGap) / 2;

  const rows = [];

  for (
    let index = 0;
    index < projects.length;
    index += 2
  ) {
    const rowProjects =
      projects.slice(index, index + 2);

    rows.push(rowProjects);
  }

  // Last project becomes full-width.
  const lastRowIsSingle =
    rows.length > 0 &&
    rows[rows.length - 1].length === 1;

  let height =
    headerHeight +
    topPadding +
    rows.length * cardHeight +
    (rows.length - 1) * rowGap +
    bottomPadding;

  // Slightly taller canvas for the full-width final card.
  if (lastRowIsSingle) {
    height += 8;
  }

  const cards = [];

  rows.forEach((rowProjects, rowIndex) => {
    const y =
      headerHeight +
      topPadding +
      rowIndex * (cardHeight + rowGap);

    // Full-width final card.
    if (
      rowProjects.length === 1 &&
      rowIndex === rows.length - 1
    ) {
      cards.push(
        buildCard(
          rowProjects[0],
          rowIndex * 2,
          marginX,
          y,
          contentWidth,
          cardHeight
        )
      );

      return;
    }

    rowProjects.forEach(
      (project, columnIndex) => {
        const x =
          marginX +
          columnIndex *
            (columnWidth + columnGap);

        cards.push(
          buildCard(
            project,
            rowIndex * 2 + columnIndex,
            x,
            y,
            columnWidth,
            cardHeight
          )
        );
      }
    );
  });

  return `
<svg
  width="${width}"
  height="${height}"
  viewBox="0 0 ${width} ${height}"
  xmlns="http://www.w3.org/2000/svg"
>

  <defs>

    <!-- Background -->
    <linearGradient
      id="background"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
    >
      <stop
        offset="0%"
        stop-color="#050810"
      />

      <stop
        offset="100%"
        stop-color="#0B1018"
      />
    </linearGradient>

    <!-- Subtle grid -->
    <pattern
      id="grid"
      width="28"
      height="28"
      patternUnits="userSpaceOnUse"
    >
      <path
        d="M 28 0 L 0 0 0 28"
        fill="none"
        stroke="#00D9FF"
        stroke-opacity="0.045"
        stroke-width="1"
      />
    </pattern>

    <!-- Glow -->
    <filter
      id="softGlow"
      x="-50%"
      y="-50%"
      width="200%"
      height="200%"
    >
      <feGaussianBlur
        stdDeviation="3"
        result="blur"
      />

      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Typography -->
    <style>

      .terminal-title {
        font-family:
          "Courier New",
          Courier,
          monospace;

        font-size: 14px;
        font-weight: 700;

        letter-spacing: 2px;

        fill: #DDF8FF;
      }

      .terminal-subtitle {
        font-family:
          "Courier New",
          Courier,
          monospace;

        font-size: 8px;

        letter-spacing: 2px;

        fill: #66717D;
      }

      .number {
        font-family:
          "Courier New",
          Courier,
          monospace;

        font-size: 12px;

        font-weight: 700;
      }

      .project-name {
        font-family:
          "Courier New",
          Courier,
          monospace;

        font-size: 19px;

        font-weight: 700;

        fill: #F2FAFF;
      }

      .subtitle {
        font-family:
          "Courier New",
          Courier,
          monospace;

        font-size: 9px;

        font-weight: 700;

        letter-spacing: 1.5px;
      }

      .description {
        font-family:
          "Courier New",
          Courier,
          monospace;

        font-size: 12px;

        fill: #9AA6B2;
      }

      .section-label {
        font-family:
          "Courier New",
          Courier,
          monospace;

        font-size: 8px;

        font-weight: 700;

        letter-spacing: 1.5px;
      }

      .architecture {
        font-family:
          "Courier New",
          Courier,
          monospace;

        font-size: 9px;

        font-weight: 600;

        fill: #B9C4CF;
      }

      .tech {
        font-family:
          "Courier New",
          Courier,
          monospace;

        font-size: 8.5px;

        font-weight: 700;
      }

      .repo {
        font-family:
          "Courier New",
          Courier,
          monospace;

        font-size: 8px;

        font-weight: 700;

        letter-spacing: 1px;
      }

      .footer {
        font-family:
          "Courier New",
          Courier,
          monospace;

        font-size: 9px;

        fill: #46515D;

        letter-spacing: 1px;
      }

    </style>

    <clipPath id="terminalClip">
      <rect
        width="${width}"
        height="${height}"
        rx="12"
      />
    </clipPath>

  </defs>

  <g clip-path="url(#terminalClip)">

    <!-- Background -->
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

    <!-- Terminal header -->
    <rect
      width="${width}"
      height="${headerHeight}"
      fill="#080D14"
      stroke="#00D9FF"
      stroke-opacity="0.18"
      stroke-width="1"
    />

    <!-- Terminal buttons -->
    <circle
      cx="20"
      cy="19"
      r="5"
      fill="#FF5F56"
    />

    <circle
      cx="38"
      cy="19"
      r="5"
      fill="#FFBD2E"
    />

    <circle
      cx="56"
      cy="19"
      r="5"
      fill="#27C93F"
    />

    <!-- Header -->
    <text
      x="76"
      y="22"
      class="terminal-title"
    >
      PROJECTS.SYS — ${escapeXml(username)}
    </text>

    <text
      x="76"
      y="38"
      class="terminal-subtitle"
    >
      SYSTEM ARCHITECTURE / SELECT A PROJECT TO EXPLORE
    </text>

    <!-- Header status -->
    <circle
      cx="${width - 75}"
      cy="19"
      r="3"
      fill="#22C55E"
      filter="url(#softGlow)"
    />

    <text
      x="${width - 64}"
      y="22"
      class="terminal-subtitle"
    >
      ONLINE
    </text>

    <!-- Project cards -->
    ${cards.join("\n")}

    <!-- Footer -->
    <text
      x="${width - marginX}"
      y="${height - 10}"
      text-anchor="end"
      class="footer"
    >
      ${projects.length} SYSTEMS TRACKED
    </text>

  </g>

</svg>
`;
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  const fs = await import("fs/promises");

  await fs.mkdir(
    "dist",
    { recursive: true }
  );

  const svg =
    buildSvg(
      PROJECTS,
      GITHUB_USER
    );

  await fs.writeFile(
    "dist/projects.svg",
    svg,
    "utf8"
  );

  console.log(
    `Generated dist/projects.svg with ${PROJECTS.length} projects.`
  );
}

main().catch((error) => {
  console.error(
    "Failed to generate projects.svg:"
  );

  console.error(error);

  process.exit(1);
});
