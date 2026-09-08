// scripts/generate-projects.mjs
// Fetches the user's pinned repos and renders them as a cycling,
// futuristic "terminal scanner" animated SVG.

const GITHUB_USER = process.env.GITHUB_USER_NAME;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function fetchPinnedRepos(username) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              primaryLanguage { name color }
              stargazerCount
              forkCount
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: username } }),
  });

  if (!res.ok) throw new Error(`GitHub GraphQL error: ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));

  const nodes = json.data?.user?.pinnedItems?.nodes ?? [];
  if (nodes.length === 0) {
    const restRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=stars&direction=desc&per_page=6`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );
    const repos = await restRes.json();
    return repos.slice(0, 5).map((r) => ({
      name: r.name,
      description: r.description || "No description provided.",
      language: r.language || "Code",
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
    }));
  }

  return nodes.map((n) => ({
    name: n.name,
    description: n.description || "No description provided.",
    language: n.primaryLanguage?.name || "Code",
    stars: n.stargazerCount || 0,
    forks: n.forkCount || 0,
  }));
}

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

function buildSvg(projects, username) {
  const width = 760;
  const height = 220;
  const perSlot = 4.5;
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

      const name = escapeXml(truncate(p.name, 28));
      const desc = escapeXml(truncate(p.description, 64));
      const lang = escapeXml(p.language);

      return `
    <g opacity="0">
      <animate attributeName="opacity" values="${values}" keyTimes="${keyTimes}" dur="${total}s" begin="0s" repeatCount="indefinite" />

      <!-- glitch scan-in bar -->
      <rect x="40" y="70" width="4" height="90" fill="#0ff" opacity="0.8">
        <animate attributeName="x" values="40;660;660" keyTimes="0;0.15;1" dur="${total}s" begin="0s" repeatCount="indefinite" />
      </rect>

      <text x="60" y="95" class="proj-name">${name}</text>
      <text x="60" y="122" class="proj-desc">${desc}</text>
      <text x="60" y="150" class="proj-meta">
        <tspan fill="#7ee787">●</tspan> ${lang}
        <tspan dx="20" fill="#f0883e">★</tspan> ${p.stars}
        <tspan dx="20" fill="#79c0ff">⑂</tspan> ${p.forks}
      </text>
      <rect x="55" y="65" width="650" height="100" rx="6" fill="none" stroke="#0ff" stroke-opacity="0.35" stroke-width="1"/>
    </g>`;
    })
    .join("\n");

  const dots = projects
    .map((_, i) => {
      const start = i / n;
      const end = (i + 1) / n;
      return `<circle cx="${60 + i * 22}" cy="190" r="4" fill="#30363d">
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
      .proj-desc { font-family: 'Courier New', monospace; font-size: 13px; fill: #8b949e; }
      .proj-meta { font-family: 'Courier New', monospace; font-size: 12px; fill: #c9d1d9; }
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
  if (!GITHUB_USER || !GITHUB_TOKEN) {
    throw new Error("Missing required env vars: GITHUB_USER_NAME, GITHUB_TOKEN");
  }
  const projects = await fetchPinnedRepos(GITHUB_USER);
  if (projects.length === 0) {
    throw new Error("No repositories found to display.");
  }
  const svg = buildSvg(projects, GITHUB_USER);

  const fs = await import("fs/promises");
  await fs.mkdir("dist", { recursive: true });
  await fs.writeFile("dist/projects.svg", svg, "utf-8");
  console.log(`Generated projects.svg with ${projects.length} project(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
