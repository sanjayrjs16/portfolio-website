import { GameState } from './gameState.js';
import { ScreenManager } from './screenManager.js';

export class GameManager {
    constructor() {
        this.state = new GameState();
        this.screenManager = new ScreenManager(document.getElementById('game-container', this.state ));
        this.initialize();
    }

    initialize() {
        this.screenManager.showScreen('welcome');
    }

    async handlePlayerMove(move) {  // Changed parameter name from playerNumber to move
        // Create a Promise that resolves with computer's move
        const computerMove = new Promise(resolve => {
            const number = Math.floor(Math.random() * 10);
            resolve(number);
        });

        // Create a Promise that resolves with player's move
        const playerMove = new Promise(resolve => {
            resolve(move);
        });

        // Wait for both moves to be ready
        const [computerNumber, playerNumber] = await Promise.all([  // Changed playerNumber to playerMove
            computerMove,
            playerMove
        ]);

        return {
            computer: computerNumber,
            player: playerNumber
        };
    }
}