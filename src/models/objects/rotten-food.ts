import { GameObject } from "./game-object";
import banana from "../../assets/svgs/rotten-plate.svg";
import fish from "../../assets/svgs/rotten-fish.svg";
import apple from "../../assets/svgs/rotten-apple.svg";
import { Svg } from "../interfaces/svg";
import sound1 from "../../assets/sounds/bad-food1.mp3";
import sound2 from "../../assets/sounds/bad-food2.mp3";
import sound3 from "../../assets/sounds/bad-food3.mp3";
import { Howl } from "howler";
import { Hero } from "../hero";

const svgs = [
    { sound: sound1, src: banana },
    { sound: sound2, src: fish },
    { sound: sound3, src: apple },
];

export class RottenFood extends GameObject {

    private readonly svg: Svg;

    private readonly hero = Hero.getInstance();;

    constructor() {
        super('rotten-food');

        const div = document.createElement('div');
        div.dataset.name = this.name;
        this.svg = this.getRandomSvg(svgs);
        div.innerHTML = this.svg.src;
        const svgSize = this.stats.size.width;
        div.style.width = svgSize + 'px';
        div.classList.add('mob');
        div.style[this.respawnPoint.x.side] = this.respawnPoint.x.coord + 'px';
        this.respawnPoint.y.side === 'bottom' && this.respawnPoint.y.coord == 0
            ? div.style[this.respawnPoint.y.side] = this.respawnPoint.y.coord + svgSize + 'px'
            : div.style[this.respawnPoint.y.side] = this.respawnPoint.y.coord + '%';

        document.querySelector('section')?.appendChild(div);
    }

    private calculateProgress(size: number): number {
        return size / 10;
    }
    public onCollide() {
        const mob: HTMLDivElement = document.querySelector(`[data-name^="${this.name}"]`)!;
        mob.remove();
        if (!this.hero.isInvulnerable) {
            new Howl({
                autoplay: true,
                src: this.svg.sound
            });
            this.gameState.decreaseProgress(this.calculateProgress(Math.round(+mob.style.width.slice(0, -2))));
        } else {
            if (!this.hero.heroHtmlElement.classList.contains('heroRespawn')) {
                document.querySelector('.health:last-child')?.classList.remove('healthBlinking');
                this.hero.isInvulnerable = false;
            }
        }
    }
}