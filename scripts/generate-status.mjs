// scripts/generate-status.mjs
// Fetches recent public GitHub activity for a user, asks Groq to summarize
// it as a short witty "status line", and writes it as an SVG.

const GITHUB_USER = process.env.GITHUB_USER_NAME;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function fetchRecentActivity(username) {
  const res = await fetch(
    `https://api.github.com/users/${username}/events/public?per_page=30`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const events = await res.json();

  const bits = [];
  for (const e of events) {
    if (e.type === "PushEvent") {
      const repo = e.repo?.name;
      for (const c of e.payload?.commits ?? []) {
        bits.push(`commit in ${repo}: ${c.message}`);
      }
    } else if (e.type === "CreateEvent" && e.payload?.ref_type === "repository") {
      bits.push(`created new repo: ${e.repo?.name}`);
    } else if (e.type === "PullRequestEvent") {
      bits.push(`${e.payload?.action} PR in ${e.repo?.name}: ${e.payload?.pull_request?.title}`);
    } else if (e.type === "IssuesEvent") {
      bits.push(`${e.payload?.action} issue in ${e.repo?.name}: ${e.payload?.issue?.title}`);
    }
  }
  return bits.slice(0, 25);
}

async function askGroq(activityLines) {
  const activityText = activityLines.length
    ? activityLines.join("\n")
    : "No recent public activity found.";

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      max_tokens: 60,
      messages: [
        {
          role: "user",
          content: `Here is a developer's recent GitHub activity:\n\n${activityText}\n\nWrite ONE short, witty, dev-humor status line (max 100 characters) summarizing what they've been up to. Sound like a clever changelog entry or a git commit message with personality, not a corporate summary. No hashtags, no emoji spam (one emoji max, optional), no quotation marks around it. Return ONLY the line, nothing else.`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API error: ${res.status} ${errText}`);
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  return text || "Quietly shipping something. Stay tuned.";
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildSvg(statusLine, dateStr) {
  const line = escapeXml(statusLine);
  const width = 760;
  const height = 130;
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .term-bg { fill: #0d1117; }
      .term-bar { fill: #161b22; }
      .dot { }
      .prompt { font-family: 'Courier New', monospace; font-size: 15px; fill: #58a6ff; }
      .path { font-family: 'Courier New', monospace; font-size: 15px; fill: #7ee787; }
      .status { font-family: 'Courier New', monospace; font-size: 15px; fill: #c9d1d9; }
      .date { font-family: 'Courier New', monospace; font-size: 12px; fill: #6e7681; }
      .cursor { fill: #7ee787; animation: blink 1s steps(1) infinite; }
      @keyframes blink { 50% { opacity: 0; } }
    </style>
    <clipPath id="rounded">
      <rect x="0" y="0" width="${width}" height="${height}" rx="10" ry="10" />
    </clipPath>
  </defs>

  <g clip-path="url(#rounded)">
    <rect class="term-bg" width="${width}" height="${height}" />
    <rect class="term-bar" width="${width}" height="30" />
    <circle class="dot" cx="18" cy="15" r="6" fill="#ff5f56" />
    <circle class="dot" cx="38" cy="15" r="6" fill="#ffbd2e" />
    <circle class="dot" cx="58" cy="15" r="6" fill="#27c93f" />
    <text x="${width / 2}" y="20" text-anchor="middle" class="date">daily-status.sh</text>

    <text x="20" y="62" class="prompt">➜ <tspan class="path">~/anshxgaur</tspan></text>
    <text x="20" y="90" class="status">
      <tspan>${line}</tspan>
      <tspan class="cursor">▍</tspan>
    </text>
    <text x="20" y="115" class="date">last updated: ${dateStr} UTC</text>
  </g>
</svg>`;
}

async function main() {
  if (!GITHUB_USER || !GITHUB_TOKEN || !GROQ_API_KEY) {
    throw new Error(
      "Missing required env vars: GITHUB_USER_NAME, GITHUB_TOKEN, GROQ_API_KEY"
    );
  }
  const activity = await fetchRecentActivity(GITHUB_USER);
  const statusLine = await askGroq(activity);
  const dateStr = new Date().toISOString().slice(0, 16).replace("T", " ");
  const svg = buildSvg(statusLine, dateStr);

  const fs = await import("fs/promises");
  await fs.mkdir("dist", { recursive: true });
  await fs.writeFile("dist/ai-status.svg", svg, "utf-8");
  console.log("Generated status:", statusLine);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
