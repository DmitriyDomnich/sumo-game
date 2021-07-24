import { GameObject } from './game-object';
import cucumber from '../../assets/svgs/fresh-cucumber.svg';
import rice from '../../assets/svgs/fresh-rice.svg';
import sushi from '../../assets/svgs/fresh-sushi.svg';
import { Howl } from 'howler';
import riceBite from "../../assets/sounds/rice-bite.mp3";
import cucumberBite from "../../assets/sounds/cucumber-bite.mp3";
import sushiBite from "../../assets/sounds/sushi-bite.mp3";
import { Svg } from '../interfaces/svg';

const svgs = [
    { sound: cucumberBite, src: cucumber },
    { sound: riceBite, src: rice },
    { sound: sushiBite, src: sushi }
];

export class FreshFood extends GameObject {

    private readonly svg: Svg;

    constructor() {
        super('fresh-food');

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
        new Howl({
            src: this.svg.sound,
            autoplay: true,
        });

        const mob: HTMLDivElement = document.querySelector(`[data-name^="${this.name}"]`)!;
        mob.remove();
        this.gameState.increaseProgress(this.calculateProgress(Math.round(+mob.style.width.slice(0, -2))));
    }
}