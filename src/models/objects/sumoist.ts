import { GameObject } from "./game-object";
import { Hero } from "../hero";
import sumoist from "../../assets/svgs/sumoist.svg";
import pushSound from "../../assets/sounds/pushed1.mp3";
import { timer } from "rxjs";
import { Howl } from "howler";

const svgs = [{ sound: pushSound, src: sumoist }];

export class Sumoist extends GameObject {


    private readonly hero = Hero.getInstance();

    constructor() {
        super('sumoist');

        const div = document.createElement('div');
        div.dataset.name = this.name;
        div.innerHTML = this.getRandomSvg(svgs).src;
        const svgSize = this.stats.size.width;
        div.style.width = svgSize + 'px';
        div.classList.add('mob');
        div.style[this.respawnPoint.x.side] = this.respawnPoint.x.coord + 'px';
        this.respawnPoint.y.side === 'bottom' && this.respawnPoint.y.coord == 0
            ? div.style[this.respawnPoint.y.side] = this.respawnPoint.y.coord + svgSize + 'px'
            : div.style[this.respawnPoint.y.side] = this.respawnPoint.y.coord + '%';

        document.querySelector('section')?.appendChild(div);
    }
    private setMovingState() {
        this.hero.heroHtmlElement.classList.remove('defaultHeroAnimation');
        this.hero.heroHtmlElement.classList.add('heroPushed');

        timer(1000).subscribe(_ => {
            this.hero.heroHtmlElement.classList.remove('heroPushed');
            this.hero.heroHtmlElement.classList.add('defaultHeroAnimation');
            this.hero.checkHeroOverflow();
        });
    }
    private pushMovingHero(direction: string[]) {
        this.setMovingState();
        if (direction.includes('a') && direction.includes('s')) {
            this.hero.heroHtmlElement.style.top = (+this.hero.heroHtmlElement.style.top.slice(0, this.hero.heroHtmlElement.style.top.length - 2)) - ((this.stats.size.width / 10) * 40) + 'px';
            this.hero.heroHtmlElement.style.left = (+this.hero.heroHtmlElement.style.left.slice(0, this.hero.heroHtmlElement.style.left.length - 2)) + ((this.stats.size.width / 10) * 40) + 'px';
        } else if (direction.includes('d') && direction.includes('s')) {
            this.hero.heroHtmlElement.style.top = (+this.hero.heroHtmlElement.style.top.slice(0, this.hero.heroHtmlElement.style.top.length - 2)) - ((this.stats.size.width / 10) * 40) + 'px';
            this.hero.heroHtmlElement.style.left = (+this.hero.heroHtmlElement.style.left.slice(0, this.hero.heroHtmlElement.style.left.length - 2)) - ((this.stats.size.width / 10) * 40) + 'px';
        } else if (direction.includes('d') && direction.includes('w')) {
            this.hero.heroHtmlElement.style.top = (+this.hero.heroHtmlElement.style.top.slice(0, this.hero.heroHtmlElement.style.top.length - 2)) + ((this.stats.size.width / 10) * 40) + 'px';
            this.hero.heroHtmlElement.style.left = (+this.hero.heroHtmlElement.style.left.slice(0, this.hero.heroHtmlElement.style.left.length - 2)) - ((this.stats.size.width / 10) * 40) + 'px';
        } else if (direction.includes('a') && direction.includes('w')) {
            this.hero.heroHtmlElement.style.top = (+this.hero.heroHtmlElement.style.top.slice(0, this.hero.heroHtmlElement.style.top.length - 2)) + ((this.stats.size.width / 10) * 40) + 'px';
            this.hero.heroHtmlElement.style.left = (+this.hero.heroHtmlElement.style.left.slice(0, this.hero.heroHtmlElement.style.left.length - 2)) + ((this.stats.size.width / 10) * 40) + 'px';
        } else if (direction.includes('a')) {
            this.hero.heroHtmlElement.style.left = (+this.hero.heroHtmlElement.style.left.slice(0, this.hero.heroHtmlElement.style.left.length - 2)) + ((this.stats.size.width / 10) * 40) + 'px';
        } else if (direction.includes('d')) {
            this.hero.heroHtmlElement.style.left = (+this.hero.heroHtmlElement.style.left.slice(0, this.hero.heroHtmlElement.style.left.length - 2)) - ((this.stats.size.width / 10) * 40) + 'px';
        } else if (direction.includes('w')) {
            this.hero.heroHtmlElement.style.top = (+this.hero.heroHtmlElement.style.top.slice(0, this.hero.heroHtmlElement.style.top.length - 2)) + ((this.stats.size.width / 10) * 40) + 'px';
        } else if (direction.includes('s')) {
            this.hero.heroHtmlElement.style.top = (+this.hero.heroHtmlElement.style.top.slice(0, this.hero.heroHtmlElement.style.top.length - 2)) - ((this.stats.size.width / 10) * 40) + 'px';
        }
    }
    private moveToRandomSide(side: string) {
        let resultSide: {
            side: string,
            operation: '+' | '-'
        } = { side: '', operation: '+' };
        if (side === 'x') {
            Math.round(Math.random()) ? resultSide = { side: 'top', operation: '+' } : resultSide = { side: 'top', operation: '-' };
        } else {
            Math.round(Math.random()) ? resultSide = { side: 'left', operation: '+' } : resultSide = { side: 'left', operation: '-' };
        }
        resultSide.operation === '+'
            ?
            this.hero.heroHtmlElement.style[resultSide.side] = (+this.hero.heroHtmlElement.style[resultSide.side]
                .slice(0, this.hero.heroHtmlElement.style[resultSide.side].length - 2)) + ((this.stats.size.width / 10) * 40) + 'px'
            :
            this.hero.heroHtmlElement.style[resultSide.side] = (+this.hero.heroHtmlElement.style[resultSide.side]
                .slice(0, this.hero.heroHtmlElement.style[resultSide.side].length - 2)) - ((this.stats.size.width / 10) * 40) + 'px'
    }
    private pushStayingHero() {
        this.setMovingState();

        const mobDirection = this.getMoveDirection();
        switch (mobDirection.side) {
            case 'left': {
                this.hero.heroHtmlElement.style[mobDirection.side] = (+this.hero.heroHtmlElement.style[mobDirection.side]
                    .slice(0, this.hero.heroHtmlElement.style[mobDirection.side].length - 2)) + ((this.stats.size.width / 10) * 40) + 'px';
                this.moveToRandomSide('x');
                break;
            }
            case 'right': {
                this.hero.heroHtmlElement.style['left'] = (+this.hero.heroHtmlElement.style['left']
                    .slice(0, this.hero.heroHtmlElement.style['left'].length - 2)) - ((this.stats.size.width / 10) * 40) + 'px';
                this.moveToRandomSide('x');
                break;
            }
            case 'top': {
                this.hero.heroHtmlElement.style[mobDirection.side] = (+this.hero.heroHtmlElement.style[mobDirection.side]
                    .slice(0, this.hero.heroHtmlElement.style[mobDirection.side].length - 2)) + ((this.stats.size.width / 10) * 40) + 'px';
                this.moveToRandomSide('y');
                break;
            }
            case 'bottom': {
                this.hero.heroHtmlElement.style['top'] = (+this.hero.heroHtmlElement.style['top']
                    .slice(0, this.hero.heroHtmlElement.style['top'].length - 2)) - ((this.stats.size.width / 10) * 40) + 'px';
                this.moveToRandomSide('y');
                break;
            }
        }
    }
    public onCollide() {
        if (!this.hero.isCollided && !this.hero.isInvulnerable) {
            const heroMoveDirection = this.hero.getMoveDirection();
            this.hero.disableMovementAbility();

            new Howl({
                autoplay: true,
                src: pushSound
            });
            if (heroMoveDirection.length) { // if hero moves
                this.pushMovingHero(heroMoveDirection);
            } else {
                this.pushStayingHero();
            }
        } else if (this.hero.isInvulnerable) {
            this.hero.isCollided = true;
            this.hero.heroHtmlElement.classList.add('heroRespawn');
            document.querySelector('.health:last-child')?.classList.remove('healthBlinking');
            timer(1500).subscribe(_ => {
                this.hero.isCollided = false;
                this.hero.isInvulnerable = false;
                this.hero.heroHtmlElement.classList.remove('heroRespawn');
            });
        }
    }
}