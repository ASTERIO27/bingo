let numbers = [];
let calledNumbers = [];
let intervalId;
let isPaused = false;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startNewGame() {
    numbers = Array.from({ length: 75 }, (_, i) => i + 1);
    shuffle(numbers);
    calledNumbers = [];
    document.getElementById("currentNumber").innerText = "Nueva partida iniciada";
    document.getElementById("calledNumbers").innerHTML = "";
    const cells = document.querySelectorAll(".bingoCell");
    cells.forEach(cell => cell.classList.remove("marked"));
    speakPhrase("Nueva partida");
    if (intervalId) {
        clearInterval(intervalId);
    }
    isPaused = false;
}

function startGame() {
    if (calledNumbers.length === 0) {
        speakPhrase("Vamos a empezar el juego. Todos hacer silencio y escuchen correctamente.");
        if (intervalId) {
            clearInterval(intervalId);
        }
        intervalId = setInterval(drawNumber, 5000); // Cambia 5000 por el intervalo deseado en milisegundos
    } else {
        alert("¡El juego ya ha comenzado!");
    }
}

function drawNumber() {
    if (numbers.length === 0) {
        alert("¡Todos los números han sido cantados!");
        clearInterval(intervalId);
        return;
    }

    if (!isPaused) {
        const number = numbers.pop();
        calledNumbers.push(number);
        document.getElementById("currentNumber").innerText = `Número cantado: ${number}`;
        updateCalledNumbers();
        markNumberOnBoard(number);
        speakNumber(number);
    }
}

function updateCalledNumbers() {
    const calledNumbersDiv = document.getElementById("calledNumbers");
    calledNumbersDiv.innerHTML = "";
    calledNumbers.forEach(number => {
        const numberDiv = document.createElement("div");
        numberDiv.classList.add("calledNumber");
        numberDiv.innerText = number;
        calledNumbersDiv.appendChild(numberDiv);
    });
}

function speakNumber(number) {
    const letter = getLetter(number);
    const msg1 = new SpeechSynthesisUtterance(`${letter} ${number}`);
    const msg2 = new SpeechSynthesisUtterance(`${letter} ${number}`);
    msg1.lang = "es-ES";
    msg2.lang = "es-ES";
    window.speechSynthesis.speak(msg1);
    setTimeout(() => {
        window.speechSynthesis.speak(msg2);
    }, 2000);
}

function speakPhrase(phrase) {
    const msg = new SpeechSynthesisUtterance(phrase);
    msg.lang = "es-ES";
    window.speechSynthesis.speak(msg);
}

function createBingoBoard() {
    const columns = {
        B: document.getElementById("columnB"),
        I: document.getElementById("columnI"),
        N: document.getElementById("columnN"),
        G: document.getElementById("columnG"),
        O: document.getElementById("columnO")
    };

    for (let i = 1; i <= 15; i++) {
        columns.B.appendChild(createBingoCell(i));
        columns.I.appendChild(createBingoCell(i + 15));
        columns.N.appendChild(createBingoCell(i + 30));
        columns.G.appendChild(createBingoCell(i + 45));
        columns.O.appendChild(createBingoCell(i + 60));
    }
}

function createBingoCell(number) {
    const cell = document.createElement("div");
    cell.classList.add("bingoCell");
    cell.innerText = number;
    return cell;
}

function markNumberOnBoard(number) {
    const column = getLetter(number);
    const cells = document.querySelectorAll(`#column${column} .bingoCell`);
    const index = getIndexInColumn(number);
    cells[index].classList.add("marked");
}

function getLetter(number) {
    if (number <= 15) return 'B';
    if (number <= 30) return 'I';
    if (number <= 45) return 'N';
    if (number <= 60) return 'G';
    return 'O';
}

function getIndexInColumn(number) {
    if (number <= 15) return number - 1;
    if (number <= 30) return number - 16;
    if (number <= 45) return number - 31;
    if (number <= 60) return number - 46;
    return number - 61;
}

function pauseGame() {
    isPaused = true;
    document.getElementById("currentNumber").innerText = "Juego pausado";
    speakPhrase("Partida detenida, esperen un momento");
}

function resumeGame() {
    isPaused = false;
    document.getElementById("currentNumber").innerText = "Juego reanudado";
    speakPhrase("Vamos a seguir el juego");
}

function announceBingo() {
    speakPhrase("¡Bingo!");
    const userConfirmed = confirm("¿Es un Bingo correcto?");
    if (userConfirmed) {
        speakPhrase("Bingo correcto, felicitaciones");
        const bingoSong = document.getElementById("bingoSong");
        bingoSong.play();
        startNewGame();
    } else {
        speakPhrase("Bingo incorrecto");
        resumeGame();
    }
}

document.getElementById("newGameButton").addEventListener("click", startNewGame);
document.getElementById("startGameButton").addEventListener("click", startGame);
document.getElementById("pauseButton").addEventListener("click", pauseGame);
document.getElementById("resumeButton").addEventListener("click", resumeGame);
document.getElementById("bingoButton").addEventListener("click", announceBingo);

createBingoBoard();
