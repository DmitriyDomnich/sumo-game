import { GameObject } from "./game-object";
import { Hero } from "../hero";
import fish from "../../assets/svgs/puffer-fish.svg";
import { GameFinisher } from "../game-handlers/game-finisher";
import fishSound from "../../assets/sounds/dying-to-fish.mp3";
import { Howl } from "howler";

const svgs = [{ sound: fishSound, src: fish }];

export class PufferFish extends GameObject {

    private readonly hero = Hero.getInstance();


    constructor() {
        super('puffer-fish');

        const div = document.createElement('div');
        div.dataset.name = this.name;
        div.innerHTML = this.getRandomSvg(svgs).src;
        div.style.width = this.stats.size.width + 'px';
        div.classList.add('mob');
        div.style[this.respawnPoint.x.side] = this.respawnPoint.x.coord + 'px';
        this.respawnPoint.y.side === 'bottom' && this.respawnPoint.y.coord == 0
            ? div.style[this.respawnPoint.y.side] = this.respawnPoint.y.coord + this.stats.size.width + 'px'
            : div.style[this.respawnPoint.y.side] = this.respawnPoint.y.coord + '%';

        document.querySelector('section')?.appendChild(div);
    }

    public onCollide() {
        if (!this.hero.isInvulnerable) {
            new Howl({
                autoplay: true,
                src: fishSound
            });
            if (document.querySelectorAll('.health').length > 1) {
                this.hero.centerHero();
            } else {
                GameFinisher.endGame();
            }
        } else {
            if (!this.hero.heroHtmlElement.classList.contains('heroRespawn')) {
                document.querySelector(`[data-name^="${this.name}"]`)!.remove();
                document.querySelector('.health:last-child')?.classList.remove('healthBlinking');
                this.hero.isInvulnerable = false;
            }
        }
    }
}