// メインゲームロジック

class MemeRitualBattle {
    constructor() {
        this.phase = 'ritual'; // ritual, battle, result
        this.selectedMeme = null;
        this.playerMeme = null;
        this.enemyMeme = null;
        this.battlefield = null;
        this.turn = 0;
        this.maxTurns = 5;
        this.playerCommand = null;
        this.playerCharged = false;
        this.enemyCharged = false;
        
        this.qteManager = new QTEManager();
    }

    init() {
        this.qteManager.init();
        this.battlefield = generateRandomBattlefield();
        this.renderBattlefield();
        this.renderMemeSelector();
        this.attachEventListeners();
        this.updatePhaseIndicator();
        
        // 連続攻撃カウンター初期化
        this.playerComboCount = 0;
        this.enemyComboCount = 0;
    }

    updatePhaseIndicator() {
        const indicator = document.getElementById('phaseIndicator');
        switch(this.phase) {
            case 'ritual':
                indicator.textContent = '★ 儀式準備フェーズ ★';
                break;
            case 'battle':
                indicator.textContent = `★ 召喚バトル - ターン ${this.turn + 1}/${this.maxTurns} ★`;
                break;
            case 'result':
                indicator.textContent = '★ 結果 ★';
                break;
        }
    }

    renderBattlefield() {
        const tagsContainer = document.getElementById('battlefieldTags');
        tagsContainer.innerHTML = '';
        
        const nameDiv = document.createElement('div');
        nameDiv.style.marginBottom = '10px';
        nameDiv.innerHTML = `<strong>${this.battlefield.name}</strong>: ${this.battlefield.description}`;
        tagsContainer.parentElement.insertBefore(nameDiv, tagsContainer);
        
        this.battlefield.tags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'context-tag';
            tagEl.textContent = `#${tag}`;
            tagsContainer.appendChild(tagEl);
        });
    }

    renderMemeSelector() {
        const selector = document.getElementById('ingredientSelector');
        selector.innerHTML = '';
        
        Object.values(MEME_DATABASE).forEach(meme => {
            const card = document.createElement('div');
            card.className = 'ingredient-card';
            card.dataset.memeId = meme.id;
            
            const matchCount = calculateContextMatch(meme.tags, this.battlefield.tags);
            const matchIndicator = matchCount > 0 ? 
                `<span class="match-indicator">適合度:${matchCount}</span>` : '';
            
            // loreの1行要約（最初の1文）
            const loreSummary = meme.lore.split('。')[0] + '。';
            
            card.innerHTML = `
                <h4>${meme.displayName} ${meme.avatar}</h4>
                <p style="font-size: 0.85em; margin: 5px 0;">${meme.description}</p>
                <p style="font-size: 0.75em; margin: 5px 0; color: #aaa; font-style: italic;">${loreSummary}</p>
                <div style="margin: 5px 0; font-size: 0.85em;">
                    <strong style="color: #ffaa00;">必殺技:</strong> ${meme.signatureMove}
                </div>
                <div style="margin: 5px 0; font-size: 0.85em;">
                    <strong style="color: #00ff88;">特性:</strong> ${meme.uniqueTrait.name}
                </div>
                <div class="ingredient-tags">
                    ${meme.tags.map(tag => `<span class="ingredient-tag">#${tag}</span>`).join('')}
                </div>
                <div style="margin-top: 8px; font-size: 0.9em;">
                    威力:${meme.basePower} HP:${meme.baseHP} ${matchIndicator}
                </div>
            `;
            
            card.addEventListener('click', () => this.selectMeme(meme.id));
            selector.appendChild(card);
        });
    }

    selectMeme(memeId) {
        this.selectedMeme = MEME_DATABASE[memeId];
        
        // 選択状態の表示更新
        document.querySelectorAll('.ingredient-card').forEach(card => {
            card.classList.remove('selected');
            if (card.dataset.memeId === memeId) {
                card.classList.add('selected');
            }
        });
        
        document.getElementById('summonButton').disabled = false;
    }

    attachEventListeners() {
        document.getElementById('summonButton').addEventListener('click', () => {
            this.startBattle();
        });
        
        document.querySelectorAll('.command-button').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectCommand(btn.dataset.command);
            });
        });
        
        document.getElementById('restartButton').addEventListener('click', () => {
            location.reload();
        });
    }

    async startBattle() {
        if (!this.selectedMeme) return;
        
        // プレイヤーと敵のミームを初期化
        this.playerMeme = {
            ...this.selectedMeme,
            hp: this.selectedMeme.baseHP,
            maxHP: this.selectedMeme.baseHP,
            freshness: 100
        };
        
        const enemyTemplate = selectRandomEnemy(this.selectedMeme);
        this.enemyMeme = {
            ...enemyTemplate,
            hp: enemyTemplate.baseHP,
            maxHP: enemyTemplate.baseHP,
            freshness: 100
        };
        
        // 儀式演出を実行
        await this.performRitualSequence();
        
        // フェーズ切り替え
        this.phase = 'battle';
        this.turn = 0;
        document.getElementById('ritualPhase').classList.remove('active');
        document.getElementById('battlePhase').classList.add('active');
        this.updatePhaseIndicator();
        
        // バトル画面を初期化
        this.renderCombatants();
        this.log(`${this.playerMeme.displayName} VS ${this.enemyMeme.displayName}`);
        this.log(`戦場：${this.battlefield.name}`);
    }

    async performRitualSequence() {
        const overlay = document.getElementById('ritualOverlay');
        const avatar = document.getElementById('ritualAvatar');
        const catchphrase = document.getElementById('ritualCatchphrase');
        const lore = document.getElementById('ritualLore');
        const step = document.getElementById('ritualStep');
        const gaugeFill = document.getElementById('ritualGaugeFill');
        const particles = document.getElementById('ritualParticles');
        
        // パーティクル生成
        this.createParticles(particles);
        
        // オーバーレイ表示
        overlay.classList.add('active');
        avatar.textContent = this.playerMeme.avatar;
        catchphrase.textContent = this.playerMeme.catchphrase;
        lore.textContent = this.playerMeme.lore;
        
        // ステップ1: 準備
        step.textContent = '【第一段階】召喚陣準備...';
        gaugeFill.style.width = '0%';
        await this.wait(1000);
        gaugeFill.style.width = '33%';
        await this.wait(1000);
        
        // ステップ2: 詠唱
        step.textContent = '【第二段階】詠唱開始...';
        gaugeFill.style.width = '66%';
        await this.wait(1500);
        
        // ステップ3: QTE
        step.textContent = '【第三段階】力の集中！';
        gaugeFill.style.width = '100%';
        await this.wait(500);
        
        const success = await this.qteManager.start();
        
        // ステップ4: 召喚完了
        if (success) {
            step.textContent = '✨ 召喚成功！ ✨';
            this.flashEffect();
            await this.wait(800);
            
            this.playerMeme.hp += 20;
            this.playerMeme.maxHP += 20;
            
            setTimeout(() => {
                this.log('🎉 儀式成功！プレイヤーに先制ボーナス！', 'context-bonus');
            }, 100);
        } else {
            step.textContent = '💥 召喚不完全... 💥';
            await this.wait(1000);
            
            this.playerMeme.freshness -= 10;
            
            setTimeout(() => {
                this.log('💥 儀式失敗...初手が不安定に', 'damage');
            }, 100);
        }
        
        overlay.classList.remove('active');
        
        // パーティクルクリア
        particles.innerHTML = '';
    }
    
    createParticles(container) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(particle);
        }
    }
    
    flashEffect() {
        const flash = document.getElementById('flashOverlay');
        flash.classList.add('active');
        setTimeout(() => {
            flash.classList.remove('active');
        }, 500);
    }
    
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    renderCombatants() {
        // プレイヤー
        document.getElementById('playerName').textContent = this.playerMeme.displayName;
        document.getElementById('playerAvatar').textContent = this.playerMeme.avatar;
        document.getElementById('playerHP').textContent = Math.max(0, this.playerMeme.hp);
        document.getElementById('playerFreshness').textContent = Math.max(0, this.playerMeme.freshness);
        
        const playerHPPercent = Math.max(0, (this.playerMeme.hp / this.playerMeme.maxHP) * 100);
        document.getElementById('playerHPBar').style.width = `${playerHPPercent}%`;
        
        // 敵
        document.getElementById('enemyName').textContent = this.enemyMeme.displayName;
        document.getElementById('enemyAvatar').textContent = this.enemyMeme.avatar;
        document.getElementById('enemyHP').textContent = Math.max(0, this.enemyMeme.hp);
        document.getElementById('enemyFreshness').textContent = Math.max(0, this.enemyMeme.freshness);
        
        const enemyHPPercent = Math.max(0, (this.enemyMeme.hp / this.enemyMeme.maxHP) * 100);
        document.getElementById('enemyHPBar').style.width = `${enemyHPPercent}%`;
        
        // ターンカウンター
        document.getElementById('turnCounter').textContent = 
            `ターン ${this.turn + 1} / ${this.maxTurns}`;
    }

    selectCommand(command) {
        this.playerCommand = command;
        
        // 選択状態の表示
        document.querySelectorAll('.command-button').forEach(btn => {
            btn.classList.remove('selected');
            if (btn.dataset.command === command) {
                btn.classList.add('selected');
            }
        });
        
        // コマンド実行
        setTimeout(() => this.executeTurn(), 500);
    }

    async executeTurn() {
        if (!this.playerCommand) return;
        
        // ボタンを無効化
        this.setCommandButtonsEnabled(false);
        
        // 敵のコマンドをAIで選択
        const enemyCommand = this.selectEnemyCommand();
        
        this.log(`━━━ ターン ${this.turn + 1} ━━━`, 'system');
        this.log(`プレイヤー: ${this.getCommandName(this.playerCommand)}`);
        this.log(`敵: ${this.getCommandName(enemyCommand)}`);
        
        // コマンド解決
        await this.resolveCommands(this.playerCommand, enemyCommand);
        
        // ターン終了処理
        this.turn++;
        this.updatePhaseIndicator();
        
        // 勝敗判定
        if (this.checkBattleEnd()) {
            this.endBattle();
        } else if (this.turn >= this.maxTurns) {
            this.endBattle('draw');
        } else {
            // 次のターンへ
            this.playerCommand = null;
            document.querySelectorAll('.command-button').forEach(btn => {
                btn.classList.remove('selected');
            });
            this.setCommandButtonsEnabled(true);
        }
    }

    async resolveCommands(playerCmd, enemyCmd) {
        // 同時解決システム（じゃんけん風）
        
        // チャージ判定
        let playerMultiplier = this.playerCharged ? 1.5 : 1.0;
        let enemyMultiplier = this.enemyCharged ? 1.5 : 1.0;
        
        const playerWasCharged = this.playerCharged;
        const enemyWasCharged = this.enemyCharged;
        
        this.playerCharged = false;
        this.enemyCharged = false;
        
        // 攻撃 vs フェイント: フェイントが無効化
        // 攻撃 vs 攻撃: 両方ダメージ
        // 攻撃 vs チャージ: 攻撃側有利
        // フェイント vs チャージ: 読み合い成功、チャージ無効
        
        if (playerCmd === 'attack' && enemyCmd === 'feint') {
            this.log('敵のフェイントで攻撃が空振り！');
            this.playerComboCount = 0;
        } else if (playerCmd === 'attack') {
            // プレイヤーの攻撃
            let result = calculateDamage(
                this.playerMeme, 
                this.enemyMeme, 
                this.battlefield.tags,
                playerMultiplier
            );
            
            // 3ターン目にランダムでQTE発動
            let finalDamage = result.damage;
            if (this.turn === 2 && Math.random() > 0.5) {
                this.log('⚡ クリティカルチャンス！QTE発動！', 'context-bonus');
                this.setCommandButtonsEnabled(false);
                const qteSuccess = await this.qteManager.start();
                const qteResult = applyQTEBonus(qteSuccess, result.damage);
                finalDamage = qteResult.damage;
                this.log(qteResult.message, qteSuccess ? 'context-bonus' : 'damage');
            }
            
            // ユニーク特性適用
            finalDamage = this.applyUniqueTrait(this.playerMeme, 'player', 'attack', finalDamage, playerWasCharged);
            
            this.enemyMeme.hp -= finalDamage;
            this.playerMeme.freshness -= 5;
            
            this.log(`${this.playerMeme.personality.attackLine}`, 'normal');
            this.log(`${this.playerMeme.displayName}の${this.playerMeme.signatureMove}！${finalDamage}ダメージ！`, 'damage');
            if (result.matchCount > 0) {
                this.log(`文脈適合ボーナス！(+${Math.floor(result.contextBonus * 100)}%)`, 'context-bonus');
            }
            
            this.playerComboCount++;
        } else if (playerCmd === 'charge') {
            this.playerCharged = true;
            this.log(`${this.playerMeme.personality.chargeLine}`, 'normal');
            this.log(`${this.playerMeme.displayName}は力を溜めている...`);
        } else if (playerCmd === 'feint') {
            this.log(`${this.playerMeme.personality.feintLine}`, 'normal');
        }
        
        if (enemyCmd === 'attack' && playerCmd === 'feint') {
            this.log('プレイヤーのフェイントで敵の攻撃を回避！', 'context-bonus');
            // ぬるぽ即応特性
            const feintDamage = this.applyUniqueTrait(this.playerMeme, 'player', 'feint_success', 0);
            if (feintDamage > 0) {
                this.enemyMeme.hp -= feintDamage;
                this.log(`反撃！${feintDamage}ダメージ！`, 'context-bonus');
            }
            this.enemyComboCount = 0;
        } else if (enemyCmd === 'attack') {
            // 敵の攻撃
            let result = calculateDamage(
                this.enemyMeme, 
                this.playerMeme, 
                this.battlefield.tags,
                enemyMultiplier
            );
            
            let finalDamage = result.damage;
            
            // 敵のユニーク特性適用
            finalDamage = this.applyUniqueTrait(this.enemyMeme, 'enemy', 'attack', finalDamage, enemyWasCharged);
            
            // プレイヤーの防御特性適用
            finalDamage = this.applyDefenseTrait(this.playerMeme, finalDamage);
            
            this.playerMeme.hp -= finalDamage;
            this.enemyMeme.freshness -= 5;
            
            this.log(`${this.enemyMeme.displayName}の攻撃！${finalDamage}ダメージ！`, 'damage');
            if (result.matchCount > 0) {
                this.log(`敵も文脈適合ボーナス！(+${Math.floor(result.contextBonus * 100)}%)`, 'damage');
            }
            
            this.enemyComboCount++;
        } else if (enemyCmd === 'charge') {
            this.enemyCharged = true;
            this.log(`${this.enemyMeme.displayName}は力を溜めている...`);
        }
        
        // フェイントvsフェイント
        if (playerCmd === 'feint' && enemyCmd === 'feint') {
            this.log('お互いに様子見...睨み合いが続く');
        }
        
        // フェイントvsチャージ
        if (playerCmd === 'feint' && enemyCmd === 'charge') {
            this.log('敵のチャージを読んで妨害！', 'context-bonus');
            this.enemyCharged = false;
            this.enemyMeme.freshness -= 10;
        }
        if (enemyCmd === 'feint' && playerCmd === 'charge') {
            this.log('チャージを読まれて妨害された！', 'damage');
            this.playerCharged = false;
            this.playerMeme.freshness -= 10;
        }
        
        // 鮮度減少
        this.playerMeme.freshness = Math.max(0, this.playerMeme.freshness);
        this.enemyMeme.freshness = Math.max(0, this.enemyMeme.freshness);
        
        await new Promise(resolve => setTimeout(resolve, 800));
        this.renderCombatants();
    }

    selectEnemyCommand() {
        // 簡易AI
        const rand = Math.random();
        if (rand < 0.4) return 'attack';
        if (rand < 0.7) return 'feint';
        return 'charge';
    }

    checkBattleEnd() {
        return this.playerMeme.hp <= 0 || this.enemyMeme.hp <= 0;
    }

    endBattle(forcedResult = null) {
        this.phase = 'result';
        this.updatePhaseIndicator();
        
        document.getElementById('battlePhase').classList.remove('active');
        document.getElementById('resultPhase').classList.add('active');
        
        const resultDisplay = document.getElementById('resultDisplay');
        const resultTitle = document.getElementById('resultTitle');
        const resultFlavor = document.getElementById('resultFlavor');
        
        let result;
        if (forcedResult === 'draw') {
            result = 'draw';
        } else if (this.playerMeme.hp <= 0 && this.enemyMeme.hp <= 0) {
            result = 'draw';
        } else if (this.playerMeme.hp > this.enemyMeme.hp) {
            result = 'victory';
        } else {
            result = 'defeat';
        }
        
        resultDisplay.className = 'result-display ' + result;
        
        switch(result) {
            case 'victory':
                resultTitle.textContent = '🎉 勝利！ 🎉';
                resultFlavor.innerHTML = `
                    <p style="font-size: 1.1em; color: #00ff88;">${this.playerMeme.catchphrase}</p>
                    <p>${this.playerMeme.flavorWin}</p>
                    <p style="margin-top: 15px;">
                        ${this.playerMeme.displayName}が${this.enemyMeme.displayName}を制した！<br>
                        残りHP: ${Math.max(0, this.playerMeme.hp)} / 鮮度: ${Math.max(0, this.playerMeme.freshness)}%
                    </p>
                    <p style="margin-top: 10px; font-size: 0.85em; color: #aaa; font-style: italic;">
                        ${this.playerMeme.lore.split('。')[0]}。
                    </p>
                `;
                break;
            case 'defeat':
                resultTitle.textContent = '💥 敗北... 💥';
                resultFlavor.innerHTML = `
                    <p>${this.playerMeme.flavorLose}</p>
                    <p style="margin-top: 15px;">
                        ${this.enemyMeme.displayName}の前に力尽きた...<br>
                        次こそは勝利を掴め！
                    </p>
                    <p style="margin-top: 10px; font-size: 0.85em; color: #aaa; font-style: italic;">
                        ${this.enemyMeme.catchphrase}
                    </p>
                `;
                break;
            case 'draw':
                resultTitle.textContent = '⚡ 引き分け ⚡';
                resultFlavor.innerHTML = `
                    <p>互いに一歩も引かぬ激戦！</p>
                    <p style="margin-top: 15px;">
                        ${this.playerMeme.displayName}と${this.enemyMeme.displayName}、<br>
                        どちらも譲らぬまま時間切れ！<br>
                        両者健闘を称え合った。
                    </p>
                `;
                break;
        }
    }

    log(message, type = 'normal') {
        const logContainer = document.getElementById('battleLog');
        const entry = document.createElement('div');
        entry.className = 'log-entry ' + type;
        entry.textContent = message;
        logContainer.appendChild(entry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    getCommandName(command) {
        const names = {
            'attack': '攻撃',
            'feint': 'フェイント',
            'charge': 'チャージ'
        };
        return names[command] || command;
    }

    setCommandButtonsEnabled(enabled) {
        document.querySelectorAll('.command-button').forEach(btn => {
            btn.disabled = !enabled;
        });
    }
    
    applyUniqueTrait(meme, side, action, baseDamage, isCharged = false) {
        const trait = meme.uniqueTrait;
        let damage = baseDamage;
        
        switch(trait.type) {
            case 'on_attack_success':
                // 野獣先輩: 攻撃成功時、鮮度+3回復
                if (action === 'attack' && meme.id === 'yaju') {
                    meme.freshness = Math.min(100, meme.freshness + 3);
                    this.log(`${meme.displayName}の語録で鮮度回復！`, 'context-bonus');
                }
                break;
                
            case 'on_feint_success':
                // ぬるぽ: フェイント成功時に反撃ダメージ+8
                if (action === 'feint_success' && meme.id === 'nullpo') {
                    return 8;
                }
                break;
                
            case 'charge_boost':
                // ブロントさん: チャージ完了攻撃の倍率2.0倍
                if (action === 'attack' && isCharged && meme.id === 'buront') {
                    const boost = Math.floor(damage * 0.33); // 1.5→2.0へ補正
                    this.log(`ナイト様の威厳！チャージ攻撃強化！`, 'context-bonus');
                    return damage + boost;
                }
                break;
                
            case 'freshness_drain':
                // 八頭身モナー: 攻撃時、相手の鮮度を追加-3
                if (action === 'attack' && meme.id === 'hattoushin') {
                    const target = side === 'player' ? this.enemyMeme : this.playerMeme;
                    target.freshness = Math.max(0, target.freshness - 3);
                    this.log(`不気味な視線が相手を蝕む...`, 'context-bonus');
                }
                break;
                
            case 'combo_stack':
                // トンファー: 連続攻撃成功で威力累積+4/回
                if (action === 'attack' && meme.id === 'tonfa') {
                    const comboCount = side === 'player' ? this.playerComboCount : this.enemyComboCount;
                    if (comboCount > 0) {
                        const comboBonus = comboCount * 4;
                        this.log(`トンファーコンボ！+${comboBonus}`, 'context-bonus');
                        return damage + comboBonus;
                    }
                }
                break;
                
            case 'battlefield_bonus':
                // CCO: 特定タグの戦場でダメージ+20%
                if (action === 'attack' && meme.id === 'cco') {
                    if (this.battlefield.tags.includes(trait.targetTag)) {
                        const bonus = Math.floor(damage * 0.2);
                        this.log(`空耳が戦場に響く！`, 'context-bonus');
                        return damage + bonus;
                    }
                }
                break;
                
            case 'first_turn_boost':
                // Rickroll: 初ターン攻撃のダメージ+50%
                if (action === 'attack' && meme.id === 'rickroll' && this.turn === 0) {
                    const bonus = Math.floor(damage * 0.5);
                    this.log(`不意打ち成功！`, 'context-bonus');
                    return damage + bonus;
                }
                break;
                
            case 'high_risk':
                // Leeroy: 攻撃力+10だが被ダメージ+15%（攻撃時のみ+10）
                if (action === 'attack' && meme.id === 'leeroy') {
                    return damage + 10;
                }
                break;
                
            case 'random_bonus':
                // Doge: ターン終了時15%でHP+5 or 鮮度+5（攻撃時にチェック）
                if (action === 'attack' && meme.id === 'doge' && Math.random() < 0.15) {
                    if (Math.random() < 0.5) {
                        meme.hp = Math.min(meme.maxHP, meme.hp + 5);
                        this.log(`such heal. wow.`, 'context-bonus');
                    } else {
                        meme.freshness = Math.min(100, meme.freshness + 5);
                        this.log(`very fresh. much energy.`, 'context-bonus');
                    }
                }
                break;
        }
        
        return damage;
    }
    
    applyDefenseTrait(meme, incomingDamage) {
        const trait = meme.uniqueTrait;
        
        if (trait.type === 'low_hp_defense') {
            // This is fine: HP50%以下で被ダメージ-25%
            if (meme.id === 'thisisfine' && meme.hp <= meme.maxHP * 0.5) {
                const reduction = Math.floor(incomingDamage * 0.25);
                this.log(`This is fine... 被ダメージ軽減！`, 'context-bonus');
                return incomingDamage - reduction;
            }
        }
        
        if (trait.type === 'high_risk') {
            // Leeroy: 被ダメージ+15%
            if (meme.id === 'leeroy') {
                return Math.floor(incomingDamage * 1.15);
            }
        }
        
        return incomingDamage;
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    const game = new MemeRitualBattle();
    game.init();
});
