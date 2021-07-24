import { Howl } from "howler";
import { timer } from "rxjs";
import { GameState } from "../game-state";
import { Hero } from "../hero";
import dying from "../../assets/sounds/dying.mp3";

export class GameFinisher {

    private static saveStats() {
        const afterGameResult = GameState.getInstance().points;
        let userResults: number[] = JSON.parse(localStorage.getItem('results')!);

        if (userResults.length > 7) {
            if (userResults[userResults.length - 1] < afterGameResult) {
                userResults.splice(userResults.length - 1, 1, afterGameResult);
                userResults = userResults.sort((a, b) => b - a);
                localStorage.setItem('results', JSON.stringify(userResults));
            }
        } else {
            userResults.push(afterGameResult);
            userResults = userResults.sort((a, b) => b - a);
            localStorage.setItem('results', JSON.stringify(userResults));
        }
    }
    public static endGame() {
        const hero = Hero.getInstance();
        document.querySelector('.health')?.remove();
        hero.unsubscribeEvents();
        hero.heroHtmlElement.classList.add('heroDies');
        new Howl({
            autoplay: true,
            src: dying,
            volume: 0.3
        });
        this.saveStats();

        timer(2000).subscribe(_ => location.replace('./menu.html'));
    }
    public static decreaseHeroHealth() {
        if (document.querySelectorAll('.health').length > 1) {
            document.querySelector('.health')?.remove();
        } else {
            this.endGame();
        }
    }
}