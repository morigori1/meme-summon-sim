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
    },

    kumikyoku: {
        id: 'kumikyoku',
        name: '組曲',
        displayName: '組曲『ニコニコ動画』',
        avatar: '🎼',
        description: 'メドレー文化の金字塔',
        tags: ['音MAD', '音楽', '連携'],
        basePower: 26,
        baseHP: 95,
        flavorWin: '全パート完走！勝利のメドレー！',
        flavorLose: 'メドレーが途切れた...',
        catchphrase: '七色のニコニコ動画～♪',
        lore: 'ニコニコ動画の人気曲をメドレーにした文化現象。初音ミクから東方まで、ネット文化の総決算として君臨した。',
        signatureMove: 'メドレーアタック',
        personality: {
            attackLine: '次いくよー',
            feintLine: '間奏中',
            chargeLine: 'イントロ...'
        },
        uniqueTrait: {
            name: '連携',
            description: '連携タグの戦場で全能力+20%',
            type: 'battlefield_bonus',
            targetTag: '連携'
        },
        themeColor: '#ff6699',
        themeImage: 'https://picsum.photos/seed/kumikyoku-medley/800/600?blur=2'
    },

    owata: {
        id: 'owata',
        name: 'オワタ式',
        displayName: 'オワタ＼(^o^)／',
        avatar: '🙌',
        description: '人生オワタの大冒険',
        tags: ['AA', 'ゲーム', 'ネタ'],
        basePower: 24,
        baseHP: 80,
        flavorWin: 'オワタと思ったら勝った！',
        flavorLose: '人生オワタ＼(^o^)／',
        catchphrase: '＼(^o^)／オワタ',
        lore: 'マリオ改造ゲームから生まれた絶望系AA。理不尽な難易度と諦めの美学を体現し、挑戦する者を魅了した。',
        signatureMove: 'オワタ式ジャンプ',
        personality: {
            attackLine: '＼(^o^)／',
            feintLine: 'オワタ？',
            chargeLine: 'オワ...'
        },
        uniqueTrait: {
            name: '起死回生',
            description: 'HP20%以下で攻撃力+100%',
            type: 'desperate'
        },
        themeColor: '#607d8b',
        themeImage: 'https://picsum.photos/seed/owata-despair/800/600?grayscale&blur=2'
    },

    woman_cat: {
        id: 'woman_cat',
        name: '指さし論争',
        displayName: '指さし論争',
        avatar: '👈',
        description: '女性と猫の対峙',
        tags: ['海外', 'ネタ', '万能'],
        basePower: 21,
        baseHP: 90,
        flavorWin: '論破完了！',
        flavorLose: '言い返せなかった...',
        catchphrase: '*points finger*',
        lore: '女性が指をさして叫ぶ画像と、混乱した猫の組み合わせ。無限のキャプション素材として世界中で使われる。',
        signatureMove: '論点ずらし',
        personality: {
            attackLine: '*指さし*',
            feintLine: '*困惑*',
            chargeLine: '*準備中*'
        },
        uniqueTrait: {
            name: '論破',
            description: 'フェイント後の攻撃が+50%',
            type: 'debate_combo'
        },
        themeColor: '#e91e63',
        themeImage: 'https://picsum.photos/seed/woman-cat-argue/800/600?blur=2'
    },

    coffin: {
        id: 'coffin',
        name: 'Coffin Dance',
        displayName: 'Coffin Dance',
        avatar: '⚰️',
        description: '陽気な葬式ダンス',
        tags: ['音楽', '海外', 'ネタ'],
        basePower: 28,
        baseHP: 85,
        flavorWin: 'Astronomia♪ 勝利の舞！',
        flavorLose: '棺桶に入れられた...',
        catchphrase: '*coffin dance music*',
        lore: 'ガーナの葬式で棺を担いで踊る映像。失敗シーンの締めBGMとして世界的に流行し、あらゆる場面で使われた。',
        signatureMove: '葬送ダンス',
        personality: {
            attackLine: '*dance*',
            feintLine: '*dodge*',
            chargeLine: '*準備*'
        },
        uniqueTrait: {
            name: '葬送',
            description: '敵HP50%以下で攻撃力+40%',
            type: 'finisher'
        },
        themeColor: '#9c27b0',
        themeImage: 'https://picsum.photos/seed/coffin-dance/800/600?blur=2'
    },

    wojak: {
        id: 'wojak',
        name: 'Feels顔',
        displayName: 'Feels顔',
        avatar: '😢',
        description: '感情の化身',
        tags: ['海外', '哲学', 'AA'],
        basePower: 19,
        baseHP: 100,
        flavorWin: 'I know that feel bro',
        flavorLose: 'tfw you lose...',
        catchphrase: 'I know that feel',
        lore: 'シンプルな悲しい顔のAAから、無数のバリエーションを生んだ感情表現ミーム。喜怒哀楽すべてを表現する。',
        signatureMove: 'feels attack',
        personality: {
            attackLine: 'feels bad',
            feintLine: 'tfw',
            chargeLine: 'that feel when...'
        },
        uniqueTrait: {
            name: '共感',
            description: '敵が鮮度50%以下の時、ダメージ+30%',
            type: 'empathy_damage'
        },
        themeColor: '#9e9e9e',
        themeImage: 'https://picsum.photos/seed/wojak-feels/800/600?grayscale&blur=3'
    },

    success_kid: {
        id: 'success_kid',
        name: '成功キッズ',
        displayName: '成功キッズ',
        avatar: '👶',
        description: 'ガッツポーズの赤ちゃん',
        tags: ['海外', '万能', 'ネタ'],
        basePower: 22,
        baseHP: 95,
        flavorWin: 'Success! ガッツポーズ！',
        flavorLose: 'not success...',
        catchphrase: '*fist pump*',
        lore: 'ビーチで砂を握りしめてガッツポーズする赤ちゃん。成功体験や小さな勝利を祝う定番ミームとして定着。',
        signatureMove: 'ガッツポーズ',
        personality: {
            attackLine: 'yes!',
            feintLine: 'nailed it',
            chargeLine: 'gonna do it...'
        },
        uniqueTrait: {
            name: '成功体験',
            description: '攻撃成功時、次ターン攻撃力+8',
            type: 'success_buff'
        },
        themeColor: '#ffeb3b',
        themeImage: 'https://picsum.photos/seed/success-kid/800/600?blur=2'
    },

    distracted: {
        id: 'distracted',
        name: '気が散る構図',
        displayName: '気が散る構図',
        avatar: '👀',
        description: '三角関係の視線',
        tags: ['海外', 'ネタ', '万能'],
        basePower: 20,
        baseHP: 90,
        flavorWin: '本命で勝利！',
        flavorLose: '浮気心が災いした...',
        catchphrase: '*looks away*',
        lore: '彼女がいるのに他の女性を見る男性の写真。選択と誘惑のメタファーとして、あらゆる比較ネタで使われる。',
        signatureMove: '二股攻撃',
        personality: {
            attackLine: '*glance*',
            feintLine: '*look away*',
            chargeLine: '*torn*'
        },
        uniqueTrait: {
            name: '二択',
            description: 'ランダムで攻撃対象切り替え（味方含む）',
            type: 'random_target'
        },
        themeColor: '#03a9f4',
        themeImage: 'https://picsum.photos/seed/distracted-boyfriend/800/600?blur=2'
    },

    knuckles: {
        id: 'knuckles',
        name: 'ソニックファン',
        displayName: 'ソニックファン',
        avatar: '🦔',
        description: 'VRChat発のミーム',
        tags: ['ゲーム', '海外', 'ネタ'],
        basePower: 25,
        baseHP: 85,
        flavorWin: 'Do you know the way to victory!',
        flavorLose: 'Lost the way...',
        catchphrase: 'Do you know the way?',
        lore: 'VRChatでハリネズミキャラが集団行動するミーム。独特の口調と行動パターンで一世を風靡した。',
        signatureMove: 'クリック音連打',
        personality: {
            attackLine: 'click click click',
            feintLine: 'spit on him',
            chargeLine: 'show me da way...'
        },
        uniqueTrait: {
            name: '群れ',
            description: '攻撃時25%で2回攻撃',
            type: 'swarm'
        },
        themeColor: '#f44336',
        themeImage: 'https://picsum.photos/seed/knuckles-sonic/800/600?blur=2'
    },

    npc: {
        id: 'npc',
        name: 'NPC顔',
        displayName: 'NPC顔',
        avatar: '🤖',
        description: 'グレイフェイス',
        tags: ['海外', 'ネタ', '不気味'],
        basePower: 18,
        baseHP: 100,
        flavorWin: '*automatic response* victory',
        flavorLose: '*shutdown*',
        catchphrase: '*NPC dialogue*',
        lore: '感情のない無表情な顔。考えない人間をNPCに例える皮肉なミームとして使われ、議論を呼んだ。',
        signatureMove: 'テンプレ応答',
        personality: {
            attackLine: '*beep boop*',
            feintLine: '*scripted response*',
            chargeLine: '*loading*'
        },
        uniqueTrait: {
            name: 'プログラム',
            description: '同じコマンドを3回繰り返すと威力2倍',
            type: 'pattern'
        },
        themeColor: '#9e9e9e',
        themeImage: 'https://picsum.photos/seed/npc-gray/800/600?grayscale&blur=3'
    },

    yaruo: {
        id: 'yaruo',
        name: 'やる夫',
        displayName: 'やる夫',
        avatar: '( ´∀｀)',
        description: '無敵の主人公',
        tags: ['AA', 'ネタ', '万能'],
        basePower: 27,
        baseHP: 110,
        flavorWin: 'やる夫は勝ったお！',
        flavorLose: 'やる夫は負けたお...',
        catchphrase: 'やるお！',
        lore: '2chを代表するAA主人公。無数のスレで様々な役を演じ、最も汎用性の高いキャラとして君臨した。',
        signatureMove: 'やる夫スマッシュ',
        personality: {
            attackLine: 'いくお！',
            feintLine: 'かわすお！',
            chargeLine: 'ためるお...'
        },
        uniqueTrait: {
            name: '主人公補正',
            description: 'HP50%以下で全能力+25%',
            type: 'protagonist'
        },
        themeColor: '#ffdd57',
        themeImage: 'https://picsum.photos/seed/yaruo-hero/800/600?blur=2'
    },

    mona: {
        id: 'mona',
        name: 'モナー',
        displayName: 'モナー',
        avatar: '( ´∀｀)',
        description: '2chの象徴',
        tags: ['AA', '伝説', '古参'],
        basePower: 25,
        baseHP: 105,
        flavorWin: 'モララー！勝利だモナ',
        flavorLose: 'オマエモナー...',
        catchphrase: 'モナー',
        lore: '2ch黎明期から存在するマスコット的存在。のまネコ騒動など、数々の事件を経験してきた生き証人。',
        signatureMove: 'モナーアタック',
        personality: {
            attackLine: 'モナ！',
            feintLine: 'モナー？',
            chargeLine: 'モナ...'
        },
        uniqueTrait: {
            name: 'レジェンド',
            description: '古参タグの戦場で攻撃力+30%',
            type: 'battlefield_bonus',
            targetTag: '古参'
        },
        themeColor: '#ff9800',
        themeImage: 'https://picsum.photos/seed/mona-legend/800/600?blur=2'
    },

    matome: {
        id: 'matome',
        name: 'まとめブログ',
        displayName: 'まとめブログ',
        avatar: '📰',
        description: '情報拡散の起点',
        tags: ['ネタ', 'メタ', '万能'],
        basePower: 20,
        baseHP: 95,
        flavorWin: 'まとめで拡散！大勝利！',
        flavorLose: 'まとめられなかった...',
        catchphrase: '【速報】',
        lore: '2chのスレをまとめて拡散する文化。ミームの伝播速度を飛躍的に高め、ネット文化の形を変えた。',
        signatureMove: 'まとめ拡散',
        personality: {
            attackLine: '【朗報】',
            feintLine: '【悲報】',
            chargeLine: '【速報】'
        },
        uniqueTrait: {
            name: '拡散',
            description: 'ダメージを与えると敵の鮮度も-5',
            type: 'spread'
        },
        themeColor: '#2196f3',
        themeImage: 'https://picsum.photos/seed/matome-blog/800/600?blur=2'
    },

    inmu: {
        id: 'inmu',
        name: '淫夢語録',
        displayName: '淫夢語録',
        avatar: '💬',
        description: '汎用性の暴力',
        tags: ['ネタ', '万能', 'メタ'],
        basePower: 26,
        baseHP: 90,
        flavorWin: '勝ちましたわ（勝利）',
        flavorLose: 'あっ...（察し）',
        catchphrase: 'あのさぁ...',
        lore: '野獣先輩から派生した語録群。あらゆる場面で使える汎用性と、独特のリズムでネット全域に浸透した。',
        signatureMove: '語録返し',
        personality: {
            attackLine: 'いいよ、来いよ！',
            feintLine: 'ちょっと待って！',
            chargeLine: 'んっ...'
        },
        uniqueTrait: {
            name: '汎用性',
            description: 'すべてのコマンドで+10%ダメージ',
            type: 'versatile'
        },
        themeColor: '#ff5722',
        themeImage: 'https://picsum.photos/seed/inmu-quotes/800/600?blur=3'
    },

    kusanagi: {
        id: 'kusanagi',
        name: 'ネット草原',
        displayName: 'ネット草原',
        avatar: '🌿',
        description: 'wwwwwww',
        tags: ['ネタ', '万能', 'メタ'],
        basePower: 15,
        baseHP: 120,
        flavorWin: 'wwwwwwwwww勝ったwwww',
        flavorLose: 'wwww（涙目）',
        catchphrase: 'wwwwwwwwww',
        lore: '(笑)→w→草→草不可避。笑いを表現する記号が進化を遂げ、ついには草原と呼ばれるようになった。',
        signatureMove: '大草原不可避',
        personality: {
            attackLine: 'wwwwww',
            feintLine: 'www',
            chargeLine: 'w'
        },
        uniqueTrait: {
            name: '草生える',
            description: '攻撃を受けると10%でHP+5回復',
            type: 'grass_heal'
        },
        themeColor: '#4caf50',
        themeImage: 'https://picsum.photos/seed/grass-field/800/600?blur=2'
    },

    harlem: {
        id: 'harlem',
        name: 'Harlem Shake',
        displayName: 'Harlem Shake',
        avatar: '🕺',
        description: '突然の狂乱',
        tags: ['海外', '音楽', 'ネタ'],
        basePower: 29,
        baseHP: 85,
        flavorWin: '*bass drop* VICTORY!',
        flavorLose: '*dance interrupted*',
        catchphrase: 'Do the Harlem Shake!',
        lore: '突然のベースドロップとともに全員が踊り狂う。2013年に世界中で爆発的に流行し、無数の動画が投稿された。',
        signatureMove: 'Bass Drop',
        personality: {
            attackLine: '*dance*',
            feintLine: '*shake*',
            chargeLine: '*準備中*'
        },
        uniqueTrait: {
            name: '狂乱',
            description: 'ターン開始時15%で全体HP-5',
            type: 'chaos_aura'
        },
        themeColor: '#ff6f00',
        themeImage: 'https://picsum.photos/seed/harlem-shake/800/600?blur=2'
    },

    trollface: {
        id: 'trollface',
        name: 'Troll Face',
        displayName: 'Troll Face',
        avatar: '😈',
        description: '荒らしの化身',
        tags: ['海外', 'ネタ', '不気味'],
        basePower: 24,
        baseHP: 100,
        flavorWin: 'Problem? U mad bro?',
        flavorLose: 'You got trolled...',
        catchphrase: 'Problem?',
        lore: 'MSペイントで描かれた不気味な笑顔。荒らし行為やイタズラを象徴するミームとして定着した。',
        signatureMove: 'トローリング',
        personality: {
            attackLine: 'U mad?',
            feintLine: 'Problem?',
            chargeLine: 'Umad...'
        },
        uniqueTrait: {
            name: 'トロール',
            description: '敵の攻撃を15%で無効化',
            type: 'troll_dodge'
        },
        themeColor: '#9e9e9e',
        themeImage: 'https://picsum.photos/seed/troll-face/800/600?grayscale&blur=2'
    },

    forever_alone: {
        id: 'forever_alone',
        name: 'Forever Alone',
        displayName: 'Forever Alone',
        avatar: '😭',
        description: '孤独の権化',
        tags: ['海外', 'ネタ', '哲学'],
        basePower: 16,
        baseHP: 130,
        flavorWin: 'Not alone anymore!',
        flavorLose: 'Forever alone...',
        catchphrase: 'Forever alone...',
        lore: '孤独を表現するシンプルな顔。一人でいる寂しさや虚しさを象徴し、多くの共感を集めた。',
        signatureMove: '孤独の力',
        personality: {
            attackLine: 'alone...',
            feintLine: 'lonely...',
            chargeLine: 'nobody...'
        },
        uniqueTrait: {
            name: '孤独',
            description: '残りHP1でも必ず1ターン生き残る',
            type: 'endure'
        },
        themeColor: '#607d8b',
        themeImage: 'https://picsum.photos/seed/forever-alone/800/600?grayscale&blur=3'
    },

    yuno: {
        id: 'yuno',
        name: 'Y U No',
        displayName: 'Y U No',
        avatar: '😠',
        description: '怒りの疑問符',
        tags: ['海外', 'ネタ', '万能'],
        basePower: 22,
        baseHP: 95,
        flavorWin: 'Y U NO LOSE!?',
        flavorLose: 'Y U NO WIN...',
        catchphrase: 'Y U NO...!?',
        lore: '怒った顔で「なぜ〜しないんだ！？」と問い詰める。あらゆる不満や疑問を表現できる汎用性の高さが魅力。',
        signatureMove: '問い詰め',
        personality: {
            attackLine: 'Y U NO DIE!?',
            feintLine: 'Y U NO STOP!?',
            chargeLine: 'Y U NO...'
        },
        uniqueTrait: {
            name: '問い詰め',
            description: '敵が回避すると次ターン攻撃+15',
            type: 'rage_stack'
        },
        themeColor: '#f44336',
        themeImage: 'https://picsum.photos/seed/y-u-no/800/600?blur=2'
    },

    harold: {
        id: 'harold',
        name: 'Hide the Pain',
        displayName: 'Hide the Pain Harold',
        avatar: '😅',
        description: '痛みを隠す笑顔',
        tags: ['海外', 'ネタ', '哲学'],
        basePower: 21,
        baseHP: 105,
        flavorWin: '*smiles through pain* Victory!',
        flavorLose: '*pain intensifies*',
        catchphrase: '*smiles nervously*',
        lore: 'ストックフォトのおじさんの無理な笑顔。辛いことがあっても笑顔でいる社会人の心情を代弁した。',
        signatureMove: '強がり',
        personality: {
            attackLine: '*smiles*',
            feintLine: '*nervous laugh*',
            chargeLine: '*hides pain*'
        },
        uniqueTrait: {
            name: '痛み隠し',
            description: '被ダメージの25%を次ターン攻撃に転換',
            type: 'pain_convert'
        },
        themeColor: '#ff9800',
        themeImage: 'https://picsum.photos/seed/harold-pain/800/600?blur=2'
    }
};

