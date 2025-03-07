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
const colors = [
    "#6b48ff", // Vibrant purple
    "#00ddeb", // Bright cyan
    "#ff9966", // Peach
    "#ffe066", // Warm yellow
    "#48ffbd", // Mint green
    "#ff66cc", // Hot pink
    "#9966ff", // Soft purple
    "#ffcc99"  // Light peach
];
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
let shareClickCount = 0;
let hasSpun = localStorage.getItem("hasSpun") === "true";
let redirectCount = 0;

// Ensure sections are hidden on load and load popunder/social bar ads
document.addEventListener("DOMContentLoaded", () => {
    claimSection.classList.add("hidden");
    shareSection.classList.add("hidden");

    const popunderScript = document.createElement("script");
    popunderScript.type = "text/javascript";
    popunderScript.src = "//pl25965610.effectiveratecpm.com/eb/b3/c4/ebb3c4d3b3ef54494fd4b0508791869a.js";
    document.body.appendChild(popunderScript);

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
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < prizes.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = colors[i];
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, i * arc, (i + 1) * arc);
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.save();
        ctx.fillStyle = ["#ffe066", "#ffcc99", "#48ffbd"].includes(colors[i]) ? "#2d3748" : "#fff"; // Dark text for light backgrounds
        ctx.font = `bold ${radius * 0.12}px 'Poppins', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.translate(radius, radius);
        ctx.rotate(i * arc + arc / 2);

        const maxWidth = radius * 0.6;
        const words = prizes[i].split(" ");
        let line1 = "", line2 = "";
        let currentLine = "";
        for (let word of words) {
            const testLine = currentLine + word + " ";
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && currentLine !== "") {
                if (line1 === "") line1 = currentLine.trim();
                else line2 = currentLine.trim();
                currentLine = word + " ";
            } else {
                currentLine = testLine;
            }
        }
        if (line1 === "") line1 = currentLine.trim();
        else if (line2 === "") line2 = currentLine.trim();

        const lineHeight = radius * 0.15;
        if (line2) {
            ctx.fillText(line1, radius * 0.55, -lineHeight / 2);
            ctx.fillText(line2, radius * 0.55, lineHeight / 2);
        } else {
            ctx.fillText(line1, radius * 0.55, 0);
        }
        ctx.restore();
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
        const spinDuration = 3000;
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
            if (spinTime >= spinDuration) {
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

// Claim and Share logic
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

shareBtn.addEventListener("click", () => {
    shareClickCount++;
    if (shareCounter < 10) {
        shareCounter++;
        shareCount.textContent = shareCounter;
        const shareText = encodeURIComponent("I just won an amazing prize on Spin & Win! Try it: https://earnwithlink.xyz");
        window.open(`https://wa.me/?text=${shareText}`, "_blank");

        // Show ad only on 3rd click
        if (shareClickCount === 3) {
            window.open(directLinkAd, "_blank");
        }
    }
});

// Initial setup
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
