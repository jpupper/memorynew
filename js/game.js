class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.isPlaying = false;
        this.timeLeft = 50;
        this.timer = null;
        
        this.gameBoard = document.querySelector('.game-board');
        this.startButton = document.getElementById('startButton');
        this.timeDisplay = document.getElementById('time');
        this.startModal = document.getElementById('startModal');
        this.winMessage = document.getElementById('winMessage');
        this.loseMessage = document.getElementById('loseMessage');
        
        this.startButton.addEventListener('click', () => this.startGame());
    }

    createCards() {
        const cardValues = Array.from({length: 12}, (_, i) => i + 1);
        const selectedValues = this.shuffleArray([...cardValues]).slice(0, 6);
        const allCards = [...selectedValues, ...selectedValues];
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
        if (!this.isPlaying) return;
        if (this.flippedCards.length >= 2) return;
        if (card.classList.contains('flipped')) return;

        card.classList.add('flipped');
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            setTimeout(() => this.checkMatch(), 500);
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const match = card1.dataset.value === card2.dataset.value;

        if (match) {
            this.matchedPairs++;
            if (this.matchedPairs === 6) {
                this.win();
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }, 1000);
        }

        this.flippedCards = [];
    }

    win() {
        this.isPlaying = false;
        clearInterval(this.timer);
        this.winMessage.style.display = 'flex';
        setTimeout(() => {
            this.winMessage.style.display = 'none';
            this.startModal.style.display = 'flex';
        }, 3000);
    }

    gameOver() {
        this.isPlaying = false;
        clearInterval(this.timer);
        this.loseMessage.style.display = 'flex';
        setTimeout(() => {
            this.loseMessage.style.display = 'none';
            this.startModal.style.display = 'flex';
        }, 3000);
    }

    resetGame() {
        clearInterval(this.timer);
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.timeLeft = 50;
        this.timeDisplay.textContent = this.timeLeft;
        this.winMessage.style.display = 'none';
        this.loseMessage.style.display = 'none';
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});
