const reels = document.querySelectorAll(".reel");
const spinButton = document.querySelector(".spin_btn");
const messageDisplay = document.querySelector(".message");
const balanceDisplay = document.querySelector(".balance");
const reelSound = document.getElementById("reelSound");
const winSound = document.getElementById("winSound");

let balance = 1000;
let betAmount = 10;
let spinning = false;

// Initial state for each reel
let reelStates = [
    ["🍒", "🔔", "🍋", "🍉", "⭐", "7️⃣"],
    ["7️⃣", "🍒", "🔔", "🍋", "🍉", "⭐"],
    ["⭐", "7️⃣", "🍒", "🔔", "🍋", "🍉"]
];

function initReels() {
    reels.forEach((reel, i) => updateReelDOM(reel, i));
}

function updateReelDOM(reel, index) {
    reel.innerHTML = "";
    reelStates[index].forEach(symbol => {
        const div = document.createElement("div");
        div.className = "symbol";
        div.textContent = symbol;
        reel.appendChild(div);
    });
}

function spin() {
    if (spinning || balance < betAmount) {
        if (balance < betAmount) alert("Refill your wallet!");
        return;
    }

    spinning = true;
    balance -= betAmount;
    balanceDisplay.textContent = `Balance: $${balance}`;
    messageDisplay.textContent = "Spinning...";
    reelSound.play();

    reels.forEach((reel, i) => {
        let currentSpin = 0;
        const totalSpins = 15 + Math.floor(Math.random() * 10);
        
        const interval = setInterval(() => {
            // Cycle the array
            reelStates[i].push(reelStates[i].shift());
            updateReelDOM(reel, i);
            currentSpin++;

            if (currentSpin >= totalSpins) {
                clearInterval(interval);
                if (i === reels.length - 1) finishSpin();
            }
        }, 60 + (i * 30)); // Each reel spins slightly slower
    });
}

function finishSpin() {
    spinning = false;
    reelSound.pause();
    reelSound.currentTime = 0;
    checkWin();
}

function checkWin() {
    // We check Index 1 because it's the middle symbol in our 210px (3-symbol) reel
    const results = reelStates.map(reel => reel[1]);
    const isMatch = results[0] === results[1] && results[1] === results[2];

    if (isMatch) {
        const prize = betAmount * 10;
        balance += prize;
        winSound.play();
        messageDisplay.textContent = `WINNER! +$${prize}`;
    } else {
        messageDisplay.textContent = "Try Again!";
    }
    balanceDisplay.textContent = `Balance: $${balance}`;
}

spinButton.addEventListener("click", spin);
initReels();
