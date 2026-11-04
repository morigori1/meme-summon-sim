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
        this.battlefield = selectRandomBattlefield();
        this.renderBattlefield();
        this.renderMemeSelector();
        this.attachEventListeners();
        this.updatePhaseIndicator();
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
            
            card.innerHTML = `
                <h4>${meme.displayName} ${meme.avatar}</h4>
                <p style="font-size: 0.85em; margin: 5px 0;">${meme.description}</p>
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
        
        // 最初のターンで儀式QTE
        await this.ritualQTE();
    }

    async ritualQTE() {
        this.log('━━━ 召喚儀式発動！ ━━━', 'system');
        
        // コマンドボタンを一時的に無効化
        this.setCommandButtonsEnabled(false);
        
        const success = await this.qteManager.start();
        
        if (success) {
            this.log('🎉 儀式成功！プレイヤーに先制ボーナス！', 'context-bonus');
            this.playerMeme.hp += 20;
            this.playerMeme.maxHP += 20;
        } else {
            this.log('💥 儀式失敗...初手が不安定に', 'damage');
            this.playerMeme.freshness -= 10;
        }
        
        this.renderCombatants();
        this.setCommandButtonsEnabled(true);
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
        const playerMultiplier = this.playerCharged ? 1.5 : 1.0;
        const enemyMultiplier = this.enemyCharged ? 1.5 : 1.0;
        
        this.playerCharged = false;
        this.enemyCharged = false;
        
        // 攻撃 vs フェイント: フェイントが無効化
        // 攻撃 vs 攻撃: 両方ダメージ
        // 攻撃 vs チャージ: 攻撃側有利
        // フェイント vs チャージ: 読み合い成功、チャージ無効
        
        if (playerCmd === 'attack' && enemyCmd === 'feint') {
            this.log('敵のフェイントで攻撃が空振り！');
        } else if (playerCmd === 'attack') {
            // プレイヤーの攻撃
            const result = calculateDamage(
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
            
            this.enemyMeme.hp -= finalDamage;
            this.playerMeme.freshness -= 5;
            
            this.log(`${this.playerMeme.displayName}の攻撃！${finalDamage}ダメージ！`, 'damage');
            if (result.matchCount > 0) {
                this.log(`文脈適合ボーナス！(+${Math.floor(result.contextBonus * 100)}%)`, 'context-bonus');
            }
        } else if (playerCmd === 'charge') {
            this.playerCharged = true;
            this.log(`${this.playerMeme.displayName}は力を溜めている...`);
        }
        
        if (enemyCmd === 'attack' && playerCmd === 'feint') {
            this.log('プレイヤーのフェイントで敵の攻撃を回避！', 'context-bonus');
        } else if (enemyCmd === 'attack') {
            // 敵の攻撃
            const result = calculateDamage(
                this.enemyMeme, 
                this.playerMeme, 
                this.battlefield.tags,
                enemyMultiplier
            );
            
            this.playerMeme.hp -= result.damage;
            this.enemyMeme.freshness -= 5;
            
            this.log(`${this.enemyMeme.displayName}の攻撃！${result.damage}ダメージ！`, 'damage');
            if (result.matchCount > 0) {
                this.log(`敵も文脈適合ボーナス！(+${Math.floor(result.contextBonus * 100)}%)`, 'damage');
            }
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
                    <p>${this.playerMeme.flavorWin}</p>
                    <p style="margin-top: 15px;">
                        ${this.playerMeme.displayName}が${this.enemyMeme.displayName}を制した！<br>
                        残りHP: ${Math.max(0, this.playerMeme.hp)} / 鮮度: ${Math.max(0, this.playerMeme.freshness)}%
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
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    const game = new MemeRitualBattle();
    game.init();
});
