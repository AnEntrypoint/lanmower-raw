// Portfolio data + interactions
const FEATURED = [
  "hyper-ipc",
  "chakrachain",
  "hyper-relay",
  "hyper-web",
  "hyper-web-chat",
  "freedomfirst",
];

const LANG_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "C++": "#f34b7d",
  Python: "#3572A5",
  Shell: "#89e051",
  Rust: "#dea584",
  PHP: "#4F5D95",
  Java: "#b07219",
  Astro: "#ff5a03",
  GDScript: "#355570",
  Dockerfile: "#384d54",
  Solidity: "#AA6746",
};

const $ = (s) => document.querySelector(s);
const fmt = (n) => n.toLocaleString();

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function langDot(lang) {
  if (!lang) return "";
  const c = LANG_COLORS[lang] || "#6aa6ff";
  return `<span class="lang"><span style="background:${c};display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;vertical-align:1px"></span>${escapeHTML(lang)}</span>`;
}

function card(r, featured = false) {
  const meta = [];
  if (r.language) meta.push(langDot(r.language));
  if (r.stars) meta.push(`<span class="stars">${r.stars}</span>`);
  if (r.forks) meta.push(`<span class="forks">${r.forks}</span>`);
  meta.push(`<span>updated ${new Date(r.pushed_at).toLocaleDateString(undefined, { year: "numeric", month: "short" })}</span>`);
  const desc = r.description || (featured ? "Open the repo for details." : "");
  return `
    <a class="card ${featured ? "featured-card" : ""}" href="${escapeHTML(r.url)}" target="_blank" rel="noopener">
      <h3>${escapeHTML(r.name)}</h3>
      <div class="desc">${escapeHTML(desc)}</div>
      <div class="meta">${meta.join("")}</div>
    </a>`;
}

let ALL = [];

async function load() {
  try {
    const r = await fetch("repos.json", { cache: "no-cache" });
    ALL = await r.json();
  } catch (e) {
    $("#repos").innerHTML = `<div class="empty">Could not load repository data.</div>`;
    return;
  }

  // Stats
  $("#stat-repos").textContent = fmt(ALL.length);
  $("#stat-stars").textContent = fmt(ALL.reduce((a, r) => a + r.stars, 0));
  const langs = new Set(ALL.map((r) => r.language).filter(Boolean));
  $("#stat-langs").textContent = fmt(langs.size);

  // Featured
  const byName = Object.fromEntries(ALL.map((r) => [r.name, r]));
  const feat = FEATURED.map((n) => byName[n]).filter(Boolean);
  $("#featured").innerHTML = feat.map((r) => card(r, true)).join("");

  // Language filter
  const langSel = $("#lang");
  [...langs].sort().forEach((l) => {
    const o = document.createElement("option");
    o.value = l; o.textContent = l; langSel.appendChild(o);
  });

  // Wire controls
  ["input", "change"].forEach((ev) => {
    $("#search").addEventListener(ev, render);
    $("#lang").addEventListener(ev, render);
    $("#sort").addEventListener(ev, render);
  });

  render();
}

function render() {
  const q = $("#search").value.trim().toLowerCase();
  const lang = $("#lang").value;
  const sort = $("#sort").value;

  let list = ALL.filter((r) => {
    if (lang && r.language !== lang) return false;
    if (!q) return true;
    return (
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      (r.topics || []).some((t) => t.toLowerCase().includes(q))
    );
  });

  list.sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "updated") return b.pushed_at.localeCompare(a.pushed_at);
    if (sort === "created") return b.created_at.localeCompare(a.created_at);
    return b.stars - a.stars || b.pushed_at.localeCompare(a.pushed_at);
  });

  $("#repo-count").textContent = `(${list.length})`;
  $("#empty").hidden = list.length > 0;
  $("#repos").innerHTML = list.map((r) => card(r)).join("");
}

load();
