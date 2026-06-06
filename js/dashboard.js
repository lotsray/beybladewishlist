let allRows = [];

async function loadDashboard() {
  if (!GAS_URL || GAS_URL.includes("PASTE_YOUR")) {
    document.getElementById("ranking").innerHTML = `<p class="status error">請先在 js/config.js 填入 GAS Web App 網址。</p>`;
    return;
  }

  const res = await fetch(`${GAS_URL}?action=list`);
  const data = await res.json();
  allRows = data.rows || [];

  renderStats();
  renderRanking();
  renderBarChart();
  renderUserStats();
  renderTable();
}

function getSummary() {
  const map = new Map();
  allRows.forEach(row => {
    const item = row.item || "未命名品項";
    const qty = Number(row.quantity || 0);
    const price = Number(row.price || getPriceByName(item) || 0);
    if (!map.has(item)) map.set(item, { item, qty: 0, price, amount: 0 });
    const target = map.get(item);
    target.qty += qty;
    target.amount += qty * price;
    if (!target.price && price) target.price = price;
  });
  return [...map.values()].sort((a, b) => b.qty - a.qty || b.amount - a.amount);
}

function renderStats() {
  const summary = getSummary();
  const totalQty = allRows.reduce((sum, row) => sum + Number(row.quantity || 0), 0);
  const totalAmount = allRows.reduce((sum, row) => {
    const price = Number(row.price || getPriceByName(row.item) || 0);
    return sum + Number(row.quantity || 0) * price;
  }, 0);
  const users = new Set(allRows.map(row => row.name).filter(Boolean));

  document.getElementById("totalQty").textContent = totalQty;
  document.getElementById("totalAmount").textContent = money(totalAmount);
  document.getElementById("userCount").textContent = users.size;
  document.getElementById("itemCount").textContent = summary.length;
}

function renderRanking() {
  const box = document.getElementById("ranking");
  const summary = getSummary().slice(0, 10);
  if (summary.length === 0) {
    box.innerHTML = `<p class="subtitle">目前尚無資料。</p>`;
    return;
  }

  box.innerHTML = summary.map((row, index) => `
    <div class="rank-item">
      <div>
        <div class="rank-name">${rankIcon(index)} ${escapeHtml(row.item)}</div>
        <div class="rank-meta">單價 ${row.price ? money(row.price) : "未設定"}，預估 ${money(row.amount)}</div>
      </div>
      <strong>${row.qty}</strong>
    </div>
  `).join("");
}

function renderBarChart() {
  const box = document.getElementById("barChart");
  const summary = getSummary().slice(0, 20);
  const max = Math.max(...summary.map(row => row.qty), 1);

  if (summary.length === 0) {
    box.innerHTML = `<p class="subtitle">目前尚無資料。</p>`;
    return;
  }

  box.innerHTML = summary.map(row => {
    const percent = Math.max((row.qty / max) * 100, 3);
    return `
      <div class="bar-row">
        <div class="bar-label"><span>${escapeHtml(row.item)}</span><strong>${row.qty}</strong></div>
        <div class="bar-track"><div class="bar-fill" style="width:${percent}%"></div></div>
      </div>
    `;
  }).join("");
}

function renderUserStats() {
  const box = document.getElementById("userStats");
  const map = new Map();

  allRows.forEach(row => {
    const name = row.name || "未命名";
    const qty = Number(row.quantity || 0);
    const price = Number(row.price || getPriceByName(row.item) || 0);
    if (!map.has(name)) map.set(name, { name, qty: 0, amount: 0, itemTypes: new Set() });
    const target = map.get(name);
    target.qty += qty;
    target.amount += qty * price;
    target.itemTypes.add(row.item);
  });

  const users = [...map.values()].sort((a, b) => b.qty - a.qty);
  if (users.length === 0) {
    box.innerHTML = `<p class="subtitle">目前尚無資料。</p>`;
    return;
  }

  box.innerHTML = users.map(user => `
    <div class="user-item">
      <div>
        <strong>${escapeHtml(user.name)}</strong>
        <div class="user-meta">${user.itemTypes.size} 種品項，預估 ${money(user.amount)}</div>
      </div>
      <strong>${user.qty}</strong>
    </div>
  `).join("");
}

function renderTable() {
  const tbody = document.getElementById("dataTable");
  const keyword = document.getElementById("searchInput")?.value.trim().toLowerCase() || "";

  const rows = allRows.filter(row => {
    const text = `${row.time} ${row.name} ${row.item} ${row.note}`.toLowerCase();
    return text.includes(keyword);
  }).slice().reverse();

  if (rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">目前尚無資料</td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(row => {
    const price = Number(row.price || getPriceByName(row.item) || 0);
    const qty = Number(row.quantity || 0);
    return `
      <tr>
        <td>${escapeHtml(formatTime(row.time))}</td>
        <td>${escapeHtml(row.name)}</td>
        <td>${escapeHtml(row.item)}</td>
        <td>${qty}</td>
        <td>${price ? money(price) : "-"}</td>
        <td>${price ? money(price * qty) : "-"}</td>
        <td>${escapeHtml(row.note || "")}</td>
      </tr>
    `;
  }).join("");
}

function rankIcon(index) {
  return ["🥇", "🥈", "🥉"][index] || `#${index + 1}`;
}

function money(value) {
  return `$${Number(value || 0).toLocaleString("zh-TW")}`;
}

function formatTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("zh-TW", { hour12: false });
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadDashboard();
