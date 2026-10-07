const todayContents = [
  { type: '🎯 今日の目標', text: '後回しにしていたことを1つ片付けよう！' },
  { type: '💡 今日のチャレンジ', text: '普段やらないことを1つやってみよう！' },
  { type: '🍜 今日のおすすめ', text: '今日は好きなものを食べて、自分を甘やかそう。' },
  { type: '🎵 今日の気分', text: 'お気に入りの曲を聴いてテンションを上げよう！' },
  { type: '🐱 今日のひとこと', text: '焦らなくて大丈夫。自分のペースでいこう。' },
  { type: '🌱 今日のテーマ', text: '昨日の自分より、ほんの少しだけ前へ。' },
  { type: '🍀 今日のラッキー行動', text: 'いつもより少し早く行動してみよう！' },
  { type: '☕ 今日の休憩', text: '頑張りすぎる前に、ちゃんと休もう。' },
  { type: '🤝 今日のミッション', text: '誰かに「ありがとう」と伝えてみよう。' },
  { type: '🎮 今日の遊び', text: '今日は思いっきり好きなことを楽しもう！' }
];

const rareContents = [
  { type: '👑 今日の超レア', text: '今日はあなたが主人公。何か面白いことが起こるかも！' },
  { type: '🌈 今日の超レア', text: '最高の一日になる予感。小さな幸せを探してみよう！' },
  { type: '💎 今日の超レア', text: 'このメッセージを見たあなたは超ラッキー！' }
];

function getTodayContent() {
  if (Math.random() < 0.05) {
    return rareContents[Math.floor(Math.random() * rareContents.length)];
  }
  return todayContents[Math.floor(Math.random() * todayContents.length)];
}

export { getTodayContent };
