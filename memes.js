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
        flavorLose: '「あぁ^〜こころがぴょんぴょんするんじゃぁ^〜」（違うアニメ）',
        catchphrase: '「まずうちさぁ...屋上あんだけど、焼いてかない？」',
        lore: '淫夢語録として知られる多目的語録系ミーム。あらゆる場面で応用可能な汎用性の高さが特徴。インターネット上のコミュニケーションを独特の方向に進化させた。',
        signatureMove: '語録連打・焼き払い',
        personality: {
            attackLine: 'いいよ！来いよ！',
            feintLine: '見とけよ見とけよ～',
            chargeLine: 'まずうちさぁ...準備があるんだけど'
        },
        uniqueTrait: {
            name: '語録テンプレ',
            description: '攻撃成功時、語録の汎用性で鮮度+3回復',
            type: 'on_attack_success'
        },
        themeColor: '#ff6b35',
        themeImage: 'https://picsum.photos/seed/yaju-fire/800/600?blur=2'
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
        flavorLose: 'ガッされすぎて敗北...',
        catchphrase: 'ぬるぽ（ガッ）',
        lore: '2chで生まれた反射的なやり取り文化。「ぬるぽ」と書けば誰かが「ガッ」と返す掟。スレッドの空気を和ませる古典的コンボとして今も受け継がれる。',
        signatureMove: '即応ガッ',
        personality: {
            attackLine: 'ぬるぽ',
            feintLine: 'ガッ！（空振り）',
            chargeLine: 'ぬるぽ...'
        },
        uniqueTrait: {
            name: '即応',
            description: 'フェイント成功時に反撃ダメージ+8',
            type: 'on_feint_success'
        },
        themeColor: '#ffd700',
        themeImage: 'https://picsum.photos/seed/nullpo-lightning/800/600?blur=2'
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
        flavorLose: '「廃人乙」と煽られて敗北',
        catchphrase: '「ナイトが前衛で何が悪い」',
        lore: 'FF11のプレイヤーから生まれた誤字と独特の理論で知られる伝説。「廃人乙」などの名言とともに、ネトゲ文化を代表するキャラクターとして語り継がれる。',
        signatureMove: 'ナイト様強撃',
        personality: {
            attackLine: '廃人乙',
            feintLine: 'それFF11な',
            chargeLine: 'ナイトは前衛なんだぞ'
        },
        uniqueTrait: {
            name: 'ナイト様',
            description: 'チャージ完了攻撃の倍率1.5倍→2.0倍',
            type: 'charge_boost'
        },
        themeColor: '#4169e1',
        themeImage: 'https://picsum.photos/seed/buront-knight/800/600?blur=2'
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
        flavorLose: '闇に消えていった...',
        catchphrase: '................',
        lore: '本来かわいらしいモナーが縦に引き延ばされ不気味な姿に。AAアートの進化と破壊のバランスを体現する存在として2ch黎明期に恐怖と笑いをもたらした。',
        signatureMove: '不気味な視線',
        personality: {
            attackLine: '............',
            feintLine: '..........？',
            chargeLine: '..................'
        },
        uniqueTrait: {
            name: '不気味',
            description: '攻撃時、相手の鮮度を追加-3',
            type: 'freshness_drain'
        },
        themeColor: '#2d2d2d',
        themeImage: 'https://picsum.photos/seed/hattoushin-dark/800/600?grayscale&blur=3'
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
        flavorLose: 'トンファーが折れた...',
        catchphrase: 'トンファーを持って防御するのは基本だろう',
        lore: '武術の基本を逸脱した独特の使い方ネタ。トンファーで蹴る、投げる、などの謎理論が展開され、武器の概念を破壊していく面白さ。',
        signatureMove: 'トンファーキック',
        personality: {
            attackLine: 'トンファーキック！',
            feintLine: 'トンファーガード！',
            chargeLine: 'トンファーをかまえる...'
        },
        uniqueTrait: {
            name: '武術',
            description: '連続攻撃成功で威力累積+4/回',
            type: 'combo_stack'
        },
        themeColor: '#8b4513',
        themeImage: 'https://picsum.photos/seed/tonfa-martial/800/600?blur=2'
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
        flavorLose: '空耳が通じなかった...',
        catchphrase: 'See See Oh! ウマウマ!',
        lore: 'るろうに剣心英語版の志々雄セリフが「CCO」に聞こえる空耳。音MAD素材としての汎用性と謎の中毒性で一世を風靡した。るろうに検診などの派生も。',
        signatureMove: 'CCO連打',
        personality: {
            attackLine: 'See See Oh!',
            feintLine: 'ウマウマ！',
            chargeLine: 'るろうに...'
        },
        uniqueTrait: {
            name: '空耳',
            description: '不条理タグの戦場でダメージ+20%',
            type: 'battlefield_bonus',
            targetTag: 'ネタ'
        },
        themeColor: '#ff1493',
        themeImage: 'https://picsum.photos/seed/cco-sound/800/600?blur=2'
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
        flavorLose: '曲が流れきる前に敗北...',
        catchphrase: '♪ Never gonna give you up...',
        lore: 'リック・アストリーの楽曲でだますインターネット最古級のトラップミーム。クリックした先で流れる曲と共に、不意打ちの芸術として完成された。',
        signatureMove: 'Rickroll',
        personality: {
            attackLine: '♪ Never gonna give you up',
            feintLine: '♪ Never gonna let you down',
            chargeLine: '♪ Never gonna run around...'
        },
        uniqueTrait: {
            name: '不意打ち',
            description: '初ターン攻撃のダメージ+50%',
            type: 'first_turn_boost'
        },
        themeColor: '#ff4500',
        themeImage: 'https://picsum.photos/seed/rickroll-music/800/600?blur=2'
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
        flavorLose: '実際問題あった。',
        catchphrase: 'This is fine.',
        lore: '炎に包まれた部屋でコーヒーを飲む犬。現実逃避と諦念の象徴として、困難な状況でのセルフコントロール（もしくは現実拒否）を表現する。',
        signatureMove: '平然',
        personality: {
            attackLine: 'This is fine.',
            feintLine: 'Everything is fine.',
            chargeLine: 'This is...'
        },
        uniqueTrait: {
            name: '平然',
            description: 'HP50%以下で被ダメージ-25%',
            type: 'low_hp_defense'
        },
        themeColor: '#ff6347',
        themeImage: 'https://picsum.photos/seed/thisisfine-fire/800/600?blur=2'
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
        flavorLose: '予想通り全滅した。',
        catchphrase: 'LEEEEROY JENKINS!!!',
        lore: 'WoWのレイド動画で生まれた伝説。綿密な作戦中に一人突撃して全滅させたプレイヤー。計画性のなさと勇気（無謀さ）の代名詞。',
        signatureMove: '無謀突撃',
        personality: {
            attackLine: 'LEEROY JENKINS!!!',
            feintLine: 'おっと計画変更',
            chargeLine: '少なくとも鶏肉はある...'
        },
        uniqueTrait: {
            name: '突撃',
            description: '攻撃力+10だが被ダメージ+15%',
            type: 'high_risk'
        },
        themeColor: '#dc143c',
        themeImage: 'https://picsum.photos/seed/leeroy-charge/800/600?blur=2'
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
        flavorLose: 'so defeat. very sad. wow.',
        catchphrase: 'wow. such meme. very summon.',
        lore: '柴犬カボスの写真から生まれた、破綻した英語と内心モノローグのミーム。シンプルな可愛さと汎用性で暗号通貨のマスコットにもなった。',
        signatureMove: 'such attack',
        personality: {
            attackLine: 'much attack. wow.',
            feintLine: 'such dodge. very clever.',
            chargeLine: 'so prepare. very strategy.'
        },
        uniqueTrait: {
            name: 'such wow',
            description: 'ターン終了時15%でHP+5 or 鮮度+5',
            type: 'random_bonus'
        },
        themeColor: '#ffa500',
        themeImage: 'https://picsum.photos/seed/doge-shiba/800/600?blur=2'
    },

    yaruo: {
        id: 'yaruo',
        name: 'やる夫',
        displayName: 'やる夫',
        avatar: '😊',
        description: 'AAキャラクターの代表格',
        tags: ['AA', '古典', '万能'],
        basePower: 20,
        baseHP: 100,
        flavorWin: 'やったお！完全勝利だお！',
        flavorLose: 'やる夫は負けたお...',
        catchphrase: 'やるお！',
        lore: '2chのAA文化を代表するキャラクター。シンプルな顔文字から無限の物語が生まれ、スレ文化を牽引した。',
        signatureMove: 'やる夫パンチ',
        personality: {
            attackLine: 'いくお！',
            feintLine: 'かわしたお！',
            chargeLine: 'ためてるお...'
        },
        uniqueTrait: {
            name: 'AA力',
            description: 'AAタグの戦場で攻撃力+15%',
            type: 'battlefield_bonus',
            targetTag: 'AA'
        },
        themeColor: '#ffeb3b',
        themeImage: 'https://picsum.photos/seed/yaruo-happy/800/600?blur=2'
    },

    giko: {
        id: 'giko',
        name: 'ギコ猫',
        displayName: 'ギコ猫',
        avatar: '🐱',
        description: '2ch黎明期からのマスコット',
        tags: ['古典', 'AA', '動物'],
        basePower: 21,
        baseHP: 95,
        flavorWin: 'ギコギコ♪ 勝ったぞ！',
        flavorLose: 'ギコ...無念...',
        catchphrase: 'ギコギコ（ﾟДﾟ）',
        lore: '2ch創成期を支えたAAキャラクター。モナーと並ぶマスコット的存在として、掲示板文化の象徴となった。',
        signatureMove: 'ギコキック',
        personality: {
            attackLine: 'ギコ！',
            feintLine: 'ギコギコ～',
            chargeLine: 'ギコ...'
        },
        uniqueTrait: {
            name: '古参',
            description: '古典タグの戦場で鮮度減衰-3/ターン',
            type: 'battlefield_bonus',
            targetTag: '古典'
        },
        themeColor: '#795548',
        themeImage: 'https://picsum.photos/seed/giko-cat/800/600?blur=2'
    },

    keyboard: {
        id: 'keyboard',
        name: 'キーボードクラッシャー',
        displayName: 'キーボードクラッシャー',
        avatar: '⌨️',
        description: '激怒動画の伝説',
        tags: ['海外', '圧倒', 'ネタ'],
        basePower: 32,
        baseHP: 85,
        flavorWin: 'UNREAL!!! 完全勝利！！！',
        flavorLose: 'キーボードが壊れた...',
        catchphrase: 'UNREAL TOURNAMENT!!!',
        lore: 'ゲームで負けてキーボードを破壊する少年の動画。怒りの表現として世界中でネタにされ、MAD素材の定番となった。',
        signatureMove: 'キーボードスマッシュ',
        personality: {
            attackLine: 'AHHHHHHH!!!',
            feintLine: 'NEIN NEIN NEIN!',
            chargeLine: 'Unreal...'
        },
        uniqueTrait: {
            name: '激怒',
            description: 'HP50%以下で攻撃力+50%',
            type: 'rage_mode'
        },
        themeColor: '#b71c1c',
        themeImage: 'https://picsum.photos/seed/keyboard-rage/800/600?blur=2'
    },

    nyancat: {
        id: 'nyancat',
        name: 'Nyan Cat',
        displayName: 'Nyan Cat',
        avatar: '🌈',
        description: '虹を纏う8bit猫',
        tags: ['音楽', '海外', '動物'],
        basePower: 19,
        baseHP: 90,
        flavorWin: 'Nyan nyan nyan~ 勝利！',
        flavorLose: 'にゃーん...',
        catchphrase: 'Nyan nyan nyan nyan~',
        lore: '8bitの猫が虹の軌跡を残しながら飛ぶ映像と、エンドレスなニャーンソング。シンプルな中毒性で世界中に拡散された。',
        signatureMove: 'レインボートレイル',
        personality: {
            attackLine: 'Nyan!',
            feintLine: 'Nyan nyan~',
            chargeLine: 'Nya...'
        },
        uniqueTrait: {
            name: '虹の軌跡',
            description: '移動するたびに鮮度+2回復',
            type: 'movement_heal'
        },
        themeColor: '#ff69b4',
        themeImage: 'https://picsum.photos/seed/nyancat-rainbow/800/600?blur=2'
    },

    warota: {
        id: 'warota',
        name: 'ワロタ',
        displayName: 'ワロタ',
        avatar: '😂',
        description: '2ch笑いの基本形',
        tags: ['語録', '古典', 'ネタ'],
        basePower: 18,
        baseHP: 95,
        flavorWin: 'ワロタwwwww 勝ったwww',
        flavorLose: 'ワロエナイ...',
        catchphrase: 'ワロタwwwwwww',
        lore: '「笑った」を短縮した2ch用語。草（w）とともに笑いを表現する基本形として定着。バリエーション無限。',
        signatureMove: '草生やし',
        personality: {
            attackLine: 'ワロタwww',
            feintLine: 'ワロスww',
            chargeLine: 'ワロ...'
        },
        uniqueTrait: {
            name: '草',
            description: '攻撃命中時、敵の鮮度-5（笑いで動揺）',
            type: 'laugh_debuff'
        },
        themeColor: '#4caf50',
        themeImage: 'https://picsum.photos/seed/warota-laugh/800/600?blur=2'
    },

    amongus: {
        id: 'amongus',
        name: 'Among Us',
        displayName: 'Among Us',
        avatar: '🔴',
        description: 'sus... 疑惑のゲーム',
        tags: ['ゲーム', '海外', '不意打ち'],
        basePower: 24,
        baseHP: 90,
        flavorWin: 'I was not the impostor. 勝利！',
        flavorLose: 'ejected...',
        catchphrase: 'Red is sus.',
        lore: '宇宙船で裏切り者を探すゲームが、「sus」という言葉とともに世界的ミームに。シンプルなキャラが無限のネタを生んだ。',
        signatureMove: 'vent kill',
        personality: {
            attackLine: 'sus!',
            feintLine: 'I saw you vent!',
            chargeLine: 'emergency meeting...'
        },
        uniqueTrait: {
            name: 'impostor',
            description: 'フェイント使用時、25%で攻撃に変化',
            type: 'impostor_fake'
        },
        themeColor: '#ff0000',
        themeImage: 'https://picsum.photos/seed/amongus-space/800/600?blur=2'
    },

    pepe: {
        id: 'pepe',
        name: 'カエル絵文字',
        displayName: 'カエル絵文字',
        avatar: '🐸',
        description: 'feels good man',
        tags: ['海外', '哲学', '万能'],
        basePower: 22,
        baseHP: 100,
        flavorWin: 'feels good man',
        flavorLose: 'feels bad man...',
        catchphrase: 'feels good man',
        lore: 'カエルの感情表現ミームとして無数のバリエーションを生んだ。悲しみから喜びまで、あらゆる感情を代弁する存在。',
        signatureMove: 'rare pepe',
        personality: {
            attackLine: 'reeeee!',
            feintLine: 'smug',
            chargeLine: 'thinking...'
        },
        uniqueTrait: {
            name: 'rare',
            description: '毎ターン10%で完全回避',
            type: 'rare_dodge'
        },
        themeColor: '#8bc34a',
        themeImage: 'https://picsum.photos/seed/pepe-frog/800/600?blur=2'
    },

    brain: {
        id: 'brain',
        name: 'Galaxy Brain',
        displayName: 'Galaxy Brain',
        avatar: '🧠',
        description: '拡張する脳ミーム',
        tags: ['海外', '哲学', 'ネタ'],
        basePower: 27,
        baseHP: 80,
        flavorWin: 'ascended 勝利',
        flavorLose: 'smooth brain...',
        catchphrase: 'galaxy brain moment',
        lore: '段階的に拡大する脳で知性レベルを表現するミーム。最終形態は宇宙レベル。皮肉と真面目の境界を曖昧にする。',
        signatureMove: '次元上昇',
        personality: {
            attackLine: 'big brain!',
            feintLine: '200 IQ play',
            chargeLine: 'transcending...'
        },
        uniqueTrait: {
            name: 'ascended',
            description: 'チャージ3回で攻撃力2倍',
            type: 'ascension'
        },
        themeColor: '#9c27b0',
        themeImage: 'https://picsum.photos/seed/brain-galaxy/800/600?blur=2'
    },

    stonks: {
        id: 'stonks',
        name: 'Stonks',
        displayName: 'Stonks',
        avatar: '📈',
        description: 'meme economy',
        tags: ['海外', 'ネタ', '万能'],
        basePower: 25,
        baseHP: 95,
        flavorWin: 'STONKS↗️',
        flavorLose: 'not stonks↘️',
        catchphrase: 'STONKS',
        lore: '株価チャートと謎のスーツ男で投資ネタを表現。わざと間違えた「stonks」表記が特徴。ミーム経済の象徴。',
        signatureMove: '爆上げ',
        personality: {
            attackLine: 'stonks!',
            feintLine: 'buy the dip',
            chargeLine: 'hodl...'
        },
        uniqueTrait: {
            name: 'volatile',
            description: 'ダメージが±30%でランダム変動',
            type: 'stonks_random'
        },
        themeColor: '#00bcd4',
        themeImage: 'https://picsum.photos/seed/stonks-market/800/600?blur=2'
    },

    ratio: {
        id: 'ratio',
        name: 'Ratio',
        displayName: 'Ratio',
        avatar: '💬',
        description: 'Twitter文化の煽り',
        tags: ['海外', '即応', '圧倒'],
        basePower: 20,
        baseHP: 85,
        flavorWin: 'ratio + L + cope',
        flavorLose: 'got ratiod...',
        catchphrase: 'ratio',
        lore: 'リプライが元ツイートよりバズること。SNS文化特有の煽りとして定着。「L」「cope」などの追撃も定番。',
        signatureMove: 'ratio combo',
        personality: {
            attackLine: 'ratio',
            feintLine: 'L + ratio',
            chargeLine: 'based'
        },
        uniqueTrait: {
            name: 'ratio',
            description: '敵の攻撃後、反撃ダメージ+10',
            type: 'ratio_counter'
        },
        themeColor: '#1da1f2',
        themeImage: 'https://picsum.photos/seed/ratio-twitter/800/600?blur=2'
    },

    chipmunk: {
        id: 'chipmunk',
        name: 'Dramatic動物',
        displayName: 'Dramatic動物',
        avatar: '🐿️',
        description: '劇的な振り向き',
        tags: ['動物', '海外', 'ネタ'],
        basePower: 23,
        baseHP: 90,
        flavorWin: '劇的勝利！',
        flavorLose: '劇的敗北...',
        catchphrase: '*dramatic music*',
        lore: '振り向きと同時に流れる劇的な音楽。5秒の映像が無限のリアクション素材として使われ続ける。',
        signatureMove: 'dramatic turn',
        personality: {
            attackLine: '*dramatic sound*',
            feintLine: '*gasp*',
            chargeLine: '*suspense*'
        },
        uniqueTrait: {
            name: 'dramatic',
            description: '攻撃時50%でクリティカル判定',
            type: 'dramatic_crit'
        },
        themeColor: '#ff9800',
        themeImage: 'https://picsum.photos/seed/chipmunk-drama/800/600?blur=2'
    }
};

