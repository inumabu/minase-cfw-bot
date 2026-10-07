const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;

if (!token || !applicationId) {
  console.error('DISCORD_TOKEN と DISCORD_APPLICATION_ID を環境変数に設定してください。');
  process.exit(1);
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

const response = await fetch(
  `https://discord.com/api/v10/applications/${applicationId}/commands`,
  {
    method: 'PUT',
    headers: {
      'Authorization': `Bot ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(commands)
  }
);

const text = await response.text();
if (!response.ok) {
  console.error(`Discord API error ${response.status}: ${text}`);
  process.exit(1);
}

console.log('スラッシュコマンドを登録しました:');
console.log(text);
