const messages = [
  { type: '🍀 ラッキー', text: '今日は小さな挑戦がいい結果につながるかも！' },
  { type: '😂 ネタ', text: '今日は何をしてもだいたいヨシ！' },
  { type: '💪 励まし', text: '無理しなくても大丈夫。ちょっとずつ進もう！' },
  { type: '🤔 謎の一言', text: '冷蔵庫を開けると、何かが起こるかもしれない。' },
  { type: '😴 ひとやすみ', text: '今日は少し休むのも立派な仕事です。' },
  { type: '✨ 名言っぽい', text: '迷ったら、とりあえずやってみよう。' },
  { type: '🐱 にゃんこ', text: 'にゃーん。今日はそれでいい。' },
  { type: '🎮 ゲーム', text: '今日はセーブを忘れずに。' },
  { type: '🍜 食欲', text: '何か美味しいものを食べると幸せになれそう。' },
  { type: '🌱 成長', text: '昨日の自分より1ミリだけ前へ進もう。' }
];

const rareMessages = [
  '今日は何をやってもうまくいく……かもしれない！',
  'すごく良いことが起こる予感！',
  'このメッセージを見たあなたは超ラッキー！',
  '今日は主人公の日です。',
  '何か新しいことを始めるなら今日！'
];

function getRandomMessage() {
  if (Math.random() < 0.05) {
    return {
      type: '👑 激レア',
      text: rareMessages[Math.floor(Math.random() * rareMessages.length)]
    };
  }
  return messages[Math.floor(Math.random() * messages.length)];
}

export { getRandomMessage };
