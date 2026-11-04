// QTE（クイックタイムイベント）システム

class QTEManager {
    constructor() {
        this.active = false;
        this.success = false;
        this.timeLimit = 3000; // 3秒
        this.startTime = 0;
        this.keyPressed = false;
        this.callback = null;
        
        this.container = null;
        this.timerDisplay = null;
        this.updateInterval = null;
        
        // 連打QTE用
        this.pressCount = 0;
        this.targetPresses = 0;
        
        // タイミングバーQTE用
        this.barPosition = 0;
        this.barDirection = 1;
        
        // 左右QTE用
        this.qteType = 'normal'; // normal, mash, timing, direction
        this.requiredKey = null;
    }

    init() {
        this.container = document.getElementById('qteContainer');
        this.timerDisplay = document.getElementById('qteTimer');
        
        // キー入力リスナー（全種対応）
        document.addEventListener('keydown', (e) => {
            if (!this.active) return;
            
            switch(this.qteType) {
                case 'normal':
                    if (e.code === 'Space' && !this.keyPressed) {
                        this.keyPressed = true;
                        this.handleKeyPress();
                    }
                    break;
                case 'mash':
                    if (e.code === 'Space') {
                        this.pressCount++;
                        this.updateMashDisplay();
                    }
                    break;
                case 'timing':
                    if (e.code === 'Space') {
                        this.handleTimingPress();
                    }
                    break;
                case 'direction':
                    if (e.code === this.requiredKey) {
                        this.finish(true);
                    }
                    break;
            }
        });
    }

    start(callback) {
        // ランダムでQTE種類を選択
        const types = ['normal', 'mash', 'timing', 'direction'];
        this.qteType = types[Math.floor(Math.random() * types.length)];
        
        switch(this.qteType) {
            case 'normal':
                return this.startNormalQTE();
            case 'mash':
                return this.startMashQTE();
            case 'timing':
                return this.startTimingQTE();
            case 'direction':
                return this.startDirectionQTE();
        }
    }
    
    startNormalQTE() {
        return new Promise((resolve) => {
            this.active = true;
            this.success = false;
            this.keyPressed = false;
            this.startTime = Date.now();
            this.callback = resolve;
            
            // UI表示
            document.getElementById('qteTitle').textContent = 'タイミング QTE!';
            document.getElementById('qteKey').textContent = 'SPACE';
            this.container.classList.add('active');
            
            // タイマー更新
            this.updateInterval = setInterval(() => {
                this.updateTimer();
            }, 50);
            
            // タイムアウト
            setTimeout(() => {
                if (this.active) {
                    this.finish(false);
                }
            }, this.timeLimit);
        });
    }
    
    startMashQTE() {
        return new Promise((resolve) => {
            this.active = true;
            this.pressCount = 0;
            this.targetPresses = 15 + Math.floor(Math.random() * 10); // 15-24回
            this.startTime = Date.now();
            this.callback = resolve;
            this.timeLimit = 3000;
            
            // UI表示
            document.getElementById('qteTitle').textContent = '連打 QTE!';
            document.getElementById('qteKey').innerHTML = `SPACE<br><small>${this.pressCount}/${this.targetPresses}</small>`;
            this.container.classList.add('active');
            
            // タイマー更新
            this.updateInterval = setInterval(() => {
                this.updateTimer();
            }, 50);
            
            // タイムアウト
            setTimeout(() => {
                if (this.active) {
                    const success = this.pressCount >= this.targetPresses;
                    this.finish(success);
                }
            }, this.timeLimit);
        });
    }
    
