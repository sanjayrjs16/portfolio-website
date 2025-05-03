export class GameState {
    constructor() {
        this.currentScreen = 'welcome';
        this.gameMode = null;
        this.playerChoice = null; // 'odd' or 'even'
        this.batting = null; // 'player' or 'computer'
        this.score = 0;
        this.wickets = 5;
        this.balls = 30;
        this.currentInnings = 1;
        this.firstInningsScore = 0;
    }
}