// タグプール
const ALL_TAGS = ['古典', 'AA', '語録', '圧倒', '突撃', '即応', 'ネタ', '空耳', '不気味', 
                  '海外', '音楽', 'ゲーム', '哲学', '現実逃避', '連携', '武術', '音MAD', '動物', '万能'];

// ネットイベントプール
const NET_EVENTS = [
    { id: 'thread_flow', name: 'スレが流れた', effect: 'freshness_down', value: 8, prob: 0.15, message: '💨 スレが流れた！両者の鮮度-8！' },
    { id: 'troll', name: '荒らし乱入', effect: 'random_damage', value: 15, prob: 0.12, message: '👹 荒らしが乱入！ランダムで15ダメージ！' },
    { id: 'bait', name: '釣りだった', effect: 'hp_swap', value: 0, prob: 0.08, message: '🎣 釣りだった！HP差が縮まる！' },
    { id: 'warota_chain', name: 'ワロタ連鎖', effect: 'both_heal', value: 10, prob: 0.15, message: '😂 ワロタ連鎖！両者HP+10回復！www' },
    { id: 'nullpo_gat', name: 'ぬるぽ→ガッ', effect: 'quick_damage', value: 12, prob: 0.10, message: '💥 ぬるぽ→ガッ！即座に12ダメージ！' },
    { id: 'rickroll', name: '釣りリンク', effect: 'confusion', value: 0, prob: 0.10, message: '🎵 ♪Never gonna give you up... 次ターン混乱！' },
    { id: 'server_down', name: '鯖落ち', effect: 'skip_turn', value: 0, prob: 0.08, message: '💀 鯖落ち！このターンスキップ！' },
    { id: 'aa_broken', name: 'AA崩壊', effect: 'freshness_chaos', value: 15, prob: 0.10, message: '📝 AA崩壊！鮮度大混乱！' },
    { id: 'ratio', name: 'ratio喰らった', effect: 'debuff', value: 5, prob: 0.12, message: '💬 ratio喰らった！次ターン攻撃力-5！L + cope' },
    { id: 'based', name: 'based認定', effect: 'buff', value: 10, prob: 0.12, message: '😎 based認定された！次ターン攻撃力+10！' },
    { id: 'skill_issue', name: 'skill issue', effect: 'mock', value: 0, prob: 0.10, message: '🤷 skill issue指摘！気にするな（鮮度-5）' },
    { id: 'ping_death', name: 'ping999ms', effect: 'slow', value: 0, prob: 0.08, message: '🌐 ping999ms！動きが鈍い！次ターンダメージ半減' }
];

