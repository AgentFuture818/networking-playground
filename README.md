# 網絡傳送實驗

GitHub Pages 靜態站，用書面**廣東話**教 computer networking。對象係香港**大專**：問題 → 日常 usecase → 親手玩 → 先至安專有名詞。第一期只解鎖**單元 1「點樣搵到對方」**（IPv4／IPv6 連埋 local vs global，虛擬封包 lab）。地圖預告單元 2–16，內容鎖住。另開「伺服器維護」軌道佔位。

冇後端、冇登入、冇收費 API。進度：`localStorage` + 「進度碼」／JSON 匯出匯入。

**玩法：** 扮 lab 係主菜。之後單元先至有可選公開白名單（httpbin、badssl、neverssl、example.com、1.1.1.1、icanhazip、Cloudflare 站睇 `h3`、`ssh -T git@github.com`）。唔亂 telnet 人哋 MX、唔掃 port、真 SMTP 出網唔玩。瀏覽器做唔到真 ICMP。

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

`preview` 同樣用 46217。靜態產出喺 `dist/`。HashRouter，適合 GitHub Pages 子路徑。

## GitHub Pages（帳戶 agentfuture818）

Workflow：`.github/workflows/pages.yml`（免費 Actions Pages）。

1. 喺 [github.com/agentfuture818](https://github.com/agentfuture818) 開 public repo，push 呢個專案。
2. Settings → Pages → Source 揀 **GitHub Actions**。
3. 確保 Actions 可跑。Push `main` 或手動 `workflow_dispatch`。
4. URL：`https://agentfuture818.github.io/<repo-name>/`；若 repo 名係 `agentfuture818.github.io`，則 `https://agentfuture818.github.io/`。

本機 `vite.config.ts` 預設 `base: './'`。CI 會設 `GITHUB_PAGES_BASE`。

## 課程地圖

**可玩：** 單元 1 點樣搵到對方（問題先行、屋企 LAN vs 外網朋友、IPv4 私網／IPv6 ULA／global 一齊送封包、之後先讀 octet／prefix／dual-stack、兩項練習）。

**鎖住預告（2–16）：** DNS（名→地址；Wi-Fi 連到但「冇網」好多時係 DNS）、Ping／ICMP（包括 ping 唔到 port）、subnet／switch／router、broadcast／multicast、packet loss、TCP vs UDP、HTTP 同 port、HTTP/1→2→3（同一個新聞站每一代一個痛）、HTTPS／TLS（明信片 vs 信封；SSL 係舊名；證書要認人）、WebRTC、telnet／nc 手打假 SMTP／HTTP、SSH vs telnet 登入、CDN cache HIT／MISS、香港點行近附近副本（unicast origin／GeoDNS／anycast／應用層揀）、WARP ≠ CDN（MASQUE／QUIC 隧道，排最後）。

## 進度碼

- 本機 key：`netlab.progress.v2`
- 格式：`NL1.<payload>.<checksum>`
- 格式錯、校驗失敗會顯示錯誤，唔會默默蓋掉
