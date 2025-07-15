// Configuración global del juego
const GAME_CONFIG = {
    TIMER_SECONDS: 50,        // Tiempo total del juego en segundos
    TOTAL_CARDS: 9,         // Número total de cartas disponibles (1.png a 12.png)
    PAIRS_TO_MATCH: 6,       // Número de pares que se usarán en el juego
    FLIP_ANIMATION_MS: 400,  // Duración de la animación de volteo en milisegundos
    WIN_MESSAGE_MS: 200000,    // Duración del mensaje de victoria (2 segundos)
    LOSE_MESSAGE_MS: 200000,   // Duración del mensaje de derrota (2 segundos)
    NEXT_TURN_DELAY_MS: 100  // Delay antes de poder voltear la siguiente carta
};

class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.isPlaying = false;
        this.timeLeft = GAME_CONFIG.TIMER_SECONDS;
        this.timer = null;
        this.isFlipping = false;  // Nuevo: para controlar si hay cartas en animación
        
        this.gameBoard = document.querySelector('.game-board');
        this.startButton = document.getElementById('startButton');
        this.timeDisplay = document.getElementById('time');
        this.startModal = document.getElementById('startModal');
        this.winMessage = document.getElementById('winMessage');
        this.loseMessage = document.getElementById('loseMessage');
        
        this.startButton.addEventListener('click', () => this.startGame());
    }

    createCards() {
        // Crear array con números del 1 al total de cartas
        const cardValues = Array.from({length: GAME_CONFIG.TOTAL_CARDS}, (_, i) => i + 1);
        // Mezclar y tomar los primeros 6 números
        const selectedValues = this.shuffleArray([...cardValues]).slice(0, GAME_CONFIG.PAIRS_TO_MATCH);
        // Duplicar cada número para crear los pares
        const allCards = [...selectedValues, ...selectedValues];
        // Mezclar nuevamente para distribuir los pares
        return this.shuffleArray(allCards);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    createCardElement(value, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.value = value;
        card.dataset.index = index;

        const front = document.createElement('div');
        front.className = 'card-face card-front';
        front.innerHTML = `<img src="img/front/${value}.png" alt="Card ${value}">`;

        const back = document.createElement('div');
        back.className = 'card-face card-back';
        // Usar números del 1 al 4 para las imágenes de back
        //const backNumber = (index % 4) + 1;
        const backNumber = index;
        back.innerHTML = `<img src="img/back/${backNumber}.png" alt="Card back ${backNumber}">`;


        card.appendChild(front);
        card.appendChild(back);

        card.addEventListener('click', () => this.flipCard(card));
        return card;
    }

    startGame() {
        this.resetGame();
        this.isPlaying = true;
        this.startModal.style.display = 'none';
        
        const cardValues = this.createCards();
        this.gameBoard.innerHTML = '';
        
        cardValues.forEach((value, index) => {
            const card = this.createCardElement(value, index);
            this.gameBoard.appendChild(card);
            this.cards.push(card);
        });

        this.startTimer();
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.timeDisplay.textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                this.gameOver();
            }
        }, 1000);
    }

    flipCard(card) {
        if (!this.isPlaying || this.isFlipping) return;
        if (this.flippedCards.length >= 2) return;
        if (card.classList.contains('flipped')) return;

        card.classList.add('flipped');
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            this.isFlipping = true;
            setTimeout(() => this.checkMatch(), GAME_CONFIG.FLIP_ANIMATION_MS);
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const match = card1.dataset.value === card2.dataset.value;

        if (match) {
            this.matchedPairs++;
            if (this.matchedPairs === GAME_CONFIG.PAIRS_TO_MATCH) {
                this.win();
            }
            setTimeout(() => {
                this.isFlipping = false;
                this.flippedCards = [];
            }, GAME_CONFIG.NEXT_TURN_DELAY_MS);
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                this.isFlipping = false;
                this.flippedCards = [];
            }, GAME_CONFIG.FLIP_ANIMATION_MS);
        }
    }

    win() {
        this.isPlaying = false;
        clearInterval(this.timer);
        this.winMessage.style.display = 'flex';
        setTimeout(() => {
            this.winMessage.style.display = 'none';
            this.startModal.style.display = 'flex';
        }, GAME_CONFIG.WIN_MESSAGE_MS);
    }

    gameOver() {
        this.isPlaying = false;
        clearInterval(this.timer);
        this.loseMessage.style.display = 'flex';
        setTimeout(() => {
            this.loseMessage.style.display = 'none';
            this.startModal.style.display = 'flex';
        }, GAME_CONFIG.LOSE_MESSAGE_MS);
    }

    resetGame() {
        clearInterval(this.timer);
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.isFlipping = false;
        this.timeLeft = GAME_CONFIG.TIMER_SECONDS;
        this.timeDisplay.textContent = this.timeLeft;
        this.winMessage.style.display = 'none';
        this.loseMessage.style.display = 'none';
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});
