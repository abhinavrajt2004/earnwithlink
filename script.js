const prizes = [
    "iPhone 15 Pro", 
    "₹10,000 Cash", 
    "JBL Headphones", 
    "Smart Watch", 
    "OnePlus Nord 4", 
    "₹5,000 Amazon Voucher", 
    "Bluetooth Speaker", 
    "Try Again!"
];
const colors = ["#3182ce", "#38b2ac", "#ed8936", "#f6ad55", "#ffffff", "#63b3ed", "#bee3f8", "#e2e8f0"];
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spin-btn");
const result = document.getElementById("result");
const claimSection = document.getElementById("claim-section");
const prizeWon = document.getElementById("prize-won");
const claimBtn = document.getElementById("claim-btn");
const shareSection = document.getElementById("share-section");
const shareBtn = document.getElementById("share-btn");
const shareCount = document.getElementById("share-count");

// Ad link
const directLinkAd = "https://www.effectiveratecpm.com/ihhrqh2yux?key=fcd03f4baba6b3ecafd920598c3a0aaa";

let currentAngle = 0;
let spinning = false;
let shareCounter = 0;
let hasSpun = localStorage.getItem("hasSpun") === "true";
let redirectCount = 0;

// Ensure sections are hidden on load and load popunder/social bar ads
document.addEventListener("DOMContentLoaded", () => {
    claimSection.classList.add("hidden");
    shareSection.classList.add("hidden");

    // Dynamically add popunder ad script
    const popunderScript = document.createElement("script");
    popunderScript.type = "text/javascript";
    popunderScript.src = "//pl25965610.effectiveratecpm.com/eb/b3/c4/ebb3c4d3b3ef54494fd4b0508791869a.js";
    document.body.appendChild(popunderScript);

    // Dynamically add social bar ad script
    const socialBarScript = document.createElement("script");
    socialBarScript.type = "text/javascript";
    socialBarScript.src = "//pl25965846.effectiveratecpm.com/42/40/c5/4240c53016db5464708fa409416b78e4.js";
    document.body.appendChild(socialBarScript);
});

// Resize canvas
function resizeCanvas() {
    const size = Math.min(window.innerWidth * 0.8, 400);
    canvas.width = size;
    canvas.height = size;
    drawWheel();
}

// Draw the wheel
function drawWheel() {
    const arc = (2 * Math.PI) / prizes.length;
    const radius = canvas.width / 2;
    for (let i = 0; i < prizes.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = colors[i];
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, i * arc, (i + 1) * arc);
        ctx.fill();
        ctx.fillStyle = colors[i] === "#ffffff" || colors[i] === "#e2e8f0" || colors[i] === "#bee3f8" ? "#333" : "#fff";
        ctx.font = `${radius * 0.08}px 'Roboto'`;
        ctx.textAlign = "center";
        ctx.fillText(prizes[i], radius + Math.cos(i * arc + arc / 2) * (radius * 0.65), radius + Math.sin(i * arc + arc / 2) * (radius * 0.65));
    }
}

// Spin logic
if (hasSpun) {
    spinBtn.disabled = true;
    spinBtn.textContent = "You’ve Already Spun!";
}

spinBtn.addEventListener("click", () => {
    if (!spinning && !hasSpun) {
        spinning = true;
        spinBtn.disabled = true;
        let spinAngle = Math.random() * 360 + 720;
        let spinTime = 0;
        const spinInterval = setInterval(() => {
            currentAngle = (currentAngle + 10) % 360;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((currentAngle * Math.PI) / 180);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
            drawWheel();
            ctx.restore();
            spinTime += 10;
            if (spinTime >= 3000) {
                clearInterval(spinInterval);
                const adjustedAngle = (currentAngle % 360 + 360) % 360;
                const prizeIndex = Math.floor((adjustedAngle + 45) / (360 / prizes.length)) % prizes.length;
                const wonPrize = prizes[prizeIndex];
                result.textContent = `You Won: ${wonPrize}`;
                result.classList.remove("hidden");
                claimSection.classList.remove("hidden");
                prizeWon.textContent = wonPrize;
                spinning = false;
                hasSpun = true;
                localStorage.setItem("hasSpun", "true");
                spinBtn.textContent = "You’ve Already Spun!";
            }
        }, 10);
    }
});

// Claim button - redirect with direct link ad and show share section
claimBtn.addEventListener("click", () => {
    if (redirectCount === 0) {
        window.open(directLinkAd, "_blank");
        redirectCount++;
        localStorage.removeItem("hasSpun");
        hasSpun = false;
        spinBtn.disabled = false;
        spinBtn.textContent = "Spin Again!";
    }
    claimSection.classList.add("hidden");
    shareSection.classList.remove("hidden");
});

// Share button - redirect on first press and after 5 shares with direct link ad
shareBtn.addEventListener("click", () => {
    if (shareCounter === 0 && redirectCount === 1) {
        window.open(directLinkAd, "_blank");
        redirectCount++;
    }
    if (shareCounter < 10) {
        shareCounter++;
        shareCount.textContent = shareCounter;
        const shareText = encodeURIComponent("I just won an amazing prize on Spin & Win! Try it: [Your Website URL]");
        window.open(`https://wa.me/?text=${shareText}`, "_blank");
        if (shareCounter === 5) {
            window.open(directLinkAd, "_blank");
        }
    }
});

// Initial setup
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