    startTimingQTE() {
        return new Promise((resolve) => {
            this.active = true;
            this.barPosition = 0;
            this.barDirection = 1;
            this.startTime = Date.now();
            this.callback = resolve;
            this.timeLimit = 4000;
            
            // UI表示
            document.getElementById('qteTitle').textContent = 'バータイミング QTE!';
            document.getElementById('qteKey').innerHTML = '<div id="timingBar" style="width: 100%; height: 20px; background: rgba(255,255,255,0.2); border-radius: 5px; position: relative; margin-top: 10px;"><div id="timingCursor" style="position: absolute; left: 0%; width: 10px; height: 100%; background: #00ff88;"></div><div style="position: absolute; left: 40%; width: 20%; height: 100%; background: rgba(255,170,0,0.5);"></div></div><small>タイミングよくSPACE!</small>';
            this.container.classList.add('active');
            
            // バー移動
            this.updateInterval = setInterval(() => {
                this.barPosition += this.barDirection * 2;
                if (this.barPosition >= 100) {
                    this.barPosition = 100;
                    this.barDirection = -1;
                } else if (this.barPosition <= 0) {
                    this.barPosition = 0;
                    this.barDirection = 1;
                }
                
                const cursor = document.getElementById('timingCursor');
                if (cursor) {
                    cursor.style.left = this.barPosition + '%';
                }
            }, 30);
            
            // タイムアウト
            setTimeout(() => {
                if (this.active) {
                    this.finish(false);
                }
            }, this.timeLimit);
        });
    }
    
    startDirectionQTE() {
        return new Promise((resolve) => {
            this.active = true;
            this.startTime = Date.now();
            this.callback = resolve;
            this.timeLimit = 2500;
            
            // ランダムでキー選択
            const keys = [
                { code: 'ArrowLeft', display: '← 左' },
                { code: 'ArrowRight', display: '右 →' }
            ];
            const selected = keys[Math.floor(Math.random() * keys.length)];
            this.requiredKey = selected.code;
            
            // UI表示
            document.getElementById('qteTitle').textContent = '方向 QTE!';
            document.getElementById('qteKey').innerHTML = `<span style="font-size: 2em;">${selected.display}</span>`;
            this.container.classList.add('active');
            
            // タイマー更新
            this.updateInterval = setInterval(() => {
                this.updateTimer();
            }, 50);
            
            // タイムアウト
            setTimeout(() => {
                if (this.active) {
                    this.finish(false);
                }
            }, this.timeLimit);
        });
    }

    updateTimer() {
        const elapsed = Date.now() - this.startTime;
        const remaining = Math.max(0, (this.timeLimit - elapsed) / 1000);
        this.timerDisplay.textContent = remaining.toFixed(1);
    }
    
    updateMashDisplay() {
        const keyDisplay = document.getElementById('qteKey');
        if (keyDisplay) {
            keyDisplay.innerHTML = `SPACE<br><small>${this.pressCount}/${this.targetPresses}</small>`;
        }
    }

    handleKeyPress() {
        if (!this.active) return;
        
        const elapsed = Date.now() - this.startTime;
        const timing = elapsed / this.timeLimit;
        
        // タイミング判定
        // 0.0 ~ 1.0の範囲で、早すぎても遅すぎてもダメ
        // 0.3 ~ 0.7の範囲が成功
        const success = timing >= 0.3 && timing <= 0.7;
        
        this.finish(success);
    }
    
    handleTimingPress() {
        if (!this.active) return;
        
        // バーの位置で判定
        // 40-60の範囲が成功
        const success = this.barPosition >= 40 && this.barPosition <= 60;
        
        this.finish(success);
    }

    finish(success) {
        this.active = false;
        this.success = success;
        
        clearInterval(this.updateInterval);
        this.container.classList.remove('active');
        
        if (this.callback) {
            this.callback(success);
        }
    }

    // マッシュQTEのバリエーション（将来用）
    startMashQTE(targetPresses, timeLimit) {
        // 連打QTE（将来実装用）
        return Promise.resolve(false);
    }
}

// QTE結果の効果
function applyQTEBonus(success, baseDamage) {
    if (success) {
        return {
            damage: Math.floor(baseDamage * 1.5), // 1.5倍
            bonus: 0.5,
            message: 'QTE成功！ダメージ1.5倍！'
        };
    } else {
        return {
            damage: Math.floor(baseDamage * 0.7), // 0.7倍
            bonus: -0.3,
            message: 'QTE失敗...ダメージ減少'
        };
    }
}
