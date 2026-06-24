# 七福の謎解きアプリ（LINEミニアプリ / LIFF）

七福脱出部「2026合宿謎」の謎解きアプリ。LINEログインしてユーザーごとに進捗をDB保存します。
**Next.js (App Router) + React + TypeScript + Tailwind CSS v4 + Framer Motion + LIFF + Upstash Redis**

## 画面フロー

```
ログイン → ホーム画面(tap) → トップ画面
  ├ 左「合宿謎解き」(立体・脈動で強調) → 注意事項 →[次へ]→ 謎01..10
  │     正解=次の問題 / 不正解=不正解画面 →[閉じる]→ 同じ問題（何度でも）
  │     10問正解 → 合宿なぞクリア(保存可) → トップが「おまけ謎解放」に変化
  └ 右オレンジ(解放後) → 解放メッセージ → 注意事項 →[次へ]→ おまけ謎01→02
        02正解 → 謎解き完了(保存可) + お名前入力 →[送信]→ 全問正解者に登録
```
※ アプリを閉じても進捗はDB保存。再開時は トップ→注意事項→途中の問題 の順で表示。

各謎解き画面：問題画像（長押し保存可）／右上ハンバーガーメニュー／その下にヒントボタン
4〜5個／「回答入力欄」ラベル＋赤字「回答時、問題番号を頭につけてください」／入力欄／
「回答送信」（入力があるときだけ活性）。

ハンバーガーメニュー（「閉じる」以外はポップアップ）：
`回答した問題と答えを確認する`（本人のみ）／`全問正解者を見る`（名前＋クリア日時）／
`注意事項をみる`／`メニューを閉じる`。

## アーキテクチャ

- **正解はサーバー側のみ**（`src/lib/answers.server.ts`）。クライアントには答えを置かずチート防止。
  判定は「全空白（半角/全角）を除去して一致」。指定の表記ゆれ（番号＋ひらがな/漢字、半角/全角）を網羅。
- **認証**：クライアントが `liff.getIDToken()` を `Authorization: Bearer` で送信 →
  サーバーが LINE の verify エンドポイントで検証して userId を特定（`src/lib/auth.ts`）。
- **DB**：Upstash Redis（`src/lib/db.ts`）。TTL 約400日でアクセス毎に延長（最低1年保持）。
  環境変数が無い場合はメモリ内ストアにフォールバック（開発用・非永続）。
- **API**（`app/api/*`）
  - `GET  /api/progress` … 自分の進捗
  - `POST /api/answer` … 回答判定＋進捗更新（正解のみ保存）
  - `POST /api/register` … 最終クリア者として名前を登録
  - `GET  /api/winners` … 全問正解者一覧（名前＋クリア日時、クリア順）

## ディレクトリ

```
app/
  layout.tsx, globals.css, page.tsx
  api/{progress,answer,register,winners}/route.ts
src/
  lib/      liff.ts, api.ts(クライアント), auth.ts, db.ts,
            answers.server.ts(正解:サーバー専用), puzzles.ts(問題メタ/ヒント), types.ts
  hooks/    useGame.ts(状態機械＋サーバー同期)
  components/
    GameApp.tsx
    screens/  Loading, Home, Top, Notice, Puzzle, Incorrect, MainClear, FinalClear, BonusUnlockModal
    menu/     HamburgerMenu, AnsweredListModal, WinnersModal, NoticeModal
    ui/       Modal, PrimaryButton, SaveableImage, HintButtons
```

## セットアップ

```bash
npm install
cp .env.local.example .env.local   # LIFF ID / LINE_CHANNEL_ID / Upstash を設定
npm run dev                        # http://localhost:3000
```

環境変数が未設定でも `npm run dev` は動きます（メモリ内ストア＋開発ユーザー、非永続）。

## デプロイ（Vercel）

1. リポジトリを Vercel にインポート。
2. Marketplace から **Upstash (Redis)** を追加 → `UPSTASH_REDIS_REST_URL` /
   `UPSTASH_REDIS_REST_TOKEN` が自動で環境変数に入ります。
3. `NEXT_PUBLIC_LIFF_ID` と `LINE_CHANNEL_ID` を環境変数に設定。
4. デプロイ後の公開URLを、LINE Developers の LIFF エンドポイントURLに設定。

## 問題・正解・ヒントの編集

- ヒント・画像・ラベル：`src/lib/puzzles.ts`
- 正解（許容リスト）：`src/lib/answers.server.ts`（サーバー専用、クライアントに出ません）

## 素材マッピング（`public/images/`）

| ファイル | 用途 |
|---|---|
| `home.png` | ホーム画面 |
| `top-bg.png` / `top-bg-unlocked.png` | トップ（おまけ謎ロック中／解放後） |
| `intro.png` | 謎解き注意事項 |
| `puzzle-01〜10.jpg` | 合宿謎 1〜10 |
| `incorrect.png` | 不正解 |
| `main-clear.png` | 合宿なぞクリア |
| `bonus-01.jpg`（おまけ謎０１）| おまけ謎1（断片、ヒント5、答え `0すてき`）|
| `bonus-02.jpg`（おまけ謎０２）| おまけ謎2（並べ替え、ヒント無し、答え `10七天発揮`）|
| `main-complete.jpg`（謎解き完了）| 最終クリア（名前入力）|

## ビルド

```bash
npm run build
```
