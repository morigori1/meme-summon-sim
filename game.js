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
        
        // バフ/デバフ管理
        this.playerBuffs = { attack: 0, nextDamageBoost: 0 };
        this.enemyBuffs = { attack: 0, nextDamageBoost: 0 };
        
        // イベント発動フラグ
        this.nextTurnConfused = false;
        this.nextTurnSkip = false;
        this.nextTurnDamageHalf = false;
        
        // 文脈再現度
        this.contextFidelity = 100;
        
        // アイテム使用済みフラグ
        this.usedItems = {
            superchat: false,
            amagift: false,
            hakushu: false,
            stamp: false
        };
        
        // 連戦カウンター
        this.stageNumber = 1;
        this.continuousWins = 0;
        
        // 戦況ログ（スレまとめ用）
        this.battleLog = [];
        
        // 連勝称号
        this.currentTitle = 'ネット初心者';
        
        // 粘着ダメージカウンター
        this.stickyTurns = 0;
        
        // Web Audio初期化（オプション）
        this.initAudio();
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.audioEnabled = true;
        } catch (e) {
            this.audioEnabled = false;
            console.log('Web Audio not available');
        }
    }
    
    playTone(frequency, duration, volume = 0.1) {
        if (!this.audioEnabled) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (e) {
            // 失敗しても続行
        }
    }
    
    playChord(frequencies, duration, volume = 0.1) {
        if (!this.audioEnabled) return;
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, duration, volume);
            }, index * 50);
        });
    }
    
    playVictoryFanfare() {
        if (!this.audioEnabled) return;
        
        const melody = [523, 659, 784, 1047]; // C, E, G, C
        melody.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 0.3, 0.15);
            }, index * 150);
        });
    }
    
    playDefeatSound() {
        if (!this.audioEnabled) return;
        
        const melody = [400, 350, 300, 250];
        melody.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 0.4, 0.12);
            }, index * 200);
        });
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
        const contextElement = document.getElementById('battlefieldContext');
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
        
        // 戦場背景画像を設定
        if (this.battlefield.backgroundImage) {
            contextElement.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${this.battlefield.backgroundImage}')`;
            contextElement.style.backgroundSize = 'cover';
            contextElement.style.backgroundPosition = 'center';
            
            // 画像読み込みエラー時のフォールバック
            const img = new Image();
            img.onerror = () => {
                contextElement.style.backgroundImage = 'linear-gradient(135deg, rgba(255, 170, 0, 0.25) 0%, rgba(255, 100, 0, 0.25) 100%)';
            };
            img.src = this.battlefield.backgroundImage;
        }
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
            
            // カード背景画像を設定
            if (meme.themeImage) {
                card.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.75)), url('${meme.themeImage}')`;
                card.style.backgroundSize = 'cover';
                card.style.backgroundPosition = 'center';
                
                // 画像読み込みエラー時のフォールバック
                const img = new Image();
                img.onerror = () => {
                    card.style.backgroundImage = `linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, ${meme.themeColor || '#00ff88'}33 100%)`;
                };
                img.src = meme.themeImage;
            }
            
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
        
        document.querySelectorAll('.stream-item-button').forEach(btn => {
            btn.addEventListener('click', () => {
                this.useStreamItem(btn.dataset.item);
            });
        });
        
        document.getElementById('restartButton').addEventListener('click', () => {
            location.reload();
        });
    }
    
    async useStreamItem(itemId) {
        if (this.usedItems[itemId]) return;
        if (this.phase !== 'battle') return;
        
        const item = STREAM_ITEMS.find(i => i.id === itemId);
        if (!item) return;
        
        this.usedItems[itemId] = true;
        document.getElementById(`item-${itemId}`).disabled = true;
        document.getElementById(`item-${itemId}`).classList.add('used');
        
        this.log(`${item.emoji} 【手動使用】${item.message}`, 'context-bonus');
        this.playTone(900, 0.4, 0.18);
        
        await this.wait(300);
        
        switch(item.effect) {
            case 'hp_heal':
                this.playerMeme.hp = Math.min(this.playerMeme.maxHP, this.playerMeme.hp + item.value);
                break;
            case 'power_boost':
                this.playerBuffs.nextDamageBoost = item.value;
                break;
            case 'freshness_boost':
                this.playerMeme.freshness = Math.min(100, this.playerMeme.freshness + item.value);
                break;
            case 'confusion_enemy':
                this.enemyMeme.freshness = Math.max(0, this.enemyMeme.freshness - 10);
                break;
        }
        
        this.renderCombatants();
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
        this.updateCommandButtons(this.playerMeme); // コマンドボタン更新
        this.log(`${this.playerMeme.displayName} VS ${this.enemyMeme.displayName}`);
        this.log(`戦場：${this.battlefield.name}`);
    }
    
    updateCommandButtons(meme) {
        if (!meme || !meme.commands) return;
        
        // 攻撃ボタン
        const attackBtn = document.querySelector('[data-command="attack"]');
        if (attackBtn && meme.commands.attack) {
            attackBtn.innerHTML = `${meme.commands.attack.name}<br><small>${meme.commands.attack.desc}</small>`;
        }
        
        // フェイントボタン
        const feintBtn = document.querySelector('[data-command="feint"]');
        if (feintBtn && meme.commands.feint) {
            feintBtn.innerHTML = `${meme.commands.feint.name}<br><small>${meme.commands.feint.desc}</small>`;
        }
        
        // チャージボタン
        const chargeBtn = document.querySelector('[data-command="charge"]');
        if (chargeBtn && meme.commands.charge) {
            chargeBtn.innerHTML = `${meme.commands.charge.name}<br><small>${meme.commands.charge.desc}</small>`;
        }
    }

    async performRitualSequence() {
        const overlay = document.getElementById('ritualOverlay');
        const avatar = document.getElementById('ritualAvatar');
        const catchphrase = document.getElementById('ritualCatchphrase');
        const lore = document.getElementById('ritualLore');
        const step = document.getElementById('ritualStep');
        const gaugeFill = document.getElementById('ritualGaugeFill');
        const particles = document.getElementById('ritualParticles');
        
        // パーティクル生成（増量）
        this.createParticles(particles);
        
        // オーバーレイ表示
        overlay.classList.add('active');
        
        // 儀式背景画像を設定
        if (this.playerMeme.themeImage) {
            overlay.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)), url('${this.playerMeme.themeImage}')`;
            overlay.style.backgroundSize = 'cover';
            overlay.style.backgroundPosition = 'center';
            
            // 画像読み込みエラー時のフォールバック
            const img = new Image();
            img.onerror = () => {
                overlay.style.backgroundImage = 'rgba(0, 0, 0, 0.95)';
            };
            img.src = this.playerMeme.themeImage;
        }
        
        avatar.textContent = this.playerMeme.avatar;
        catchphrase.textContent = this.playerMeme.catchphrase;
        lore.textContent = this.playerMeme.lore;
        
        // ステップ1: 準備
        step.textContent = '【第一段階】召喚陣準備...';
        gaugeFill.style.width = '0%';
        this.playTone(200, 0.3, 0.1);
        await this.wait(800);
        gaugeFill.style.width = '33%';
        this.playTone(300, 0.3, 0.1);
        await this.wait(800);
        
        // ステップ2: 詠唱
        step.textContent = '【第二段階】詠唱開始...';
        gaugeFill.style.width = '66%';
        this.playTone(400, 0.4, 0.12);
        
        // 詠唱テキスト表示
        const chantTexts = [
            'いにしえのネット海より、我が許に来たれ...',
            'バズりし者よ、今ここに現れん...',
            'ログ流れども、残りし記憶、今ここに...',
            '拡散せし力、我が魂に宿れ...',
            '炎上せし者、我が呼びかけに応えよ...',
            'サーバーの彼方より、降臨せよ...',
            'スレ落ちせず、永久保存、今此処に...',
            'ミームの海より、選ばれし者よ...'
        ];
        const selectedChant = chantTexts[Math.floor(Math.random() * chantTexts.length)];
        
        // 一時的に詠唱テキストを表示
        const originalStepText = step.textContent;
        step.textContent = `📿 ${selectedChant}`;
        step.style.fontSize = '1.1em';
        step.style.color = '#00ff88';
        await this.wait(1200);
        step.style.fontSize = '1.3em';
        step.style.color = '#fff';
        step.textContent = originalStepText;
        
        // ステップ3: QTE
        step.textContent = '【第三段階】力の集中！';
        gaugeFill.style.width = '100%';
        this.playTone(500, 0.5, 0.15);
        await this.wait(500);
        
        const success = await this.qteManager.start();
        
        // ステップ4: 召喚完了
        if (success) {
            step.textContent = '✨ 召喚成功！ ✨';
            
            // 大フラッシュと衝撃波
            this.flashEffect();
            this.shockwaveEffect();
            this.screenShake();
            
            // 成功音
            this.playTone(800, 0.3, 0.2);
            await this.wait(100);
            this.playTone(1000, 0.5, 0.2);
            
            await this.wait(800);
            
            this.playerMeme.hp += 20;
            this.playerMeme.maxHP += 20;
            this.contextFidelity = 100;
            
            setTimeout(() => {
                this.log('🎉 儀式成功！プレイヤーに先制ボーナス！', 'context-bonus');
            }, 100);
        } else {
            step.textContent = '💥 召喚不完全... 💥';
            
            // 失敗音
            this.playTone(150, 0.5, 0.15);
            
            await this.wait(1000);
            
            // 失敗時の意味不明ボーナス
            const chaos = Math.random();
            if (chaos < 0.3) {
                // なぜかHP増加
                this.playerMeme.hp += 15;
                this.playerMeme.maxHP += 15;
                setTimeout(() => {
                    this.log('💥 儀式失敗...したが謎のHP増加！？', 'context-bonus');
                    this.log('（なんでだよ）', 'normal');
                }, 100);
            } else if (chaos < 0.6) {
                // 鮮度が逆に上昇
                this.playerMeme.freshness = 100;
                setTimeout(() => {
                    this.log('💥 儀式失敗...したが鮮度MAX！？', 'context-bonus');
                    this.log('（理解不能）', 'normal');
                }, 100);
            } else {
                // 普通に失敗
                this.playerMeme.freshness -= 10;
                this.contextFidelity = 70;
                setTimeout(() => {
                    this.log('💥 儀式失敗...初手が不安定に', 'damage');
                }, 100);
            }
        }
        
        overlay.classList.remove('active');
        
        // パーティクルクリア
        particles.innerHTML = '';
    }
    
    createParticles(container) {
        for (let i = 0; i < 80; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 2 + 's';
            particle.style.animationDuration = (1 + Math.random()) + 's';
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
    
    showDamagePopup(damage, target, isCrit = false, isGraze = false, extra = '') {
        const targetElement = document.getElementById(target === 'player' ? 'playerAvatar' : 'enemyAvatar');
        const rect = targetElement.getBoundingClientRect();
        
        const popup = document.createElement('div');
        
        let className = `damage-popup ${target === 'player' ? 'player-damage' : 'enemy-damage'}`;
        let text = `-${damage}`;
        
        if (isCrit) {
            className += ' crit';
            text = `CRITICAL! -${damage}`;
            popup.style.fontSize = '2.5em';
            popup.style.fontWeight = '900';
        } else if (isGraze) {
            className += ' graze';
            text = `カス当たり -${damage}`;
            popup.style.fontSize = '1.2em';
            popup.style.opacity = '0.7';
        } else {
            popup.style.fontSize = '2em';
        }
        
        if (extra) {
            text += `\n${extra}`;
        }
        
        popup.className = className;
        popup.textContent = text;
        popup.style.left = rect.left + rect.width / 2 + 'px';
        popup.style.top = rect.top + 'px';
        
        document.body.appendChild(popup);
        
        setTimeout(() => {
            popup.remove();
        }, isCrit ? 1500 : 1000);
    }
    
    screenShake(intensity = 1) {
        const container = document.querySelector('.game-container');
        container.style.setProperty('--shake-intensity', intensity);
        container.classList.add('screen-shake');
        setTimeout(() => {
            container.classList.remove('screen-shake');
        }, intensity > 1.5 ? 500 : 300);
    }
    
    async hitStop(duration) {
        // ヒットストップをより強く
        return this.wait(duration);
    }
    
    shockwaveEffect() {
        const shockwave = document.getElementById('shockwave');
        shockwave.classList.add('active');
        setTimeout(() => {
            shockwave.classList.remove('active');
        }, 1000);
    }
    
    hitFlash(target) {
        const element = document.getElementById(target === 'player' ? 'playerAvatar' : 'enemyAvatar');
        element.classList.add('hit-flash');
        setTimeout(() => {
            element.classList.remove('hit-flash');
        }, 300);
    }
    
    async hitStop(duration = 100) {
        return new Promise(resolve => setTimeout(resolve, duration));
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
        
        // ネットイベント発動チェック（毎ターン確率）
        if (Math.random() < 0.4) {
            await this.triggerNetEvent();
        }
        
        // 粘着ダメージ処理
        if (this.stickyTurns > 0) {
            this.log(`👻 粘着荒らし継続中...（残り${this.stickyTurns}ターン）`, 'damage');
            this.playerMeme.hp -= 5;
            this.enemyMeme.hp -= 3;
            this.showDamagePopup(5, 'player', false, false);
            this.showDamagePopup(3, 'enemy', false, false);
            await this.wait(400);
            this.stickyTurns--;
        }
        
        // ターンスキップチェック
        if (this.nextTurnSkip) {
            this.log(`━━━ ターン ${this.turn + 1} ━━━`, 'system');
            this.log('⏭️ 鯖落ちの影響でこのターンはスキップされた！', 'damage');
            this.nextTurnSkip = false;
            this.turn++;
            this.updatePhaseIndicator();
            
            if (!this.checkBattleEnd() && this.turn < this.maxTurns) {
                this.playerCommand = null;
                document.querySelectorAll('.command-button').forEach(btn => {
                    btn.classList.remove('selected');
                });
                this.setCommandButtonsEnabled(true);
            }
            return;
        }
        
        // 敵のコマンドをAIで選択
        const enemyCommand = this.selectEnemyCommand();
        
        this.log(`━━━ ターン ${this.turn + 1} ━━━`, 'system');
        this.log(`プレイヤー: ${this.getCommandName(this.playerCommand, this.playerMeme)}`);
        this.log(`敵: ${this.getCommandName(enemyCommand, this.enemyMeme)}`);
        
        // 配信風アイテムランダム発動（15%）
        if (Math.random() < 0.15) {
            await this.triggerStreamItem();
        }
        
        // コマンド解決
        await this.resolveCommands(this.playerCommand, enemyCommand);
        
        // 自己ツッコミログ（カオス）
        if (Math.random() < 0.25) {
            this.addChaosComment();
        }
        
        // ターン終了処理
        this.turn++;
        this.updatePhaseIndicator();
        
        // 文脈再現度の減衰
        this.contextFidelity = Math.max(20, this.contextFidelity - 5);
        this.updateContextFidelity();
        
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
    
    async triggerNetEvent(chainFrom = null) {
        let event;
        
        if (chainFrom) {
            // 連鎖イベント
            event = NET_EVENTS.find(e => e.id === chainFrom);
            if (!event) return;
            
            this.log(`⛓️ 【連鎖】${event.message}`, 'damage');
            this.playTone(600, 0.25, 0.12);
        } else {
            // 通常イベント
            const availableEvents = NET_EVENTS.filter(e => e.prob > 0 && Math.random() < e.prob);
            if (availableEvents.length === 0) return;
            
            event = availableEvents[Math.floor(Math.random() * availableEvents.length)];
            this.log(`🌐 ${event.message}`, 'context-bonus');
            this.playTone(500, 0.2, 0.1);
        }
        
        await this.wait(300);
        
        switch(event.effect) {
            case 'freshness_down':
                this.playerMeme.freshness = Math.max(0, this.playerMeme.freshness - event.value);
                this.enemyMeme.freshness = Math.max(0, this.enemyMeme.freshness - event.value);
                break;
            case 'random_damage':
                if (Math.random() < 0.5) {
                    this.playerMeme.hp -= event.value;
                    this.showDamagePopup(event.value, 'player', false);
                } else {
                    this.enemyMeme.hp -= event.value;
                    this.showDamagePopup(event.value, 'enemy', false);
                }
                break;
            case 'hp_swap':
                const avgHP = (this.playerMeme.hp + this.enemyMeme.hp) / 2;
                this.playerMeme.hp = Math.floor(avgHP);
                this.enemyMeme.hp = Math.floor(avgHP);
                break;
            case 'both_heal':
                this.playerMeme.hp = Math.min(this.playerMeme.maxHP, this.playerMeme.hp + event.value);
                this.enemyMeme.hp = Math.min(this.enemyMeme.maxHP, this.enemyMeme.hp + event.value);
                break;
            case 'quick_damage':
                this.enemyMeme.hp -= event.value;
                this.showDamagePopup(event.value, 'enemy', false);
                break;
            case 'confusion':
                this.nextTurnConfused = true;
                break;
            case 'skip_turn':
                this.nextTurnSkip = true;
                break;
            case 'freshness_chaos':
                this.playerMeme.freshness = Math.max(20, Math.min(100, this.playerMeme.freshness + (Math.random() * 30 - 15)));
                this.enemyMeme.freshness = Math.max(20, Math.min(100, this.enemyMeme.freshness + (Math.random() * 30 - 15)));
                break;
            case 'debuff':
                this.playerBuffs.attack = -event.value;
                break;
            case 'buff':
                this.playerBuffs.attack = event.value;
                break;
            case 'mock':
                this.playerMeme.freshness = Math.max(0, this.playerMeme.freshness - 5);
                break;
            case 'slow':
                this.nextTurnDamageHalf = true;
                break;
            case 'panic':
                this.playerMeme.hp -= 20;
                this.enemyMeme.hp -= 20;
                break;
            case 'grass':
                this.playerBuffs.attack += 5;
                break;
            case 'pile':
                const target = Math.random() < 0.5 ? this.playerMeme : this.enemyMeme;
                target.hp -= event.value;
                break;
            case 'stealth':
                // 次ターンの鮮度消費なし（フラグ管理は省略）
                break;
            case 'expose':
                this.playerMeme.freshness = Math.max(0, this.playerMeme.freshness - 10);
                break;
            case 'spam':
                this.nextTurnConfused = true;
                break;
            case 'bot':
                this.playerMeme.hp -= 8;
                this.enemyMeme.hp -= 8;
                break;
            case 'flame':
                this.playerMeme.hp -= 12;
                this.enemyMeme.hp -= 12;
                break;
            case 'sticky':
                // 粘着荒らし: 3ターン持続ダメージ
                this.stickyTurns = event.value;
                break;
            case 'multi':
                // 連投: 連続3回ダメージ
                this.playerMeme.hp -= 5;
                await this.wait(200);
                this.playerMeme.hp -= 5;
                await this.wait(200);
                this.playerMeme.hp -= 5;
                this.log('連投ダメージ 5×3回！', 'damage');
                break;
            case 'quote':
                // 引用ループ
                this.nextTurnConfused = true;
                this.playerMeme.hp -= 8;
                this.enemyMeme.hp -= 8;
                break;
            case 'pile_on':
                // ネタ被り
                this.playerMeme.freshness = Math.max(0, this.playerMeme.freshness - 20);
                break;
            case 'long':
                // 長文爆撃
                this.playerMeme.hp -= 10;
                break;
            case 'img_spam':
                // 画像連投
                this.playerMeme.freshness -= 15;
                this.enemyMeme.freshness -= 15;
                break;
            case 'trace':
                // IP特定
                this.playerBuffs.attack -= 8;
                break;
            case 'proxy':
                // プロクシ失敗
                this.playerMeme.freshness = Math.max(0, this.playerMeme.freshness - 15);
                break;
        }
        
        this.renderCombatants();
        
        // 連鎖チェック（30%の確率）
        if (event.chain && Math.random() < 0.3) {
            await this.wait(500);
            await this.triggerNetEvent(event.chain);
        }
    }
    
    async triggerStreamItem() {
        const item = STREAM_ITEMS[Math.floor(Math.random() * STREAM_ITEMS.length)];
        this.log(`${item.emoji} ${item.message}`, 'context-bonus');
        this.playTone(800, 0.3, 0.15);
        
        await this.wait(300);
        
        switch(item.effect) {
            case 'hp_heal':
                this.playerMeme.hp = Math.min(this.playerMeme.maxHP, this.playerMeme.hp + item.value);
                break;
            case 'power_boost':
                this.playerBuffs.nextDamageBoost = item.value;
                break;
            case 'freshness_boost':
                this.playerMeme.freshness = Math.min(100, this.playerMeme.freshness + item.value);
                break;
            case 'confusion_enemy':
                this.enemyMeme.freshness = Math.max(0, this.enemyMeme.freshness - 10);
                break;
        }
        
        this.renderCombatants();
    }
    
    addChaosComment() {
        const comments = [
            '（は？）',
            '（なんだこれ...）',
            '（草）',
            '（理解不能）',
            '（どうしてこうなった）',
            '（ワロタ）',
            '（カオス）',
            '（これもうわかんねぇな）',
            '（やべぇよ...やべぇよ...）',
            '（いいぞもっとやれ）'
        ];
        this.log(comments[Math.floor(Math.random() * comments.length)], 'normal');
    }
    
    updateContextFidelity() {
        const valueEl = document.getElementById('contextFidelityValue');
        const bonusEl = document.getElementById('fidelityBonus');
        
        if (valueEl) {
            valueEl.textContent = Math.floor(this.contextFidelity);
            
            // 色変化
            if (this.contextFidelity >= 80) {
                valueEl.style.color = '#00ff88';
            } else if (this.contextFidelity >= 50) {
                valueEl.style.color = '#ffaa00';
            } else {
                valueEl.style.color = '#ff3366';
            }
        }
        
        if (bonusEl) {
            const bonus = (this.contextFidelity - 50) * 0.2;
            bonusEl.textContent = bonus > 0 ? `+${bonus.toFixed(1)}` : bonus.toFixed(1);
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
                this.playTone(600, 0.3, 0.15);
                const qteSuccess = await this.qteManager.start();
                const qteResult = applyQTEBonus(qteSuccess, result.damage);
                finalDamage = qteResult.damage;
                this.log(qteResult.message, qteSuccess ? 'context-bonus' : 'damage');
                if (qteSuccess) {
                    this.playTone(900, 0.4, 0.18);
                    this.screenShake();
                }
            }
            
            // バフ/デバフ適用
            finalDamage += this.playerBuffs.attack;
            finalDamage += this.playerBuffs.nextDamageBoost;
            this.playerBuffs.nextDamageBoost = 0;
            
            // 文脈再現度による補正（±10%）
            const fidelityBonus = (this.contextFidelity - 50) * 0.002;
            finalDamage = Math.floor(finalDamage * (1 + fidelityBonus));
            
            // ダメージ半減チェック
            if (this.nextTurnDamageHalf) {
                finalDamage = Math.floor(finalDamage * 0.5);
                this.log('🌐 ping遅延の影響でダメージ半減！', 'damage');
                this.nextTurnDamageHalf = false;
            }
            
            // コマンド固有ボーナス適用
            if (this.playerMeme.commands && this.playerMeme.commands.attack && this.playerMeme.commands.attack.bonus) {
                finalDamage = Math.floor(finalDamage * this.playerMeme.commands.attack.bonus);
            }
            
            // ユニーク特性適用
            finalDamage = this.applyUniqueTrait(this.playerMeme, 'player', 'attack', finalDamage, playerWasCharged);
            
            finalDamage = Math.max(1, finalDamage);
            
            // ヒット演出（ごりごり強化）
            this.hitFlash('enemy');
            
            // クリティカル/カス当たりで演出変更
            if (result.isCritical) {
                this.playChord([600, 750, 900], 0.3, 0.2);
                await this.hitStop(150); // 長めのヒットストップ
                this.screenShake(2.5); // 強めのシェイク
            } else if (result.isGraze) {
                this.playTone(300, 0.15, 0.08);
                await this.hitStop(30);
            } else {
                this.playTone(400 + finalDamage * 3, 0.15, 0.15);
                await this.hitStop(100);
                this.screenShake(1.5);
            }
            
            this.showDamagePopup(finalDamage, 'enemy', result.isCritical, result.isGraze, result.weirdMessage);
            
            this.enemyMeme.hp -= finalDamage;
            this.playerMeme.freshness -= 5;
            
            this.log(`${this.playerMeme.personality.attackLine}`, 'normal');
            
            // ごりごりログ（詳細表示）
            let dmgLog = '';
            if (result.isCritical) {
                dmgLog = `💥【CRITICAL HIT】💥\n`;
            } else if (result.isGraze) {
                dmgLog = `【カス当たり...】\n`;
            }
            dmgLog += `${this.playerMeme.displayName}の${this.playerMeme.signatureMove}！ ▶ ${finalDamage}ダメージ`;
            this.log(dmgLog, result.isCritical ? 'context-bonus' : 'damage');
            
            // 詳細計算情報
            if (result.matchCount > 0) {
                this.log(`  ┣ 文脈適合 ×${result.matchCount} (+${Math.floor(result.contextBonus * 100)}%)`, 'normal');
            }
            if (result.weirdMessage) {
                this.log(`  ┣ ${result.weirdMessage}`, 'context-bonus');
            }
            if (playerWasCharged) {
                this.log(`  ┣ チャージボーナス (×2.0)`, 'context-bonus');
            }
            if (this.contextFidelity !== 50) {
                const fidelityPercent = ((this.contextFidelity - 50) * 0.2).toFixed(1);
                this.log(`  ┗ 文脈再現度補正 (${fidelityPercent > 0 ? '+' : ''}${fidelityPercent}%)`, 'normal');
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
            this.playTone(700, 0.2, 0.12);
            // ぬるぽ即応特性
            const feintDamage = this.applyUniqueTrait(this.playerMeme, 'player', 'feint_success', 0);
            if (feintDamage > 0) {
                await this.hitStop(60);
                this.hitFlash('enemy');
                this.showDamagePopup(feintDamage, 'enemy', false);
                this.playTone(500, 0.15, 0.1);
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
            
            // コマンド固有ボーナス適用（敵）
            if (this.enemyMeme.commands && this.enemyMeme.commands.attack && this.enemyMeme.commands.attack.bonus) {
                finalDamage = Math.floor(finalDamage * this.enemyMeme.commands.attack.bonus);
            }
            
            // 敵のユニーク特性適用
            finalDamage = this.applyUniqueTrait(this.enemyMeme, 'enemy', 'attack', finalDamage, enemyWasCharged);
            
            // プレイヤーの防御特性適用
            finalDamage = this.applyDefenseTrait(this.playerMeme, finalDamage);
            
            // ヒット演出（ごりごり強化）
            this.hitFlash('player');
            
            if (result.isCritical) {
                this.playChord([500, 650, 800], 0.3, 0.2);
                await this.hitStop(150);
                this.screenShake(2.5);
            } else if (result.isGraze) {
                this.playTone(250, 0.15, 0.08);
                await this.hitStop(30);
            } else {
                this.playTone(350 + finalDamage * 2, 0.15, 0.15);
                await this.hitStop(100);
                this.screenShake(1.5);
            }
            
            this.showDamagePopup(finalDamage, 'player', result.isCritical, result.isGraze, result.weirdMessage);
            
            this.playerMeme.hp -= finalDamage;
            this.enemyMeme.freshness -= 5;
            
            // ごりごりログ
            let enemyDmgLog = '';
            if (result.isCritical) {
                enemyDmgLog = `💥【敵CRITICAL】💥\n`;
            } else if (result.isGraze) {
                enemyDmgLog = `【敵のカス当たり】\n`;
            }
            enemyDmgLog += `${this.enemyMeme.displayName}の攻撃！ ▶ ${finalDamage}ダメージ`;
            this.log(enemyDmgLog, 'damage');
            
            if (result.matchCount > 0) {
                this.log(`  ┣ 敵も文脈適合 ×${result.matchCount} (+${Math.floor(result.contextBonus * 100)}%)`, 'damage');
            }
            if (result.weirdMessage) {
                this.log(`  ┣ ${result.weirdMessage}`, 'damage');
            }
            if (enemyWasCharged) {
                this.log(`  ┗ 敵チャージボーナス (×2.0)`, 'damage');
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
        let selectedCmd;
        if (rand < 0.4) selectedCmd = 'attack';
        else if (rand < 0.7) selectedCmd = 'feint';
        else selectedCmd = 'charge';
        
        // 予兆表示（70%の確率でヒント）
        if (Math.random() < 0.7) {
            this.showPrediction(selectedCmd);
        }
        
        return selectedCmd;
    }
    
    showPrediction(enemyCmd) {
        const panel = document.getElementById('predictionPanel');
        const text = document.getElementById('predictionText');
        const icon = document.getElementById('predictionIcon');
        
        const predictions = {
            attack: [
                { text: '敵の殺気を感じる...攻撃の構えか？', icon: '⚔️', accuracy: 'high' },
                { text: '攻撃態勢に入った気配', icon: '👊', accuracy: 'high' },
                { text: '何か来そう...？（曖昧）', icon: '❓', accuracy: 'low' }
            ],
            feint: [
                { text: '敵が様子をうかがっている...フェイント？', icon: '👁️', accuracy: 'high' },
                { text: 'フェイントの気配を感知', icon: '💨', accuracy: 'high' },
                { text: '動きが読めない...（曖昧）', icon: '🤔', accuracy: 'low' }
            ],
            charge: [
                { text: '敵が力を溜め始めた気配...チャージか？', icon: '⚡', accuracy: 'high' },
                { text: 'チャージの予兆を検知！', icon: '💪', accuracy: 'high' },
                { text: '何か企んでいる...（曖昧）', icon: '🎭', accuracy: 'low' }
            ]
        };
        
        const cmdPredictions = predictions[enemyCmd];
        const selected = cmdPredictions[Math.floor(Math.random() * cmdPredictions.length)];
        
        text.textContent = selected.text;
        icon.textContent = selected.icon;
        
        // 精度が低い場合は40%でミスリード
        if (selected.accuracy === 'low' && Math.random() < 0.4) {
            const wrongCmds = Object.keys(predictions).filter(c => c !== enemyCmd);
            const wrongCmd = wrongCmds[Math.floor(Math.random() * wrongCmds.length)];
            const wrongPrediction = predictions[wrongCmd][0];
            text.textContent = wrongPrediction.text + ' ⚠️誤情報？';
            icon.textContent = '⚠️';
        }
        
        panel.style.display = 'block';
        
        // 4秒後に消す
        setTimeout(() => {
            panel.style.display = 'none';
        }, 4000);
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
        
        // スレまとめ風ログ生成
        const threadSummary = this.generateThreadSummary(result);
        
        switch(result) {
            case 'victory':
                this.continuousWins++;
                this.playVictoryFanfare();
                this.shockwaveEffect();
                resultTitle.textContent = `🎉 Stage ${this.stageNumber} クリア！ 🎉`;
                resultFlavor.innerHTML = `
                    <p style="font-size: 1.1em; color: #00ff88;">${this.playerMeme.catchphrase}</p>
                    <p>${this.playerMeme.flavorWin}</p>
                    <p style="margin-top: 15px;">
                        ${this.playerMeme.displayName}が${this.enemyMeme.displayName}を制した！<br>
                        残りHP: ${Math.max(0, this.playerMeme.hp)} / 鮮度: ${Math.max(0, this.playerMeme.freshness)}%<br>
                        <strong style="color: #ffaa00;">連勝: ${this.continuousWins}回</strong><br>
                        <strong style="color: #00ff88;">称号: ${this.currentTitle}</strong>
                    </p>
                    ${threadSummary}
                    <button id="continueButton" style="margin-top: 20px; padding: 15px 40px; font-size: 1.2em; background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%); border: none; border-radius: 8px; color: #000; font-weight: bold; cursor: pointer;">
                        次のステージへ ➡️
                    </button>
                `;
                
                // 次のステージボタン
                setTimeout(() => {
                    document.getElementById('continueButton').addEventListener('click', () => {
                        this.continueToNextStage();
                    });
                }, 100);
                break;
            case 'defeat':
                this.playDefeatSound();
                resultTitle.textContent = '💥 Game Over 💥';
                resultFlavor.innerHTML = `
                    <p>${this.playerMeme.flavorLose}</p>
                    <p style="margin-top: 15px;">
                        Stage ${this.stageNumber} で敗北...<br>
                        ${this.enemyMeme.displayName}の前に力尽きた...<br>
                        <strong style="color: #ff3366;">最終記録: ${this.continuousWins}連勝</strong>
                    </p>
                    ${threadSummary}
                `;
                break;
            case 'draw':
                resultTitle.textContent = '⚡ 引き分け ⚡';
                resultFlavor.innerHTML = `
                    <p>互いに一歩も引かぬ激戦！</p>
                    <p style="margin-top: 15px;">
                        ${this.playerMeme.displayName}と${this.enemyMeme.displayName}、<br>
                        どちらも譲らぬまま時間切れ！
                    </p>
                    ${threadSummary}
                `;
                break;
        }
    }
    
    generateThreadSummary(result) {
        return `
            <div style="margin-top: 20px; padding: 15px; background: rgba(0, 0, 0, 0.5); border-left: 4px solid #00ff88; border-radius: 5px; text-align: left; font-size: 0.9em;">
                <strong style="color: #00ff88;">【スレまとめ】</strong><br>
                <div style="margin-top: 10px; line-height: 1.6;">
                    1: 名無しさん ${this.getTimestamp()}<br>
                    ${this.playerMeme.displayName}つっよ<br><br>
                    
                    2: 名無しさん ${this.getTimestamp()}<br>
                    ${result === 'victory' ? '余裕の勝利で草' : '負けてて草'}<br><br>
                    
                    3: 名無しさん ${this.getTimestamp()}<br>
                    ${result === 'victory' ? `Stage ${this.stageNumber}クリアおめ` : 'お疲れ様でした'}<br><br>
                    
                    4: 名無しさん ${this.getTimestamp()}<br>
                    ${result === 'victory' ? 'この調子で次もいけ' : 'また挑戦してくれ'}<br><br>
                    
                    5: 名無しさん ${this.getTimestamp()}<br>
                    ${this.continuousWins > 0 ? `${this.continuousWins}連勝は強い` : '(´・ω・｀)'}<br><br>
                </div>
            </div>
        `;
    }
    
    getTimestamp() {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    }
    
    updateTitle() {
        const wins = this.continuousWins;
        if (wins >= 15) this.currentTitle = 'ネット神';
        else if (wins >= 10) this.currentTitle = 'ミーム支配者';
        else if (wins >= 8) this.currentTitle = '伝説のコテハン';
        else if (wins >= 5) this.currentTitle = '有名固定';
        else if (wins >= 3) this.currentTitle = '古参住民';
        else if (wins >= 2) this.currentTitle = '半年ROMった';
        else if (wins >= 1) this.currentTitle = '新参';
        else this.currentTitle = 'ネット初心者';
    }

    async continueToNextStage() {
        this.stageNumber++;
        
        // 称号更新
        this.updateTitle();
        
        // 新しい戦場生成
        this.battlefield = generateRandomBattlefield();
        
        // ボス戦判定
        const bossType = shouldSpawnBoss(this.stageNumber);
        const isBoss = !!bossType;
        
        // 新しい敵召喚
        const enemyTemplate = selectRandomEnemy(this.playerMeme, isBoss, bossType);
        this.enemyMeme = {
            ...enemyTemplate,
            hp: enemyTemplate.baseHP + (this.stageNumber - 1) * 10, // ステージごとに強化
            maxHP: enemyTemplate.baseHP + (this.stageNumber - 1) * 10,
            freshness: 100,
            isBoss: isBoss
        };
        
        // プレイヤーの一部回復
        this.playerMeme.hp = Math.min(this.playerMeme.maxHP, this.playerMeme.hp + 30);
        this.playerMeme.freshness = Math.min(100, this.playerMeme.freshness + 20);
        
        // リセット
        this.turn = 0;
        this.contextFidelity = 90; // 少し下げてスタート
        this.playerCommand = null;
        this.playerCharged = false;
        this.enemyCharged = false;
        this.playerComboCount = 0;
        this.enemyComboCount = 0;
        this.playerBuffs = { attack: 0, nextDamageBoost: 0 };
        this.enemyBuffs = { attack: 0, nextDamageBoost: 0 };
        this.nextTurnConfused = false;
        this.nextTurnSkip = false;
        this.nextTurnDamageHalf = false;
        
        // 画面切り替え
        this.phase = 'battle';
        document.getElementById('resultPhase').classList.remove('active');
        document.getElementById('battlePhase').classList.add('active');
        this.updatePhaseIndicator();
        
        // バトル画面を初期化
        this.renderCombatants();
        this.updateContextFidelity();
        this.updateCommandButtons(this.playerMeme); // コマンドボタン更新
        
        document.getElementById('battleLog').innerHTML = '';
        this.log(`━━━ Stage ${this.stageNumber} 開始！ ━━━`, 'system');
        
        if (isBoss) {
            this.log(`👑 【BOSS BATTLE】 👑`, 'damage');
            this.playChord([400, 500, 600], 0.3, 0.15);
        }
        
        this.log(`${this.playerMeme.displayName} VS ${this.enemyMeme.displayName}`);
        this.log(`称号：${this.currentTitle}`, 'context-bonus');
        this.log(`戦場：${this.battlefield.name}`);
        
        if (isBoss) {
            this.log(`${this.enemyMeme.lore}`, 'damage');
        }
        
        this.log(`敵が強化されている！（HP+${(this.stageNumber - 1) * 10}）`, 'damage');
        
        this.setCommandButtonsEnabled(true);
    }

    log(message, type = 'normal') {
        const logContainer = document.getElementById('battleLog');
        const entry = document.createElement('div');
        entry.className = 'log-entry ' + type;
        entry.textContent = message;
        logContainer.appendChild(entry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    getCommandName(command, meme) {
        // MEME固有のコマンド名を返す
        if (meme && meme.commands && meme.commands[command]) {
            return meme.commands[command].name;
        }
        
        // フォールバック（汎用名）
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
                
            case 'rage_mode':
                // キーボードクラッシャー: HP50%以下で攻撃力+50%
                if (action === 'attack' && meme.id === 'keyboard' && meme.hp <= meme.maxHP * 0.5) {
                    const bonus = Math.floor(damage * 0.5);
                    this.log(`${meme.displayName}の激怒！`, 'context-bonus');
                    return damage + bonus;
                }
                break;
                
            case 'movement_heal':
                // Nyan Cat: 攻撃するたびに鮮度+2
                if (action === 'attack' && meme.id === 'nyancat') {
                    meme.freshness = Math.min(100, meme.freshness + 2);
                    this.log('Nyan~ 虹の軌跡！', 'context-bonus');
                }
                break;
                
            case 'laugh_debuff':
                // ワロタ: 攻撃命中時、敵の鮮度-5
                if (action === 'attack' && meme.id === 'warota') {
                    const target = side === 'player' ? this.enemyMeme : this.playerMeme;
                    target.freshness = Math.max(0, target.freshness - 5);
                    this.log('草生やして相手を動揺させた！www', 'context-bonus');
                }
                break;
                
            case 'impostor_fake':
                // Among Us: フェイント使用時、25%で攻撃に変化
                if (action === 'feint' && meme.id === 'amongus' && Math.random() < 0.25) {
                    this.log('impostorだった！実は攻撃！', 'context-bonus');
                    const target = side === 'player' ? this.enemyMeme : this.playerMeme;
                    const sneakDamage = Math.floor(meme.basePower * 0.8);
                    target.hp -= sneakDamage;
                    this.showDamagePopup(sneakDamage, side === 'player' ? 'enemy' : 'player', false);
                }
                break;
                
            case 'rare_dodge':
                // Pepe: 毎ターン10%で完全回避（攻撃受ける時にチェック）
                if (action === 'defend' && meme.id === 'pepe' && Math.random() < 0.1) {
                    this.log('rare pepe発動！完全回避！', 'context-bonus');
                    return 0;
                }
                break;
                
            case 'ascension':
                // Galaxy Brain: チャージ3回で攻撃力2倍
                if (action === 'attack' && meme.id === 'brain') {
                    const chargeCount = side === 'player' ? this.playerComboCount : this.enemyComboCount;
                    if (chargeCount >= 3) {
                        this.log('次元上昇！galaxy brain！', 'context-bonus');
                        return damage * 2;
                    }
                }
                break;
                
            case 'stonks_random':
                // Stonks: ダメージが±30%でランダム変動
                if (action === 'attack' && meme.id === 'stonks') {
                    const variance = 0.7 + Math.random() * 0.6; // 0.7 ~ 1.3
                    const newDamage = Math.floor(damage * variance);
                    if (variance > 1.0) {
                        this.log('stonks↗️ ボラティリティ！', 'context-bonus');
                    } else {
                        this.log('not stonks↘️', 'damage');
                    }
                    return newDamage;
                }
                break;
                
            case 'ratio_counter':
                // Ratio: 敵の攻撃後、反撃ダメージ+10
                if (action === 'counter' && meme.id === 'ratio') {
                    return 10;
                }
                break;
                
            case 'dramatic_crit':
                // Dramatic: 攻撃時50%でクリティカル判定
                if (action === 'attack' && meme.id === 'chipmunk' && Math.random() < 0.5) {
                    this.log('*dramatic sound* クリティカル！', 'context-bonus');
                    return Math.floor(damage * 1.5);
                }
                break;
                
            case 'desperate':
                // オワタ式: HP20%以下で攻撃力+100%
                if (action === 'attack' && meme.id === 'owata' && meme.hp <= meme.maxHP * 0.2) {
                    this.log('＼(^o^)／オワタ→起死回生！', 'context-bonus');
                    return damage * 2;
                }
                break;
                
            case 'debate_combo':
                // 指さし論争: フェイント後の攻撃が+50%
                if (action === 'attack' && meme.id === 'woman_cat') {
                    // フェイント成功フラグがあれば（簡易実装）
                    const comboCount = side === 'player' ? this.playerComboCount : this.enemyComboCount;
                    if (comboCount === 0) { // フェイント直後
                        this.log('論破！', 'context-bonus');
                        return Math.floor(damage * 1.5);
                    }
                }
                break;
                
            case 'finisher':
                // Coffin Dance: 敵HP50%以下で攻撃力+40%
                if (action === 'attack' && meme.id === 'coffin') {
                    const target = side === 'player' ? this.enemyMeme : this.playerMeme;
                    if (target.hp <= target.maxHP * 0.5) {
                        this.log('Astronomia♪ フィニッシャー！', 'context-bonus');
                        return Math.floor(damage * 1.4);
                    }
                }
                break;
                
            case 'empathy_damage':
                // Wojak: 敵が鮮度50%以下の時、ダメージ+30%
                if (action === 'attack' && meme.id === 'wojak') {
                    const target = side === 'player' ? this.enemyMeme : this.playerMeme;
                    if (target.freshness <= 50) {
                        this.log('I know that feel...', 'context-bonus');
                        return Math.floor(damage * 1.3);
                    }
                }
                break;
                
            case 'success_buff':
                // 成功キッズ: 攻撃成功時、次ターン攻撃力+8
                if (action === 'attack' && meme.id === 'success_kid') {
                    if (side === 'player') {
                        this.playerBuffs.attack += 8;
                    } else {
                        this.enemyBuffs.attack += 8;
                    }
                    this.log('Success! ガッツポーズ！', 'context-bonus');
                }
                break;
                
            case 'random_target':
                // 気が散る構図: ランダムで攻撃対象切り替え
                if (action === 'attack' && meme.id === 'distracted' && Math.random() < 0.15) {
                    this.log('気が散った！攻撃方向が変わった！', 'damage');
                    // ダメージを半減して自分にも当たる（簡易実装）
                    meme.hp -= Math.floor(damage * 0.3);
                    return Math.floor(damage * 0.7);
                }
                break;
                
            case 'swarm':
                // ソニックファン: 攻撃時25%で2回攻撃
                if (action === 'attack' && meme.id === 'knuckles' && Math.random() < 0.25) {
                    this.log('click click click! 群れで攻撃！', 'context-bonus');
                    const target = side === 'player' ? this.enemyMeme : this.playerMeme;
                    target.hp -= Math.floor(damage * 0.5);
                    this.showDamagePopup(Math.floor(damage * 0.5), side === 'player' ? 'enemy' : 'player', false);
                }
                break;
                
            case 'pattern':
                // NPC顔: 同じコマンドを3回繰り返すと威力2倍
                if (action === 'attack' && meme.id === 'npc') {
                    // 簡易実装: コンボカウントで判定
                    const comboCount = side === 'player' ? this.playerComboCount : this.enemyComboCount;
                    if (comboCount >= 3) {
                        this.log('*scripted response* プログラム完了！', 'context-bonus');
                        return damage * 2;
                    }
                }
                break;
                
            case 'protagonist':
                // やる夫: HP50%以下で全能力+25%
                if (meme.id === 'yaruo' && meme.hp <= meme.maxHP * 0.5) {
                    this.log('やる夫の主人公補正！', 'context-bonus');
                    return Math.floor(damage * 1.25);
                }
                break;
                
            case 'versatile':
                // 淫夢語録: すべてのコマンドで+10%
                if (meme.id === 'inmu') {
                    return Math.floor(damage * 1.1);
                }
                break;
                
            case 'grass_heal':
                // ネット草原: 攻撃を受けると10%でHP+5
                if (side !== 'player' && action === 'defend' && Math.random() < 0.1) {
                    meme.hp = Math.min(meme.maxHP, meme.hp + 5);
                    this.log('草生えてHP回復！', 'context-bonus');
                }
                break;
                
            case 'troll_dodge':
                // Troll Face: 敵の攻撃を15%で無効化
                if (action === 'defend' && Math.random() < 0.15) {
                    this.log('Problem? トロール回避！', 'context-bonus');
                    return 0; // ダメージ無効化のマーカー
                }
                break;
                
            case 'endure':
                // Forever Alone: 残りHP1でも必ず1ターン生き残る
                if (meme.id === 'forever_alone' && meme.hp <= 1) {
                    this.log('Forever alone...but not dead yet', 'context-bonus');
                    meme.hp = 1;
                }
                break;
                
            case 'pain_convert':
                // Harold: 被ダメージの25%を次ターン攻撃に転換
                if (action === 'defend' && meme.id === 'harold') {
                    const buff = Math.floor(damage * 0.25);
                    if (side === 'player') {
                        this.playerBuffs.attack += buff;
                    } else {
                        this.enemyBuffs.attack += buff;
                    }
                    this.log('痛みを力に変えた！', 'context-bonus');
                }
                break;
                
            // ボス特性
            case 'boss_charisma':
                // 伝説のスレ主: 毎ターン攻撃力+3
                if (meme.id === 'thread_master') {
                    if (side === 'enemy') {
                        this.enemyBuffs.attack += 3;
                    }
                    this.log('スレ主のカリスマ！攻撃力上昇', 'damage');
                }
                break;
                
            case 'boss_devastate':
                // 荒らし王: 攻撃時、敵の鮮度を追加で-10
                if (action === 'attack' && meme.id === 'troll_king') {
                    const target = side === 'player' ? this.enemyMeme : this.playerMeme;
                    target.freshness = Math.max(0, target.freshness - 10);
                    this.log('荒廃の力！鮮度低下', 'damage');
                }
                break;
                
            case 'boss_omnipotent':
                // ミーム神: 全属性のタグと一致（常に最大ボーナス）
                if (meme.id === 'meme_god') {
                    this.log('ミーム神の全能！', 'context-bonus');
                    return Math.floor(damage * 1.5);
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
