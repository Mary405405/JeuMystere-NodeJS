const prompt = require('prompt-sync')({ sigint: true });

class Game {
    constructor() {
        this.started = false;
        this.currentInput = null;
        this.range = null;
        this.number = null;
        this.triedNumber = [];
        this.tryAllowed = null;
        this.done = false;
    }
    init() {
        console.clear();
        console.log("Le but du jeu est de trouver un nombre entre deux intervalles (0 et un nombre entré) avec le moins de tentatives possible.\n");
        while (1) {
            let number = prompt('Entrez la borne maximale: ');
            if (isNaN(number)) {
                this.exception("Ceci n'est pas un nombre!\n")
                continue;
            }
            if (number < 5 || number > 1000000) {
                this.exception("Le nombre doit être entre 5 et 1 000 000!\n")
                continue;
            }
            this.range = parseInt(number);
            this.number = Math.floor(Math.random() * this.range);
            while (1) {
                let number = prompt('Entrez le nombre d\'essais maximal: ');
                if (isNaN(number)) {
                    this.exception("Ceci n'est pas un nombre!\n")
                    continue;
                }
                if (number < 1 || number > 500) {
                    this.exception("Le nombre doit être entre 5 et 1 000 000!\n")
                    continue;
                }
                if (number > this.range) {
                    this.exception("Le nombre doit être inférieur à la borne maximale!\n")
                    continue;
                }
                this.tryAllowed = parseInt(number);

                console.log(`Vous avez ${this.tryAllowed} chances pour trouver le chiffre entre 0 et ${this.range} inclus. Bonne chance!`);
                this.started = true;
                this.done = false;
                this.triedNumber = [];
                return this.promptUser();
            }
        }
    }
    promptUser() {
        let number = prompt('Entrez un chiffre: ');
        this.currentInput = parseInt(number);
        this.try()
    }
    try() {
        if (this.done)
            return this.exception("Le précédent jeu est terminé. Veuillez en relancer un.");
        if (isNaN(this.currentInput))
            return this.exception("Vous n'avez pas entré un chiffre");
        if (this.triedNumber.includes(this.currentInput))
            return this.exception("Vous avez déjà entré ce nombre.");
        if (![...Array(this.range + 1).keys()].includes(this.currentInput))
            return this.exception(`Le chiffre proposé doit être entre 0 et ${this.range}.`)
        this.currentInput == this.number ? this.finished("\x1b[32m", "Bravo, vous avez deviné.") : this.fail();
        this.anotherChance();
    }
    anotherChance() {
        if (!this.started)
            return;
        if (!this.done)
            return this.promptUser();
        this.askForNewGame();
    }
    comparator() {
        if (this.currentInput > this.number)
            return "plus petit."
        return "plus grand."
    }
    fail() {
        this.triedNumber.push(this.currentInput)
        if (this.triedNumber.length >= this.tryAllowed)
            return this.finished("\x1b[31m", `Vous avez perdu.. Le chiffre était ${this.number}`);
        return console.log(`Mauvais chiffre! Il est ${this.comparator(this.currentInput)}\n\nEncore ${this.tryAllowed - this.triedNumber.length} essai(s)\n\nChiffre(s) déjà donné(s): ${this.triedNumber.join(' et ')}`);
    }
    finished(codec, text) {
        console.log(codec, text);
        //reset la couleur du texte
        console.log("\x1b[0m");
        return game.done = true;
    }
    exception(text) {
        console.log(text);
        return this.anotherChance();
    }
    askForNewGameno() {
        let text = prompt('Voulez-vous rejouer?(oui/o, yes/y): ');
        if (['oui', 'o', 'yes', 'y'].includes(text.toLowerCase()))
            startGame();
    }
}

let game = new Game();

const startGame = () => {
    game.init();
}

startGame();