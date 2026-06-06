# 88 Toys 聯合採購願望池

## 使用方式

1. 建立 Google 試算表。
2. 擴充功能 → Apps Script，貼上 `gas-code.js` 的內容。
3. 部署為網頁應用程式：
   - 執行身分：我
   - 存取權限：任何人
4. 複製 GAS Web App URL。
5. 修改 `js/config.js`：

```js
const GAS_URL = "你的 GAS Web App URL";
```

6. 將整包檔案上傳到 GitHub repo，啟用 GitHub Pages。

## 頁面

- `index.html`：填寫願望清單
- `dashboard.html`：需求總覽後台

## 試算表欄位

系統會自動建立 `Wishlist` 工作表與欄位：

時間｜暱稱｜品項｜數量｜單價｜備註
