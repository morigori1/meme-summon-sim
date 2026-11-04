// ミームデータベースと文脈システム

const MEME_DATABASE = {
    // 日本ミーム
    yaju: {
        id: 'yaju',
        name: '野獣先輩',
        displayName: '野獣先輩',
        avatar: '🗣️',
        description: '語録テンプレミーム（キャラクター）',
        tags: ['語録', '即応', '圧倒'],
        basePower: 25,
        baseHP: 100,
        flavorWin: '「まずうちさぁ、勝ったんだけど...焼いてかない？」',
        flavorLose: '「あぁ^〜こころがぴょんぴょんするんじゃぁ^〜」（違うアニメ）'
    },
    
    nullpo: {
        id: 'nullpo',
        name: 'ぬるぽ・ガッ',
        displayName: 'ぬるぽ・ガッ',
        avatar: '💥',
        description: '即座反応コンボミーム',
        tags: ['即応', '連携', '古典'],
        basePower: 20,
        baseHP: 90,
        flavorWin: 'ぬるぽ → ガッ！完璧なタイミングで勝利！',
        flavorLose: 'ガッされすぎて敗北...'
    },

    buront: {
        id: 'buront',
        name: 'ブロントさん',
        displayName: 'ブロントさん',
        avatar: '⚔️',
        description: 'ナイト様の伝説的語録',
        tags: ['語録', '古典', '圧倒'],
        basePower: 30,
        baseHP: 120,
        flavorWin: '「ナイトが盾を持って何が悪い」圧倒的勝利！',
        flavorLose: '「廃人乙」と煽られて敗北'
    },

    hattoushin: {
        id: 'hattoushin',
        name: '八頭身モナー',
        displayName: '八頭身モナー',
        avatar: '🎭',
        description: '長身で不気味なAA進化形',
        tags: ['古典', '不気味', 'AA'],
        basePower: 22,
        baseHP: 95,
        flavorWin: '静かに、しかし確実に勝利を掴んだ...',
        flavorLose: '闇に消えていった...'
    },

    tonfa: {
        id: 'tonfa',
        name: 'トンファー',
        displayName: 'トンファー',
        avatar: '🥋',
        description: '「トンファーキック！」武術ネタ',
        tags: ['武術', '即応', 'ネタ'],
        basePower: 24,
        baseHP: 100,
        flavorWin: 'トンファーキック！見事命中！',
        flavorLose: 'トンファーが折れた...'
    },

    cco: {
        id: 'cco',
        name: 'CCO',
        displayName: 'CCO（るろ剣英語版空耳）',
        avatar: '🎤',
        description: 'るろうに剣心英語吹き替え版の志々雄空耳／るろうに検診MAD',
        tags: ['空耳', '音MAD', 'ネタ'],
        basePower: 21,
        baseHP: 85,
        flavorWin: '「See See Oh!」の圧倒的存在感で勝利！',
        flavorLose: '空耳が通じなかった...'
    },

    // 海外ミーム
    rickroll: {
        id: 'rickroll',
        name: 'Rickroll',
        displayName: 'Rickroll',
        avatar: '🎵',
        description: 'Never Gonna Give You Upトラップ',
        tags: ['音楽', '不意打ち', '海外'],
        basePower: 26,
        baseHP: 95,
        flavorWin: '♪ Never gonna give you up... 完全勝利！',
        flavorLose: '曲が流れきる前に敗北...'
    },

    thisisfine: {
        id: 'thisisfine',
        name: 'This is fine',
        displayName: 'This is fine',
        avatar: '🔥',
        description: '炎上中でも平然とする犬',
        tags: ['現実逃避', '海外', '哲学'],
        basePower: 18,
        baseHP: 110,
        flavorWin: '「大丈夫、問題ない」...本当に勝った！',
        flavorLose: '実際問題あった。'
    },

    leeroy: {
        id: 'leeroy',
        name: 'Leeroy Jenkins',
        displayName: 'Leeroy Jenkins',
        avatar: '⚡',
        description: '計画無視の突撃伝説',
        tags: ['突撃', 'ゲーム', '海外'],
        basePower: 35,
        baseHP: 70,
        flavorWin: '「LEEEEROY JENKINS!!!」無謀な突撃が功を奏した！',
        flavorLose: '予想通り全滅した。'
    },

    doge: {
        id: 'doge',
        name: 'Doge',
        displayName: 'Doge',
        avatar: '🐕',
        description: 'such wow, much memeな柴犬',
        tags: ['動物', '海外', '万能'],
        basePower: 23,
        baseHP: 100,
        flavorWin: 'wow. such victory. much skill.',
        flavorLose: 'so defeat. very sad. wow.'
    }
};

// 戦場文脈の定義
const BATTLEFIELD_CONTEXTS = [
    {
        id: 'classic',
        name: '懐古の空気',
        tags: ['古典', 'AA', '語録'],
        description: '2000年代のインターネット文化が漂う'
    },
    {
        id: 'heated',
        name: '炎上気味',
        tags: ['圧倒', '突撃', '即応'],
        description: '激しい感情が渦巻いている'
    },
    {
        id: 'absurd',
        name: '不条理劇場',
        tags: ['ネタ', '空耳', '不気味'],
        description: '理屈を超えた展開が待っている'
    },
    {
        id: 'global',
        name: 'グローバル会場',
        tags: ['海外', '音楽', 'ゲーム'],
        description: '国境を越えたミームが集う'
    },
    {
        id: 'philosophical',
        name: '深淵を覗く',
        tags: ['哲学', '現実逃避', '不気味'],
        description: '何かを考えさせられる雰囲気'
    }
];

// 文脈マッチ判定
function calculateContextMatch(memeTags, battlefieldTags) {
    const matches = memeTags.filter(tag => battlefieldTags.includes(tag));
    return matches.length;
}

// ダメージ計算（文脈ボーナス込み）
function calculateDamage(attacker, defender, battlefieldTags, chargeMultiplier = 1) {
    const baseAttack = attacker.basePower;
    const freshnessMultiplier = attacker.freshness / 100;
    
    // 文脈マッチボーナス
    const matchCount = calculateContextMatch(attacker.tags, battlefieldTags);
    const contextBonus = matchCount * 0.3; // 1マッチにつき+30%
    
    // ランダム要素
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 ~ 1.2
    
    const totalDamage = Math.floor(
        baseAttack * freshnessMultiplier * (1 + contextBonus) * randomFactor * chargeMultiplier
    );
    
    return {
        damage: totalDamage,
        matchCount: matchCount,
        contextBonus: contextBonus
    };
}

// ランダムな敵ミームを選択
function selectRandomEnemy(playerMeme) {
    const allMemes = Object.values(MEME_DATABASE);
    const availableEnemies = allMemes.filter(m => m.id !== playerMeme.id);
    return availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
}

// ランダムな戦場文脈を選択
function selectRandomBattlefield() {
    return BATTLEFIELD_CONTEXTS[Math.floor(Math.random() * BATTLEFIELD_CONTEXTS.length)];
}
