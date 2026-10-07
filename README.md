# minase-cfw-bot

元の `suzushiro` から `/omikuji`・`/random`・`/today` の3機能だけを切り出し、Cloudflare Workers向けにES Modulesで再構成したものです。

## 含まれる機能

- `GET /omikuji` — おみくじをJSONで返す
- `GET /random` — 今日のひとことガチャをJSONで返す
- `GET /today` — 今日の○○をJSONで返す
- `POST /discord` — Discord Interactions Endpointとして3コマンドに応答
- `GET /` — ヘルスチェック兼エンドポイント一覧

SQLite、`discord.js`、ゲーム関連ファイルはすべて除外しています。

## 1. ローカルで確認

```bash
npm install
npm run check
npm run dev
```

起動後:

```text
http://localhost:8787/omikuji
http://localhost:8787/random
http://localhost:8787/today
```

## 2. Cloudflareへデプロイ

```bash
npx wrangler login
npm run deploy
```

## 3. Discordでスラッシュコマンドとして使う

Cloudflare WorkerのURLを、Discord Developer Portalの **Interactions Endpoint URL** に次のように設定します。

```text
https://YOUR-WORKER.workers.dev/discord
```

WorkerにはDiscordアプリの公開鍵をSecretとして登録します。

```bash
npx wrangler secret put DISCORD_PUBLIC_KEY
```

値には Discord Developer Portal の **Public Key** を入れます。

その後、コマンドを1回登録します。

```bash
DISCORD_TOKEN="Botトークン" \
DISCORD_APPLICATION_ID="アプリケーションID" \
npm run register:commands
```

## 4. 期待するレスポンス

`GET /random`

```json
{
  "type": "🍀 ラッキー",
  "text": "今日は小さな挑戦がいい結果につながるかも！"
}
```

`GET /today`

```json
{
  "type": "🎯 今日の目標",
  "text": "後回しにしていたことを1つ片付けよう！"
}
```

`GET /omikuji` は `result`・`color`・`description`・`fields` を返します。

## 注意

`/discord` はDiscordからのリクエスト署名を `DISCORD_PUBLIC_KEY` で検証します。`DISCORD_TOKEN` はWorker側には不要です。WorkerはDiscord Gatewayへ常時接続するBotではなく、HTTPでDiscord Interactionsを受ける構成です。
