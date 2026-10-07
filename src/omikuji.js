const fortuneData = [
  {
    result: '【大吉】',
    color: 0xFF0000,
    description: '天が味方する最高の流れ。迷いが晴れ、思い切った決断が吉となる。今までの努力が報われ、喜びが大きく広がる兆し。',
    fields: [
      { name: '願望', value: '叶う。焦らずとも自然に近づく。', inline: true },
      { name: '恋愛', value: '出会いも進展も最高潮。告白は大吉。', inline: true },
      { name: '仕事', value: '評価される。挑戦が成功につながる。', inline: true },
      { name: '金運', value: '思わぬ臨時収入あり。使いすぎ注意。', inline: true },
      { name: '健康', value: '心身ともに快調。運動を始めるとさらに良し。', inline: true },
      { name: 'ラッキー', value: '赤色・朝の散歩・甘いもの', inline: true }
    ]
  },
  {
    result: '【中吉】',
    color: 0x00FF00,
    description: '良い流れが来ているが、調子に乗ると足元をすくわれる。慎重さと誠実さが運をさらに高める鍵。',
    fields: [
      { name: '願望', value: '叶うが少し時間がかかる。', inline: true },
      { name: '恋愛', value: '距離が縮まる。焦らず相手を思いやれ。', inline: true },
      { name: '仕事', value: '地道な努力が成果になる。目上の助けあり。', inline: true },
      { name: '金運', value: '安定。貯める意識が吉。', inline: true },
      { name: '健康', value: '体力はあるが油断禁物。睡眠を大切に。', inline: true },
      { name: 'ラッキー', value: '緑色・読書・温かいお茶', inline: true }
    ]
  },
  {
    result: '【小吉】',
    color: 0xFFFF00,
    description: '小さな幸運が積み重なる日。大きな成果よりも「日々の積み上げ」が大事。気づかないところにチャンスが隠れている。',
    fields: [
      { name: '願望', value: '少しずつ叶う。準備が大切。', inline: true },
      { name: '恋愛', value: '進展はゆっくり。聞き上手が吉。', inline: true },
      { name: '仕事', value: 'ミスを減らすほど評価が上がる。', inline: true },
      { name: '金運', value: '無駄遣いを減らせば運が開ける。', inline: true },
      { name: '健康', value: '軽い不調が出やすい。冷えに注意。', inline: true },
      { name: 'ラッキー', value: '黄色・整理整頓・パン', inline: true }
    ]
  },
  {
    result: '【吉】',
    color: 0x00FFFF,
    description: '穏やかに運が巡る。大きな波はないが、心がけ次第で良い方向へ。「丁寧さ」が運を呼ぶ。',
    fields: [
      { name: '願望', value: '努力すれば叶う。途中で諦めるな。', inline: true },
      { name: '恋愛', value: '安心できる関係が育つ。過去の縁が動くことも。', inline: true },
      { name: '仕事', value: '周囲との協力が成功の鍵。独断は凶。', inline: true },
      { name: '金運', value: '普通。計画的に使えば問題なし。', inline: true },
      { name: '健康', value: '生活リズムを整えると吉。', inline: true },
      { name: 'ラッキー', value: '白色・神社の参拝・靴を磨く', inline: true }
    ]
  },
  {
    result: '【末吉】',
    color: 0x800080,
    description: '今はまだ静かな流れ。大きな幸運は先に控えている。焦らず歩めば、やがて光が差し込む。「継続」と「我慢」が未来の吉を呼ぶ兆し。',
    fields: [
      { name: '願望', value: 'すぐには叶わぬが、努力を続ければ後に実る。', inline: true },
      { name: '恋愛', value: 'ゆっくり育つ縁あり。今は信頼を積む時。', inline: true },
      { name: '仕事', value: '地道な積み重ねが評価につながる。裏方役が吉。', inline: true },
      { name: '金運', value: '大きな増減なし。今は守りの時。', inline: true },
      { name: '健康', value: '無理をしなければ安定。習慣の見直し吉。', inline: true },
      { name: 'ラッキー', value: '紫色・夕暮れの散歩・日記を書く', inline: true }
    ]
  },
  {
    result: '【凶】',
    color: 0x333333,
    description: '思い通りに進みにくい時。焦って動くと傷口を広げる恐れあり。今は「自分磨き」と「現状維持」に徹するのが賢明。嵐が過ぎ去るのを静かに待おう。',
    fields: [
      { name: '願望', value: '難航する。今は時期を待て。', inline: true },
      { name: '恋愛', value: '誤解が生じやすい。言葉選びは慎重に。', inline: true },
      { name: '仕事', value: 'ケアレスミスに注意。確認を怠るな。', inline: true },
      { name: '金運', value: '予想外の出費に注意。財布の紐を締めよ。', inline: true },
      { name: '健康', value: '疲れが慢性的になりやすい。早めの休息を。', inline: true },
      { name: 'ラッキー', value: '黒色・掃除・温かいお風呂', inline: true }
    ]
  },
  {
    result: '【大凶】',
    color: 0x000000,
    description: '嵐のように運が乱れやすい。何をやっても裏目に出やすい時期。しかし、ここが底。これ以上悪くなることはない。「膿(うみ)を出す時」と捉え、謙虚に過ごせば道が開ける。',
    fields: [
      { name: '願望', value: 'かなり厳しい。一度計画を白紙にする勇気を。', inline: true },
      { name: '恋愛', value: 'トラブルの予感。感情的にならないこと。', inline: true },
      { name: '仕事', value: '大きな挑戦は控えよ。足元を固める時。', inline: true },
      { name: '金運', value: '紛失や浪費に最大級の警戒を。', inline: true },
      { name: '健康', value: '無理は禁物。しっかり休養を取ること。', inline: true },
      { name: 'ラッキー', value: '灰色・深呼吸・お守り', inline: true }
    ]
  }
];

function drawOmikuji() {
  return fortuneData[Math.floor(Math.random() * fortuneData.length)];
}

export { drawOmikuji };
