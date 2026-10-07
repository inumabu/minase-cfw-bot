# minase-cfw-bot

元の `suzushiro` から `/omikuji`・`/random`・`/today` の3機能だけを切り出し、Cloudflare Workers向けにES Modulesで再構成したものです。

## 含まれる機能

- `GET /omikuji` — おみくじをJSONで返す
- `GET /random` — 今日のひとことガチャをJSONで返す
- `GET /today` — 今日の○○をJSONで返す
- `POST /discord` — Discord Interactions Endpointとして3コマンドに応答
- `GET /` — ヘルスチェック兼エンドポイント一覧

SQLite、`discord.js`、ゲーム関連ファイルはすべて除外しています。

## 1. 必要なもの

Node.js 20 以上を推奨します。

```bash
npm install
npm run check
```

## 2. Cloudflare Workerをデプロイ

```bash
npx wrangler login
npm run deploy
```

デプロイ後に表示される `https://xxxxx.workers.dev` を確認します。

## 3. Discord Public KeyをWorkerに設定

Discord Developer Portal → 対象アプリ → **General Information** → **Public Key** を使います。

```bash
npx wrangler secret put DISCORD_PUBLIC_KEY
```

入力を求められたら Public Key を貼り付けます。

## 4. Discord Interactions Endpoint URLを設定

Discord Developer Portal → **General Information** → **Interactions Endpoint URL** に、次を設定します。

```text
https://YOUR-WORKER.workers.dev/discord
```

保存時に Discord 側の検証が通ればOKです。

## 5. スラッシュコマンド登録（ここが重要）

以前のように Cloudflare の Secret を直接 `process.env` から読む必要はありません。

```bash
npm run register:commands
```

実行すると、必要な値を順番に聞かれます。

```text
=== Suzushiro Discord コマンド登録 ===

Discord Bot Token（入力は画面に表示されます）:
Discord Application ID:
Discord Guild ID（任意）:
```

### 入力する値

**Discord Bot Token**

Developer Portal → **Bot** → **Token** の値です。
`Bot ` を付けず、そのままTokenだけ貼り付ければOKです。

**Discord Application ID**

Developer Portal → **General Information** → **Application ID** です。

**Discord Guild ID**（任意）

テスト対象サーバーのIDです。
入力すると Guild コマンドとして登録され、通常すぐ反映されます。
空欄なら Global コマンドとして登録されます。

### 環境変数を使いたい場合

プロジェクト直下に `.env` を作ってもOKです。

```env
DISCORD_TOKEN=ここにBot Token
DISCORD_APPLICATION_ID=ここにApplication ID
DISCORD_GUILD_ID=ここにテスト用Guild ID
```

`.env` はGitにコミットしないでください。

また、コマンドラインから直接渡すこともできます。

```bash
npm run register:commands -- --token YOUR_BOT_TOKEN --application-id YOUR_APPLICATION_ID --guild-id YOUR_GUILD_ID
```

Guild IDを付けなければ Global 登録になります。

## 6. Discord Botをサーバーに入れる

Guild コマンドを登録する場合、そのBotが対象サーバーにインストールされている必要があります。
OAuth2 URL Generator で少なくとも次のスコープを使います。

- `bot`
- `applications.commands`

## 7. 動作確認

WorkerのHTTP API:

```text
https://YOUR-WORKER.workers.dev/omikuji
https://YOUR-WORKER.workers.dev/random
https://YOUR-WORKER.workers.dev/today
```

Discordでは:

```text
/omikuji
/random
/today
```

## トラブルシューティング

### `401 Unauthorized`
Bot Token が間違っています。Developer Portal → Bot からTokenを再確認してください。

### `403 Forbidden`
Botの認証・インストール状態・権限を確認してください。対象GuildにBotが入っているか確認します。

### コマンドがDiscordに出てこない
まず `Guild ID` を指定して登録してください。Guild コマンドはテストに向いています。
Global コマンドはDiscord側で反映に時間がかかることがあります。

### `npx wrangler secret put DISCORD_PUBLIC_KEY` と `register:commands` は別物
`DISCORD_PUBLIC_KEY` は **Cloudflare WorkerがDiscordからの署名を検証するための値**です。
`DISCORD_TOKEN` と `DISCORD_APPLICATION_ID` は **コマンド登録スクリプトがDiscord APIを呼ぶための値**です。

したがって、次のように別々に設定するのが正しい構成です。

```text
Cloudflare Worker
  └─ DISCORD_PUBLIC_KEY

ローカルの register:commands
  ├─ DISCORD_TOKEN
  ├─ DISCORD_APPLICATION_ID
  └─ DISCORD_GUILD_ID（任意）
```
