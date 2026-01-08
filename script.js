// リールの種類（画像にする場合は 'img/1.png' 等に変更可能）
const SYMBOLS = ["🍒", "🍉", "🔔", "💎", "⭐", "7️⃣"];
let coins = 100;
let isSpinning = false;

const spinBtn = document.getElementById("spin-btn");
const coinText = document.getElementById("coin-count");
const msgText = document.getElementById("msg");

// リール要素を取得
const reelEls = [
    document.getElementById("reel0"),
    document.getElementById("reel1"),
    document.getElementById("reel2")
];

spinBtn.addEventListener("click", () => {
    if (coins < 10 || isSpinning) return;

    // 初期化
    coins -= 10;
    updateUI();
    isSpinning = true;
    spinBtn.disabled = true;
    msgText.innerText = "抽選中...";

    // アニメーション開始（200msごとにシンボル変更）
    const timers = reelEls.map((el) => {
        return setInterval(() => {
            el.innerText = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        }, 200);
    });

    // 3秒後に停止
    setTimeout(() => {
        timers.forEach(t => clearInterval(t));
        determineResult();
    }, 3000);
});

function determineResult() {
    isSpinning = false;
    const results = reelEls.map(el => el.innerText);
    const [a, b, c] = results;

    let payout = 0;
    let rankName = "";

    if (a === b && b === c) {
        if (a === "7️⃣") { payout = 200; rankName = "JACKPOT!!"; }
        else if (a === "💎") { payout = 100; rankName = "DIAMOND WIN"; }
        else { payout = 50; rankName = "BIG WIN"; }
    } else if (a === b || b === c || a === c) {
        payout = 15;
        rankName = "REGULAR WIN";
    }

    if (payout > 0) {
        coins += payout;
        showWin(rankName, payout);
    } else {
        msgText.innerText = (coins <= 0) ? "GAME OVER (コイン不足)" : "ハズレ！もう一度？";
        if (coins > 0) spinBtn.disabled = false;
    }
    updateUI();
}

function updateUI() {
    coinText.innerText = coins;
}

function showWin(name, amount) {
    document.getElementById("win-name").innerText = name;
    document.getElementById("win-coins").innerText = `+${amount} COINS!`;
    document.getElementById("win-overlay").classList.remove("hidden");
}

function closeWin() {
    document.getElementById("win-overlay").classList.add("hidden");
    if (coins > 0) {
        spinBtn.disabled = false;
        msgText.innerText = "次のスピン！";
    }
}