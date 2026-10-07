import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(SCRIPT_DIR, '..');

async function loadDotEnv(fileName = '.env') {
  const filePath = resolve(ROOT_DIR, fileName);
  let text;
  try {
    text = await readFile(filePath, 'utf8');
  } catch {
    return {};
  }

  const values = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;

    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[match[1]] = value;
  }
  return values;
}

const dotEnv = await loadDotEnv();
const args = new Map();
for (let i = 0; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (!arg.startsWith('--')) continue;
  const key = arg.slice(2);
  const next = process.argv[i + 1];
  if (next && !next.startsWith('--')) {
    args.set(key, next);
    i++;
  } else {
    args.set(key, '');
  }
}

const env = (name) => process.env[name] ?? dotEnv[name] ?? '';

function normalizeToken(token) {
  return token.trim().replace(/^Bot\s+/i, '');
}

function isSnowflake(value) {
  return /^\d{15,25}$/.test(value.trim());
}

async function askValue(rl, label, current = '', { secret = false } = {}) {
  if (current) return current;
  const suffix = secret ? '（入力は画面に表示されます）' : '';
  const value = await rl.question(`${label}${suffix}: `);
  return value.trim();
}

const rl = createInterface({ input, output });
try {
  let token = args.get('token') || env('DISCORD_TOKEN');
  let applicationId = args.get('application-id') || env('DISCORD_APPLICATION_ID');
  let guildId = args.get('guild-id') || env('DISCORD_GUILD_ID');

  console.log('=== Suzushiro Discord コマンド登録 ===');
  console.log('環境変数 / .env があれば自動利用します。未設定ならここで入力できます。\n');

  token = normalizeToken(await askValue(rl, 'Discord Bot Token', token, { secret: true }));
  applicationId = await askValue(rl, 'Discord Application ID', applicationId);

  if (!token) {
    throw new Error('Discord Bot Token が空です。');
  }
  if (!isSnowflake(applicationId)) {
    throw new Error('Discord Application ID が正しくありません。Developer Portal の Application ID をそのまま入力してください。');
  }

  console.log('\n登録先を選べます。');
  console.log('Guild ID を空欄にすると「全サーバー向け（Global）」になります。');
  console.log('テスト中は Guild ID を指定すると、通常すぐ反映されます。\n');

  guildId = await askValue(rl, 'Discord Guild ID（任意）', guildId);
  if (guildId && !isSnowflake(guildId)) {
    throw new Error('Discord Guild ID が正しくありません。');
  }

  const commands = [
    {
      name: 'omikuji',
      description: '今日のおみくじを引きます'
    },
    {
      name: 'random',
      description: '今日のひとことガチャを引きます'
    },
    {
      name: 'today',
      description: '今日の○○を占います'
    }
  ];

  const endpoint = guildId
    ? `https://discord.com/api/v10/applications/${applicationId}/guilds/${guildId}/commands`
    : `https://discord.com/api/v10/applications/${applicationId}/commands`;

  console.log(`\n登録中: ${guildId ? 'Guild' : 'Global'} commands`);

  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(commands)
  });

  const bodyText = await response.text();
  let body;
  try {
    body = JSON.parse(bodyText);
  } catch {
    body = bodyText;
  }

  if (!response.ok) {
    console.error(`\nDiscord API error: HTTP ${response.status}`);
    console.error(body);

    if (response.status === 401) {
      console.error('\n→ Bot Token が違う可能性があります。Developer Portal > Bot の TOKEN を確認してください。');
    } else if (response.status === 403) {
      console.error('\n→ Bot Token の権限、またはアプリのサーバーへのインストール状態を確認してください。');
    } else if (response.status === 404) {
      console.error('\n→ Application ID / Guild ID を確認してください。');
    }
    process.exitCode = 1;
  } else {
    console.log(`\n✅ ${commands.length} 個のコマンドを登録しました。`);
    console.log(guildId
      ? 'Guild コマンドなので通常すぐ Discord に反映されます。'
      : 'Global コマンドとして登録しました。反映に時間がかかる場合があります。');
    console.log('\n登録内容:');
    for (const command of body) {
      console.log(`  /${command.name} - ${command.description}`);
    }
  }
} finally {
  rl.close();
}