// 配信風アイテム
const STREAM_ITEMS = [
    { id: 'superchat', name: 'スパチャ風投げ銭', effect: 'hp_heal', value: 20, emoji: '💵', message: 'スパチャきた！HP+20回復！' },
    { id: 'amagift', name: 'あまぎふ風', effect: 'power_boost', value: 15, emoji: '🎁', message: 'あまぎふ投下！次の攻撃+15！' },
    { id: 'hakushu', name: '拍手〇風', effect: 'freshness_boost', value: 20, emoji: '👏', message: '拍手の嵐！鮮度+20回復！' },
    { id: 'stamp', name: 'スタンプ連打', effect: 'confusion_enemy', value: 0, emoji: '🎭', message: 'スタンプ連打！敵が混乱！' }
];

// 戦場名生成用の語彙
const BATTLEFIELD_ADJECTIVES = [
    '荒廃した', '光り輝く', '混沌の', '静寂の', '熱狂の', '禁断の',
    '失われた', '呪われた', '祝福された', '歪んだ', '幻想的な', '電脳の',
    '古代の', '未来の', '崩壊した', '再生の', '煌めく', '暗黒の'
];

const BATTLEFIELD_NOUNS = [
    '闘技場', '広場', '次元', '回廊', '空間', '会場',
    '戦場', 'ドメイン', 'ゾーン', 'エリア', 'フィールド', 'ステージ',
    '神殿', '遺跡', '要塞', 'サーバー', 'スレッド', 'タイムライン'
];

