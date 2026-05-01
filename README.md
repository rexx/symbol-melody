# Symbol Melody

`Symbol Melody` 是一個用數字簡譜轉成圖案譜的前端小工具。

使用者可以輸入數字簡譜，將每個音符對應到不同的圖片或 emoji，並在預覽頁直接看到轉換後的譜面。

## Tech Stack

- React 19
- Vite 6
- TypeScript
- Tailwind CSS v4
- Dexie / IndexedDB
- Vitest

## 目前功能

- 支援數字簡譜輸入：`0-7`
- 支援音域前綴：
  - `^1` 代表高音
  - `_1` 代表低音
  - 無前綴代表中音
- 支援保留空白與換行
- 預設進入 `Preview` 頁
- 可在預覽頁直接切換範例歌譜
- 可切換是否顯示 `mid / high / low` 標籤，預設隱藏
- 可在設定頁為每個 `digit + pitch level`：
  - 上傳圖片
  - 直接輸入 emoji
- 自訂圖案保存在瀏覽器本機 IndexedDB
- 若未自訂圖案，會使用內建預設 emoji fallback

## 內建範例歌譜

- `🎂 生日快樂`
- `🐝 小蜜蜂`
- `⭐ 小星星`
- `🐯 兩隻老虎`

## 預設圖案

- `1 ❤️`
- `2 🧡`
- `3 💛`
- `4 💚`
- `5 🩵`
- `6 💙`
- `7 💜`
- `0` 目前顯示為數字 `0`

## 開發方式

安裝依賴：

```bash
npm install
```

啟動開發伺服器：

```bash
npm run dev -- --host
```

執行測試：

```bash
npm test
```

執行 build：

```bash
npm run build
```

## 專案結構

- `App.tsx`
  - 管理主頁切換、範例歌譜狀態、預覽設定、圖案 mapping 狀態
- `components/NotationEditorPage.tsx`
  - 簡譜輸入與範例歌譜選擇
- `components/SymbolLibraryPage.tsx`
  - 上傳圖片或輸入 emoji
- `components/PreviewPage.tsx`
  - 圖案譜預覽、歌譜標題、範例切換、pitch label 開關
- `utils/notation.ts`
  - parser 與 row 切分邏輯
- `db.ts`
  - Dexie schema

## 備註

- 目前沒有後端，也沒有雲端同步。
- 目前 `main` 分支已包含全部功能。