// タグプール
const ALL_TAGS = ['古典', 'AA', '語録', '圧倒', '突撃', '即応', 'ネタ', '空耳', '不気味', 
                  '海外', '音楽', 'ゲーム', '哲学', '現実逃避', '連携', '武術', '音MAD', '動物', '万能'];

// ネットイベントプール
const NET_EVENTS = [
    { id: 'thread_flow', name: 'スレが流れた', effect: 'freshness_down', value: 8, prob: 0.15, message: '💨 スレが流れた！両者の鮮度-8！', chain: 'dat_fall' },
    { id: 'troll', name: '荒らし乱入', effect: 'random_damage', value: 15, prob: 0.12, message: '👹 荒らしが乱入！ランダムで15ダメージ！', chain: 'server_down' },
    { id: 'bait', name: '釣りだった', effect: 'hp_swap', value: 0, prob: 0.08, message: '🎣 釣りだった！HP差が縮まる！', chain: 'rickroll' },
    { id: 'warota_chain', name: 'ワロタ連鎖', effect: 'both_heal', value: 10, prob: 0.15, message: '😂 ワロタ連鎖！両者HP+10回復！www', chain: 'grass_grow' },
    { id: 'nullpo_gat', name: 'ぬるぽ→ガッ', effect: 'quick_damage', value: 12, prob: 0.10, message: '💥 ぬるぽ→ガッ！即座に12ダメージ！', chain: null },
    { id: 'rickroll', name: '釣りリンク', effect: 'confusion', value: 0, prob: 0.10, message: '🎵 ♪Never gonna give you up... 次ターン混乱！', chain: null },
    { id: 'server_down', name: '鯖落ち', effect: 'skip_turn', value: 0, prob: 0.08, message: '💀 鯖落ち！このターンスキップ！', chain: null },
    { id: 'aa_broken', name: 'AA崩壊', effect: 'freshness_chaos', value: 15, prob: 0.10, message: '📝 AA崩壊！鮮度大混乱！', chain: null },
    { id: 'ratio', name: 'ratio喰らった', effect: 'debuff', value: 5, prob: 0.12, message: '💬 ratio喰らった！次ターン攻撃力-5！L + cope', chain: 'pile_on' },
    { id: 'based', name: 'based認定', effect: 'buff', value: 10, prob: 0.12, message: '😎 based認定された！次ターン攻撃力+10！', chain: null },
    { id: 'skill_issue', name: 'skill issue', effect: 'mock', value: 0, prob: 0.10, message: '🤷 skill issue指摘！気にするな（鮮度-5）', chain: null },
    { id: 'ping_death', name: 'ping999ms', effect: 'slow', value: 0, prob: 0.08, message: '🌐 ping999ms！動きが鈍い！次ターンダメージ半減', chain: null },
    { id: 'dat_fall', name: 'dat落ち', effect: 'panic', value: 0, prob: 0, message: '📂 dat落ち！完全に消えた！HP-20', chain: null },
    { id: 'grass_grow', name: '草生える', effect: 'grass', value: 0, prob: 0, message: '🌱 wwwwwwww 草生えた！攻撃力+5', chain: null },
    { id: 'pile_on', name: '便乗叩き', effect: 'pile', value: 10, prob: 0, message: '📢 便乗叩きの嵐！追加10ダメージ！', chain: null },
    { id: 'sage', name: 'sage進行', effect: 'stealth', value: 0, prob: 0.08, message: '🤫 sage進行...鮮度消費なし', chain: null },
    { id: 'age', name: 'age荒らし', effect: 'expose', value: 0, prob: 0.08, message: '📣 age荒らし！鮮度-10', chain: null },
    { id: 'copy_paste', name: 'コピペ爆撃', effect: 'spam', value: 0, prob: 0.10, message: '📋 コピペ爆撃！混乱！', chain: null },
    { id: 'bot_spam', name: 'bot荒らし', effect: 'bot', value: 0, prob: 0.08, message: '🤖 bot大量発生！HP-8', chain: null },
    { id: 'flame_war', name: '炎上', effect: 'flame', value: 0, prob: 0.10, message: '🔥 炎上！全員ダメージ-12', chain: 'troll' },
    { id: 'sticky_troll', name: '粘着荒らし', effect: 'sticky', value: 3, prob: 0.12, message: '👻 粘着荒らし出現！3ターン持続ダメージ', chain: null },
    { id: 'multi_post', name: '連投', effect: 'multi', value: 0, prob: 0.10, message: '📢 連投攻撃！連続3回ダメージ！', chain: null },
    { id: 'quote_loop', name: '引用ループ', effect: 'quote', value: 0, prob: 0.08, message: '🔁 引用ループ発生！混乱+ダメージ', chain: null },
    { id: 'neta_pile', name: 'ネタ被り', effect: 'pile_on', value: 0, prob: 0.09, message: '🎭 ネタ被り！鮮度激減-20', chain: null },
    { id: 'long_post', name: '長文爆撃', effect: 'long', value: 0, prob: 0.11, message: '📜 長文爆撃！スクロールでHP-10', chain: null },
    { id: 'image_spam', name: '画像連投', effect: 'img_spam', value: 0, prob: 0.10, message: '🖼️ 画像連投！容量オーバー！', chain: 'server_down' },
    { id: 'ip_trace', name: 'IP特定', effect: 'trace', value: 0, prob: 0.07, message: '🔍 IP特定された！次ターン弱体化', chain: null },
    { id: 'proxy_fail', name: 'プロクシ失敗', effect: 'proxy', value: 0, prob: 0.08, message: '🚫 プロクシ失敗！素のIPで鮮度-15', chain: null }
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
    
    // ランダム要素（拡大）
    const randomFactor = 0.6 + Math.random() * 0.8; // 0.6 ~ 1.4（より振れ幅大）
    
    // クリティカル判定（10%）
    let criticalMultiplier = 1.0;
    let isCritical = false;
    if (Math.random() < 0.1) {
        criticalMultiplier = 2.0 + Math.random() * 0.5; // 2.0 ~ 2.5倍
        isCritical = true;
    }
    
    // カス当たり判定（8%）
    let isGraze = false;
    if (Math.random() < 0.08 && !isCritical) {
        criticalMultiplier = 0.3 + Math.random() * 0.2; // 0.3 ~ 0.5倍
        isGraze = true;
    }
    
    // 変な補正（ゾロ目ボーナス）
    let weirdBonus = 1.0;
    let weirdMessage = '';
    const roll = Math.floor(Math.random() * 100);
    if (roll === 11 || roll === 22 || roll === 33 || roll === 44 || roll === 55 || 
        roll === 66 || roll === 77 || roll === 88 || roll === 99) {
        weirdBonus = 1.5;
        weirdMessage = `ゾロ目(${roll})! +50%`;
    } else if (roll === 0) {
        weirdBonus = 3.0;
        weirdMessage = '00キタ━━━━(゚∀゚)━━━━!! 3倍!!';
    }
    
    // 鮮度による変な補正
    if (attacker.freshness === 100) {
        weirdBonus *= 1.1;
        weirdMessage += ' 完全鮮度+10%';
    } else if (attacker.freshness <= 10) {
        weirdBonus *= 0.7;
        weirdMessage += ' 腐敗-30%';
    }
    
    const totalDamage = Math.floor(
        baseAttack * freshnessMultiplier * (1 + contextBonus) * randomFactor * chargeMultiplier * criticalMultiplier * weirdBonus
    );
    
    return {
        damage: totalDamage,
        matchCount: matchCount,
        contextBonus: contextBonus,
        isCritical: isCritical,
        isGraze: isGraze,
        weirdMessage: weirdMessage,
        roll: roll
    };
}

