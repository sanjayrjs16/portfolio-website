export class GameScreen {
    constructor(container, gameState) {
        this.container = container;
        this.gameState = gameState;
        this.initialize();
    }

    initialize() {
        const screen = document.createElement('div');
        screen.className = 'screen game-screen';
        
        screen.innerHTML = `
            <div class="game-info">
                <h2>${this.gameState.batting === 'player' ? 'You are batting' : 'You are bowling'}</h2>
                <div class="score-info">
                    <p>Score: <span id="score">0</span></p>
                    <p>Wickets: <span id="wickets">${this.gameState.wickets}</span></p>
                    <p>Balls: <span id="balls">${this.gameState.balls}</span></p>
                </div>
            </div>
            <div class="game-controls">
                ${Array.from({length: 10}, (_, i) => 
                    `<button class="button number-button" data-number="${i}">${i}</button>`
                ).join('')}
            </div>
            <div class="game-status"></div>
        `;

        this.container.appendChild(screen);

        // Add event listeners to number buttons
        screen.querySelectorAll('.number-button').forEach(button => {
            button.addEventListener('click', () => {
                const number = parseInt(button.dataset.number);
                this.handlePlayerMove(number);
            });
        });
    }

    async handlePlayerMove(playerNumber) {
        const computerNumber = Math.floor(Math.random() * 10);
        const gameStatus = document.querySelector('.game-status');
        
        gameStatus.innerHTML = `
            You chose: ${playerNumber}<br>
            Computer chose: ${computerNumber}
        `;

        if (playerNumber === computerNumber) {
            // Wicket!
            this.gameState.wickets--;
            gameStatus.innerHTML += '<br>OUT!';
        } else {
            // Add runs if batting
            if (this.gameState.batting === 'player') {
                this.gameState.score += playerNumber;
            } else {
                this.gameState.score += computerNumber;
            }
        }

        this.gameState.balls--;
        this.updateGameInfo();

        // Check if innings is over
        if (this.gameState.wickets === 0 || this.gameState.balls === 0) {
            this.endInnings();
        }
    }

    updateGameInfo() {
        document.getElementById('score').textContent = this.gameState.score;
        document.getElementById('wickets').textContent = this.gameState.wickets;
        document.getElementById('balls').textContent = this.gameState.balls;
    }

    endInnings() {
        if (this.gameState.currentInnings === 1) {
            // Store first innings score
            this.gameState.firstInningsScore = this.gameState.score;
            this.gameState.currentInnings = 2;
            this.gameState.score = 0;
            this.gameState.wickets = 5;
            this.gameState.balls = 30;
            this.gameState.batting = this.gameState.batting === 'player' ? 'computer' : 'player';
            
            // Start second innings
            this.initialize();
        } else {
            // Game Over
            this.showGameResult();
        }
    }

    showGameResult() {
        const playerWon = 
            (this.gameState.batting === 'player' && this.gameState.score > this.gameState.firstInningsScore) ||
            (this.gameState.batting === 'computer' && this.gameState.score < this.gameState.firstInningsScore);

        const screen = document.createElement('div');
        screen.className = 'screen result-screen';
        screen.innerHTML = `
            <h2>Game Over!</h2>
            <p>First Innings Score: ${this.gameState.firstInningsScore}</p>
            <p>Second Innings Score: ${this.gameState.score}</p>
            <h3>${playerWon ? 'You Won!' : 'Computer Won!'}</h3>
            <button class="button" id="play-again">Play Again</button>
        `;

        this.container.innerHTML = '';
        this.container.appendChild(screen);

        document.getElementById('play-again').addEventListener('click', () => {
            window.location.reload();
        });
    }
}