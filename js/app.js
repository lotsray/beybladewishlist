let rowIndex = 0;

function addWishRow() {
  rowIndex += 1;
  const wrap = document.getElementById("wishList");
  const row = document.createElement("div");
  row.className = "wish-row";
  row.dataset.rowId = rowIndex;

  row.innerHTML = `
    <div class="row-grid">
      <div>
        <label for="itemSelect${rowIndex}">想買品項</label>
        <select id="itemSelect${rowIndex}" class="item-select" onchange="toggleCustomItem(${rowIndex})">
          <option value="">請選擇品項</option>
          ${ITEM_OPTIONS.map(item => `<option value="${escapeHtml(item.name)}">${escapeHtml(item.name)}　$${item.price}</option>`).join("")}
          <option value="custom">其他／自訂品項</option>
        </select>
      </div>
      <div>
        <label for="quantity${rowIndex}">數量</label>
        <input id="quantity${rowIndex}" class="quantity-input" type="number" min="1" value="1" />
      </div>
      <button class="remove-btn" type="button" onclick="removeWishRow(${rowIndex})" aria-label="刪除此品項">×</button>
    </div>
    <input id="customItem${rowIndex}" class="custom-item" type="text" placeholder="自訂品項名稱" />
    <label for="note${rowIndex}">備註</label>
    <textarea id="note${rowIndex}" class="note-input" placeholder="例如：有現貨才收、超過某價先不要"></textarea>
  `;

  wrap.appendChild(row);
}

function removeWishRow(id) {
  const row = document.querySelector(`[data-row-id="${id}"]`);
  if (row) row.remove();
  if (document.querySelectorAll(".wish-row").length === 0) addWishRow();
}

function toggleCustomItem(id) {
  const select = document.getElementById(`itemSelect${id}`);
  const customInput = document.getElementById(`customItem${id}`);
  customInput.style.display = select.value === "custom" ? "block" : "none";
}

function collectWishes() {
  const rows = [...document.querySelectorAll(".wish-row")];
  return rows.map(row => {
    const id = row.dataset.rowId;
    const selectValue = document.getElementById(`itemSelect${id}`).value;
    const customValue = document.getElementById(`customItem${id}`).value.trim();
    const item = selectValue === "custom" ? customValue : selectValue;
    const quantity = Number(document.getElementById(`quantity${id}`).value || 1);
    const note = document.getElementById(`note${id}`).value.trim();
    const price = selectValue === "custom" ? 0 : getPriceByName(item);

    return { item, quantity, note, price };
  }).filter(wish => wish.item && wish.quantity > 0);
}

async function submitWishlist() {
  const name = document.getElementById("name").value.trim();
  const wishes = collectWishes();
  const status = document.getElementById("status");

  status.className = "status";

  if (!GAS_URL || GAS_URL.includes("PASTE_YOUR")) {
    status.textContent = "請先在 js/config.js 填入 GAS Web App 網址。";
    status.classList.add("error");
    return;
  }

  if (!name) {
    status.textContent = "請先輸入暱稱。";
    status.classList.add("error");
    return;
  }

  if (wishes.length === 0) {
    status.textContent = "請至少新增一個有效品項。";
    status.classList.add("error");
    return;
  }

  status.textContent = "送出中...";

  try {
    const res = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify({ action: "submit", name, wishes })
    });
    const result = await res.json();

    if (!result.success) throw new Error(result.message || "送出失敗");

    status.textContent = "已成功送出願望！";
    status.classList.add("ok");
    document.getElementById("wishList").innerHTML = "";
    addWishRow();
  } catch (err) {
    status.textContent = "送出失敗，請確認 GAS 部署權限與網址。";
    status.classList.add("error");
  }
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

addWishRow();
