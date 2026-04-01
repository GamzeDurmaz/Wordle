import { words } from './words.js';

// Artık words dizisini kullanabilirsin
const SECRET_WORD = words[Math.floor(Math.random() * words.length)].toLocaleUpperCase('tr-TR');
let attempts = 0;
let currentGuess = "";
const board = document.getElementById("game-board");

// 1. Board'u oluştur (6 satır, 5 sütun)
for (let i = 0; i < 30; i++) {
    let tile = document.createElement("div");
    tile.classList.add("tile");
    tile.setAttribute("id", "tile-" + i);
    board.appendChild(tile);
}

// 2. Klavye girişini dinle
document.addEventListener("keydown", (e) => {
    if (attempts >= 6) return;

    if (e.key === "Enter" && currentGuess.length === 5) {
        checkGuess();
    } else if (e.key === "Backspace") {
        currentGuess = currentGuess.slice(0, -1);
        updateBoard();
    } else if (currentGuess.length < 5 && /^[a-zA-ZçğıöşüÇĞİÖŞÜİı]$/.test(e.key)) {
        // İngilizce toUpperCase() "i"yi "I" yapar. 
        // Türkçe için toLocaleUpperCase('tr-TR') kullanmalıyız.
        currentGuess += e.key.toLocaleUpperCase('tr-TR');
        updateBoard();
    }
});

function updateBoard() {
    for (let i = 0; i < 5; i++) {
        let tile = document.getElementById("tile-" + (attempts * 5 + i));
        tile.innerText = currentGuess[i] || "";
    }
}

function checkGuess() {
    const rowTiles = [];
    for (let i = 0; i < 5; i++) {
        rowTiles.push(document.getElementById("tile-" + (attempts * 5 + i)));
    }

    const guessArray = currentGuess.split("");
    const secretArray = SECRET_WORD.split("");
    const statuses = Array(5).fill("absent"); // Varsayılan hepsi gri

    // 1. AŞAMA: Önce Yeşilleri (Doğru yer) belirle
    guessArray.forEach((letter, i) => {
        if (letter === secretArray[i]) {
            statuses[i] = "correct";
            secretArray[i] = null; // Bu harfi kullandık, bir daha sarı yapma
        }
    });

    // 2. AŞAMA: Sonra Sarı ve Grileri belirle
    guessArray.forEach((letter, i) => {
        if (statuses[i] !== "correct") { // Zaten yeşil değilse bak
            const letterIndex = secretArray.indexOf(letter);
            if (letterIndex !== -1) {
                statuses[i] = "present"; // Kelimede var ama yeri yanlış
                secretArray[letterIndex] = null; // Bu örneği de kullandık
            } else {
                statuses[i] = "absent"; // Kelimede yok veya tüm örnekleri tükendi
            }
        }
    });

    // Renkleri kutucuklara uygula
    statuses.forEach((status, i) => {
        rowTiles[i].classList.add(status);
    });

    // Oyun Sonu Kontrolü
    if (currentGuess === SECRET_WORD) {
        document.getElementById("message").innerText = "Tebrikler! 🎉";
        attempts = 6; 
    } else {
        attempts++;
        currentGuess = "";
        if (attempts === 6) {
            document.getElementById("message").innerText = "Kaybettin! Kelime: " + SECRET_WORD;
        }
    }
}