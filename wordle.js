import { words } from './words.js';

// 1. AYARLAR VE DEĞİŞKENLER
const SECRET_WORD = words[Math.floor(Math.random() * words.length)].toLocaleUpperCase('tr-TR');
let attempts = 0;
let currentGuess = "";
const board = document.getElementById("game-board");
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");

// 2. OYUN TAHTASINI OLUŞTUR (6 Satır x 5 Sütun)
for (let i = 0; i < 30; i++) {
    let tile = document.createElement("div");
    tile.classList.add("tile");
    tile.setAttribute("id", "tile-" + i);
    board.appendChild(tile);
}

// 3. Q-KLAVYE DÜZENİ (3 Satır)
const keys = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Ğ", "Ü"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "Ö", "Ç", "BACK"]
];

function createKeyboard() {
    keyboard.innerHTML = ""; // Mevcut içeriği temizle
    keys.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("keyboard-row");
        
        row.forEach(key => {
            const button = document.createElement("button");
            button.innerText = key;
            button.setAttribute("id", "key-" + key);
            button.classList.add("key");
            
            // Enter ve Back tuşlarını genişleten sınıf
            if (key === "ENTER" || key === "BACK") {
                button.classList.add("key-wide");
            }

            button.addEventListener("click", () => handleKeyPress(key));
            rowDiv.appendChild(button);
        });
        keyboard.appendChild(rowDiv);
    });
}

// 4. GİRİŞ YÖNETİMİ
document.addEventListener("keydown", (e) => {
    if (attempts >= 6) return;
    let key = e.key.toLocaleUpperCase('tr-TR');
    if (key === "BACKSPACE") key = "BACK";
    handleKeyPress(key);
});

function handleKeyPress(key) {
    if (attempts >= 6) return;

    if (key === "ENTER") {
        if (currentGuess.length === 5) checkGuess();
    } else if (key === "BACK") {
        currentGuess = currentGuess.slice(0, -1);
        updateBoard();
    } else if (currentGuess.length < 5 && key.length === 1 && /^[A-ZÇĞİÖŞÜ]$/.test(key)) {
        currentGuess += key;
        updateBoard();
    }
}

function updateBoard() {
    for (let i = 0; i < 5; i++) {
        let tile = document.getElementById("tile-" + (attempts * 5 + i));
        tile.innerText = currentGuess[i] || "";
    }
}

// 5. TAHMİN KONTROLÜ
function checkGuess() {
    const guessArray = currentGuess.split("");
    const secretArray = SECRET_WORD.split("");
    const statuses = Array(5).fill("absent");

    // Adım 1: Doğru yerdeki harfler (Yeşil)
    guessArray.forEach((letter, i) => {
        if (letter === secretArray[i]) {
            statuses[i] = "correct";
            secretArray[i] = null;
        }
    });

    // Adım 2: Yanlış yerdeki harfler (Sarı)
    guessArray.forEach((letter, i) => {
        if (statuses[i] !== "correct") {
            const letterIndex = secretArray.indexOf(letter);
            if (letterIndex !== -1) {
                statuses[i] = "present";
                secretArray[letterIndex] = null;
            }
        }
    });

    // Adım 3: Görseli ve Klavyeyi Güncelle
    statuses.forEach((status, i) => {
        const tile = document.getElementById("tile-" + (attempts * 5 + i));
        tile.classList.add(status);
        updateKeyboardColors(guessArray[i], status);
    });

    // Oyun Sonu
    if (currentGuess === SECRET_WORD) {
        message.innerText = "Tebrikler! 🎉";
        attempts = 6;
    } else {
        attempts++;
        currentGuess = "";
        if (attempts === 6) message.innerText = "Kaybettin! Kelime: " + SECRET_WORD;
    }
}

// 6. KLAVYE RENK GÜNCELLEME (Hata almamak için fonksiyonu checkGuess dışına aldık)
function updateKeyboardColors(letter, status) {
    const keyElement = document.getElementById("key-" + letter);
    if (!keyElement) return;

    // Eğer tuş zaten yeşilse, rengini sarı veya griye çevirme
    if (keyElement.classList.contains("correct")) return;
    
    // Eğer tuş zaten sarıysa ve yeni durum griyse, sarı kalsın
    if (keyElement.classList.contains("present") && status === "absent") return;

    keyElement.classList.remove("present", "absent");
    keyElement.classList.add(status);
}

// Başlat
createKeyboard();