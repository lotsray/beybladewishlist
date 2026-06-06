const SHEET_NAME = "Wishlist";

function doGet(e) {
  const action = e.parameter.action;

  if (action === "list") {
    return jsonOutput({
      success: true,
      rows: getRows()
    });
  }

  return jsonOutput({ success: false, message: "Invalid action" });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");

    if (data.action !== "submit") {
      return jsonOutput({ success: false, message: "Invalid action" });
    }

    const name = String(data.name || "").trim();
    const wishes = Array.isArray(data.wishes) ? data.wishes : [];

    if (!name || wishes.length === 0) {
      return jsonOutput({ success: false, message: "資料不完整" });
    }

    const sheet = getSheet();
    const now = new Date();

    const rows = wishes
      .map(wish => {
        const item = String(wish.item || "").trim();
        const quantity = Number(wish.quantity || 1);
        const price = Number(wish.price || 0);
        const note = String(wish.note || "").trim();
        if (!item || quantity < 1) return null;
        return [now, name, item, quantity, price, note];
      })
      .filter(Boolean);

    if (rows.length === 0) {
      return jsonOutput({ success: false, message: "沒有有效品項" });
    }

    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);

    return jsonOutput({ success: true, message: "已送出", count: rows.length });
  } catch (err) {
    return jsonOutput({ success: false, message: err.toString() });
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["時間", "暱稱", "品項", "數量", "單價", "備註"]);
  }

  return sheet;
}

function getRows() {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();

  return values.slice(1).map(row => ({
    time: row[0],
    name: row[1],
    item: row[2],
    quantity: row[3],
    price: row[4],
    note: row[5]
  }));
}

function jsonOutput(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
