# 網絡傳送實驗

GitHub Pages 靜態站，用書面**廣東話**（唔係書面普通話）教 computer networking。對象係香港**大專**新生：術語保留英文（octet、prefix、dual-stack），旁邊用粵語解釋。第一個單元係 IPv4／IPv6 位址；資訊架構已經預留更多網絡單元，同獨立嘅「伺服器維護」軌道。

呢個 repo **冇後端、冇登入、冇收費 API**。進度預設寫入瀏覽器 `localStorage`，亦可以匯出／匯入「進度碼」或者 JSON 檔。

## 本機行

需要 Node.js 22+。

```bash
npm install
npm run dev
```

開發伺服器：`http://127.0.0.1:46217`（刻意避開 3000／5173／8080）。

```bash
npm run build
npm run preview
```

`preview` 同樣用 46217。靜態產出喺 `dist/`。用咗 HashRouter，喺 GitHub Pages 子路徑都可以開深層書籤。

## GitHub Pages（帳戶 agentfuture818）

Workflow 喺 `.github/workflows/pages.yml`，用 **GitHub Actions** 建站再 deploy（免費 Pages，唔使 GitHub Pro）。

1. 喺 [github.com/agentfuture818](https://github.com/agentfuture818) 開一個 public repo，然後把呢個專案 push 上去。
2. **Settings → Pages → Build and deployment → Source** 揀 **GitHub Actions**。
3. 確保 Actions 權限允許 workflow 跑（Settings → Actions → General）。
4. Push `main`（或者喺 Actions 手動 `workflow_dispatch`）。
5. Project site URL：`https://agentfuture818.github.io/<repo-name>/`  
   如果 repo 名係 `agentfuture818.github.io`，workflow 會用 `base: /`，URL 就係 `https://agentfuture818.github.io/`。

本機 `vite.config.ts` 預設 `base: './'`。CI 會按 repo 名設定 `GITHUB_PAGES_BASE`。

## 而家有咩課

軌道 **網絡傳送** → 單元 **IPv4 同 IPv6 位址**：

1. 點解主機要有 IP 地址（轉發需要 destination；郵政只係系統層類比）
2. 點樣讀 IPv4：octet、32-bit、prefix length
3. 用 IPv4 傳送封包（hop-by-hop、TTL、destination bits）
4. IPv6 點解出現、hextet 同 `::` 壓縮
5. IPv4 vs IPv6 同 dual-stack
6. 練習：分辨位址類型；砌／修正位址（即時回饋）

未寫（只佔位）：封包 header、CIDR、DNS、伺服器維護。

## 進度碼

- 本機 key：`netlab.progress.v1`
- 進度碼格式：`NL1.<payload>.<checksum>`
- 格式錯、校驗失敗、JSON 唔合規格會喺「進度」頁顯示錯誤，唔會默默蓋掉
