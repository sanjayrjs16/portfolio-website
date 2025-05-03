import { GameScreen } from './gameScreen.js'; 
export class ScreenManager {
    constructor(container, state) {
        this.container = container;
        this.currentScreen = null;
        this.state = state;
    }
    showGameScreen(data) {
        const gameScreen = new GameScreen(this.container, this.state);  // Pass this.state
        this.currentScreen = gameScreen;
    }
    
    showScreen(screenName, data = {}) {
        if (this.currentScreen) {
            this.container.innerHTML = '';
        }

        switch (screenName) {
            case 'welcome':
                this.showWelcomeScreen();
                break;
            case 'gameMode':
                this.showGameModeScreen();
                break;
            case 'toss':
                this.showTossScreen();
                break;
            case 'game':
                this.showGameScreen(data);
                break;
        }
    }

    showWelcomeScreen() {
        const screen = document.createElement('div');
        screen.className = 'screen welcome-screen';
        screen.innerHTML = `
            <h1>Hand Cricket</h1>
            <button class="button" id="start-game">Start Game</button>
        `;
        this.container.appendChild(screen);

        document.getElementById('start-game').addEventListener('click', () => {
            this.showScreen('gameMode');
        });
    }

    showGameModeScreen() {
        const screen = document.createElement('div');
        screen.className = 'screen mode-screen';
        screen.innerHTML = `
            <h2>Choose Game Mode</h2>
            <button class="button" id="vs-computer">Play vs Computer</button>
            <button class="button" id="create-game">Create Game</button>
            <button class="button" id="join-game">Join Game</button>
        `;
        this.container.appendChild(screen);

        document.getElementById('vs-computer').addEventListener('click', () => {
            this.showScreen('toss');
        });
    }

    showTossScreen() {
        const screen = document.createElement('div');
        screen.className = 'screen toss-screen';
        screen.innerHTML = `
            <h2>Toss Time!</h2>
            <div class="toss-options">
                <button class="button" id="choose-odd">Odd</button>
                <button class="button" id="choose-even">Even</button>
            </div>
            <div class="number-selection" style="display: none">
                <h3>Choose your number (0-9)</h3>
                <div class="number-buttons"></div>
            </div>
            <div class="toss-result" style="display: none">
                <h3></h3>
                <div class="batting-choice" style="display: none">
                    <button class="button" id="choose-bat">Bat</button>
                    <button class="button" id="choose-bowl">Bowl</button>
                </div>
            </div>
        `;
        this.container.appendChild(screen);

        const numberSelection = screen.querySelector('.number-selection');
        const numberButtons = screen.querySelector('.number-buttons');
        const tossResult = screen.querySelector('.toss-result');
        const battingChoice = screen.querySelector('.batting-choice');

        // Create number buttons
        for (let i = 0; i < 10; i++) {
            const button = document.createElement('button');
            button.className = 'button number-button';
            button.textContent = i;
            button.addEventListener('click', () => this.handleTossNumber(i));
            numberButtons.appendChild(button);
        }

        // Add event listeners for odd/even choice
        document.getElementById('choose-odd').addEventListener('click', () => {
            this.state.playerChoice = 'odd';
            numberSelection.style.display = 'block';
        });

        document.getElementById('choose-even').addEventListener('click', () => {
            this.state.playerChoice = 'even';
            numberSelection.style.display = 'block';
        });
    }

    handleTossNumber(playerNumber) {
        const computerNumber = Math.floor(Math.random() * 10);
        const sum = playerNumber + computerNumber;
        const isEven = sum % 2 === 0;
        const playerWonToss = 
            (this.state.playerChoice === 'even' && isEven) || 
            (this.state.playerChoice === 'odd' && !isEven);

        const tossResult = document.querySelector('.toss-result');
        const battingChoice = document.querySelector('.batting-choice');
        const resultText = document.querySelector('.toss-result h3');

        resultText.textContent = `You chose ${playerNumber}, Computer chose ${computerNumber}. 
            Sum is ${sum} (${isEven ? 'Even' : 'Odd'})
            ${playerWonToss ? 'You won' : 'Computer won'} the toss!`;

        tossResult.style.display = 'block';

        if (playerWonToss) {
            battingChoice.style.display = 'block';
            this.setupBattingChoice();
        } else {
            // Computer chooses randomly
            const computerBats = Math.random() < 0.5;
            this.state.batting = computerBats ? 'computer' : 'player';
            setTimeout(() => {
                this.showScreen('game', { batting: this.state.batting });
            }, 2000);
        }
    }

    setupBattingChoice() {
        document.getElementById('choose-bat').addEventListener('click', () => {
            this.state.batting = 'player';
            this.showScreen('game', { batting: 'player' });
        });

        document.getElementById('choose-bowl').addEventListener('click', () => {
            this.state.batting = 'computer';
            this.showScreen('game', { batting: 'computer' });
        });
    }
}