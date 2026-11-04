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
    }

    init() {
        this.container = document.getElementById('qteContainer');
        this.timerDisplay = document.getElementById('qteTimer');
        
        // キー入力リスナー
        document.addEventListener('keydown', (e) => {
            if (this.active && e.code === 'Space' && !this.keyPressed) {
                this.keyPressed = true;
                this.handleKeyPress();
            }
        });
    }

    start(callback) {
        return new Promise((resolve) => {
            this.active = true;
            this.success = false;
            this.keyPressed = false;
            this.startTime = Date.now();
            this.callback = resolve;
            
            // UI表示
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