const BATTLEFIELD_DESCRIPTIONS = [
    'があなたを待ち受ける',
    'に響くミームの残響',
    'で繰り広げられる儀式',
    'に集う者たちの記憶',
    'を支配する不思議な力',
    'から立ち上る熱気',
    'に刻まれた歴史の痕跡',
    'を漂う懐かしい空気'
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

// 戦場テーマ画像のシード
const BATTLEFIELD_IMAGE_SEEDS = [
    'ancient-ruins', 'cyber-space', 'mystic-forest', 'volcanic-arena',
    'crystal-cave', 'digital-void', 'neon-city', 'astral-plane',
    'frozen-wasteland', 'sacred-temple', 'chaos-realm', 'zen-garden',
    'thunderstorm', 'deep-ocean', 'star-nebula', 'haunted-mansion'
];

// ランダムな戦場を生成
function generateRandomBattlefield() {
    // ランダムな名前生成
    const adjective = BATTLEFIELD_ADJECTIVES[Math.floor(Math.random() * BATTLEFIELD_ADJECTIVES.length)];
    const noun = BATTLEFIELD_NOUNS[Math.floor(Math.random() * BATTLEFIELD_NOUNS.length)];
    const desc = BATTLEFIELD_DESCRIPTIONS[Math.floor(Math.random() * BATTLEFIELD_DESCRIPTIONS.length)];
    
    const name = `${adjective}${noun}`;
    const description = `${name}${desc}`;
    
    // ランダムに2〜4個のタグを選択
    const tagCount = 2 + Math.floor(Math.random() * 3); // 2, 3, or 4
    const shuffled = [...ALL_TAGS].sort(() => Math.random() - 0.5);
    const tags = shuffled.slice(0, tagCount);
    
    // 戦場背景画像（Picsum）
    const imageSeed = BATTLEFIELD_IMAGE_SEEDS[Math.floor(Math.random() * BATTLEFIELD_IMAGE_SEEDS.length)];
    const backgroundImage = `https://picsum.photos/seed/${imageSeed}/1200/800?blur=3`;
    
    return {
        id: 'generated_' + Date.now(),
        name: name,
        description: description,
        tags: tags,
        backgroundImage: backgroundImage
    };
}