// ボスMEMEデータベース
const BOSS_DATABASE = {
    thread_master: {
        id: 'thread_master',
        name: '伝説のスレ主',
        displayName: '伝説のスレ主',
        avatar: '👑',
        description: '1000スレを超えた伝説',
        tags: ['伝説', 'ネタ', '万能'],
        basePower: 35,
        baseHP: 150,
        flavorWin: 'スレ立て完了。お疲れ様でした',
        flavorLose: 'スレが落ちた...',
        catchphrase: '1000スレ達成',
        lore: '数千スレを立て続け、無数の名言を生み出した伝説のスレ主。ネット世論を動かす力を持つ。',
        signatureMove: '伝説スレ乱立',
        personality: {
            attackLine: '次スレ立てます',
            feintLine: 'スレ保守',
            chargeLine: 'スレ立て準備中'
        },
        uniqueTrait: {
            name: 'カリスマ',
            description: '毎ターン攻撃力+3',
            type: 'boss_charisma'
        },
        themeColor: '#ffd700',
        themeImage: 'https://picsum.photos/seed/thread-master-boss/800/600?blur=2'
    },
    
    troll_king: {
        id: 'troll_king',
        name: '荒らし王',
        displayName: '荒らし王',
        avatar: '👹',
        description: 'あらゆるスレを荒廃させる',
        tags: ['ネタ', '不気味', '万能'],
        basePower: 38,
        baseHP: 140,
        flavorWin: 'このスレ終了ｗｗｗ',
        flavorLose: 'BANされた...',
        catchphrase: '荒らすぞ〜',
        lore: '荒らしの頂点に立つ存在。IP変えてでも荒らし続ける執念と技術を持つ。',
        signatureMove: '無差別荒らし',
        personality: {
            attackLine: 'ｗｗｗｗｗ',
            feintLine: 'IP変更',
            chargeLine: '荒らし準備'
        },
        uniqueTrait: {
            name: '荒廃',
            description: '攻撃時、敵の鮮度を追加で-10',
            type: 'boss_devastate'
        },
        themeColor: '#d32f2f',
        themeImage: 'https://picsum.photos/seed/troll-king-boss/800/600?blur=3'
    },
    
    meme_god: {
        id: 'meme_god',
        name: 'ミーム神',
        displayName: 'ミーム神',
        avatar: '🌌',
        description: 'すべてのミームを統べる',
        tags: ['伝説', '哲学', 'メタ'],
        basePower: 42,
        baseHP: 180,
        flavorWin: '新たなミームが生まれた',
        flavorLose: 'ミームは進化し続ける...',
        catchphrase: 'I am the meme',
        lore: 'すべてのミームの起源にして終着点。文化の伝播と変異を司る概念的存在。',
        signatureMove: 'ミーム創造',
        personality: {
            attackLine: '進化せよ',
            feintLine: '変異せよ',
            chargeLine: '創造の時'
        },
        uniqueTrait: {
            name: '創造神',
            description: '全属性のタグと一致',
            type: 'boss_omnipotent'
        },
        themeColor: '#9c27b0',
        themeImage: 'https://picsum.photos/seed/meme-god-boss/800/600?blur=2'
    }
};

// ランダムな敵ミームを選択
function selectRandomEnemy(playerMeme, isBoss = false, bossType = null) {
    if (isBoss && bossType && BOSS_DATABASE[bossType]) {
        return BOSS_DATABASE[bossType];
    }
    
    const allMemes = Object.values(MEME_DATABASE);
    const availableEnemies = allMemes.filter(m => m.id !== playerMeme.id);
    return availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
}

// ボス戦判定
function shouldSpawnBoss(stageNumber) {
    if (stageNumber === 3) return 'thread_master';
    if (stageNumber === 5) return 'troll_king';
    if (stageNumber === 10) return 'meme_god';
    return null;
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
