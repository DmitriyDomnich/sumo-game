import { Stats } from "./stats-model";
import { from, fromEvent, interval, Observable, Subscription, timer } from "rxjs";
import { GameFinisher } from "./game-handlers/game-finisher";
import heroSvg from "../assets/svgs/hero.svg";
import gunSvg from "../assets/svgs/gun.svg";
import { tap } from "rxjs/operators";
import { Gun } from "./gun";

export class Hero {

    public static heroInstance: Hero;
    private readonly rightLeg: HTMLElement;
    private readonly leftLeg: HTMLElement;
    private keysPressed: Set<string> = new Set<string>();
    private _move$ = fromEvent(document, 'keydown');
    private _stop$ = fromEvent(document, 'keyup');
    private _shoot$ = fromEvent(document.querySelector('section')!, 'click');
    private readonly moveObserver: any = {
        next: (e: KeyboardEvent) => {
            this.keysPressed.add(e.key);
            this.moveHero(Array.from(this.keysPressed));
        }
    };
    private readonly stopObserver: any = {
        next: (e: any) => {
            this.keysPressed.delete(e.key);
            this.leftLeg.classList.remove('animateLeftLeg');
            this.rightLeg.classList.remove('animateRightLeg');
            this.moveHero(Array.from(this.keysPressed));
        }
    };
    private subs = new Map<string, Subscription>();
    public readonly heroHtmlElement: SVGSVGElement;
    public stats: Stats;
    public isInvulnerable = false;
    public isCollided = false;

    constructor() {
        this.stats = {
            size: {
                height: 50,
                width: 30
            },
            speed: 12
        };
        this.heroHtmlElement = this.createHero();
        this.rightLeg = document.getElementById('RightLeg')!;
        this.leftLeg = document.getElementById('LeftLeg')!;
        this.subs.set('moveSub', this._move$.subscribe(this.moveObserver));
        this.subs.set('stopSub', this._stop$.subscribe(this.stopObserver));
    }

    public static getInstance(): Hero {
        if (!Hero.heroInstance) {
            Hero.heroInstance = new Hero();
        }
        return Hero.heroInstance;
    }

    private createHero() {
        const div = document.createElement('div');
        div.innerHTML = heroSvg;
        const svg = div.children[0] as SVGSVGElement;
        svg.setAttribute('width', this.stats.size.width.toString());
        svg.setAttribute('height', this.stats.size.height!.toString());
        svg.setAttribute('id', 'hero');
        svg.classList.add('defaultHeroAnimation');
        document.querySelector('section')!.prepend(svg);
        return svg;
    }
    private moveHero(symbols: string[]) {
        if (symbols.includes('a') && symbols.includes('s')) {
            this.leftLeg.classList.add('animateLeftLeg');
            this.rightLeg.classList.add('animateRightLeg');
            this.heroHtmlElement.style.top = (+this.heroHtmlElement.style.top.slice(0, this.heroHtmlElement.style.top.length - 2)) + this.stats.speed + 'px';
            this.heroHtmlElement.style.left = (+this.heroHtmlElement.style.left.slice(0, this.heroHtmlElement.style.left.length - 2)) - 12 + 'px';
        } else if (symbols.includes('d') && symbols.includes('s')) {
            this.leftLeg.classList.add('animateLeftLeg');
            this.rightLeg.classList.add('animateRightLeg');
            this.heroHtmlElement.style.top = (+this.heroHtmlElement.style.top.slice(0, this.heroHtmlElement.style.top.length - 2)) + this.stats.speed + 'px';
            this.heroHtmlElement.style.left = (+this.heroHtmlElement.style.left.slice(0, this.heroHtmlElement.style.left.length - 2)) + this.stats.speed + 'px';
        } else if (symbols.includes('d') && symbols.includes('w')) {
            this.leftLeg.classList.add('animateLeftLeg');
            this.rightLeg.classList.add('animateRightLeg');
            this.heroHtmlElement.style.top = (+this.heroHtmlElement.style.top.slice(0, this.heroHtmlElement.style.top.length - 2)) - this.stats.speed + 'px';
            this.heroHtmlElement.style.left = (+this.heroHtmlElement.style.left.slice(0, this.heroHtmlElement.style.left.length - 2)) + this.stats.speed + 'px';
        } else if (symbols.includes('a') && symbols.includes('w')) {
            this.leftLeg.classList.add('animateLeftLeg');
            this.rightLeg.classList.add('animateRightLeg');
            this.heroHtmlElement.style.top = (+this.heroHtmlElement.style.top.slice(0, this.heroHtmlElement.style.top.length - 2)) - this.stats.speed + 'px';
            this.heroHtmlElement.style.left = (+this.heroHtmlElement.style.left.slice(0, this.heroHtmlElement.style.left.length - 2)) - this.stats.speed + 'px';
        } else if (symbols.includes('a')) {
            this.leftLeg.classList.add('animateLeftLeg');
            this.rightLeg.classList.add('animateRightLeg');
            this.heroHtmlElement.style.left = (+this.heroHtmlElement.style.left.slice(0, this.heroHtmlElement.style.left.length - 2)) - this.stats.speed + 'px';
        } else if (symbols.includes('d')) {
            this.leftLeg.classList.add('animateLeftLeg');
            this.rightLeg.classList.add('animateRightLeg');
            this.heroHtmlElement.style.left = (+this.heroHtmlElement.style.left.slice(0, this.heroHtmlElement.style.left.length - 2)) + this.stats.speed + 'px';
        } else if (symbols.includes('w')) {
            this.leftLeg.classList.add('animateLeftLeg');
            this.rightLeg.classList.add('animateRightLeg');
            this.heroHtmlElement.style.top = (+this.heroHtmlElement.style.top.slice(0, this.heroHtmlElement.style.top.length - 2)) - this.stats.speed + 'px';
        } else if (symbols.includes('s')) {
            this.leftLeg.classList.add('animateLeftLeg');
            this.rightLeg.classList.add('animateRightLeg');
            this.heroHtmlElement.style.top = (+this.heroHtmlElement.style.top.slice(0, this.heroHtmlElement.style.top.length - 2)) + this.stats.speed + 'px';
        }
        this.checkHeroOverflow();
    }
    private updateHero() {
        const heroEl = document.querySelector('#hero')!;
        heroEl.setAttribute('width', this.stats.size.width.toString());
        heroEl.setAttribute('height', this.stats.size.height!.toString());
    }

    public getGun() {
        this.subs.get('shootSub')?.unsubscribe();

        this.subs.set('shootSub', this._shoot$.subscribe({
            next: (click: any) => {
                this.subs.get('shootSub')?.unsubscribe();
                const gun = new Gun(click);
                gun.move();
            }
        }));
    }
    public checkHeroOverflow(): void {
        const main = document.querySelector('main')!.getBoundingClientRect();
        const heroCoords = this.heroHtmlElement.getBoundingClientRect();
        if ((heroCoords.left < main.left || heroCoords.right > main.right
            || heroCoords.top < main.top + (document.querySelector('main')!.previousElementSibling!.clientHeight / 2)
            || heroCoords.bottom > main.bottom)
        ) {
            if (document.querySelectorAll('.health').length > 1) {
                this.centerHero();
            } else {
                GameFinisher.endGame();
            }
        }
    }
    public centerHero() {
        document.querySelector('.health')?.remove();

        this.isInvulnerable = true;

        const field = document.getElementsByTagName('section')[0];
        this.heroHtmlElement.style.top = field.clientHeight / 2 - this.heroHtmlElement.clientHeight + 'px';
        this.heroHtmlElement.style.left = field.clientWidth / 2 - this.heroHtmlElement.clientWidth / 2 + 'px';

        this.heroHtmlElement.classList.remove('heroRespawn');
        this.heroHtmlElement.classList.remove('defaultHeroAnimation');
        this.heroHtmlElement.classList.add('heroRespawn');
        document.querySelector('.health:last-child')?.classList.remove('healthBlinking');

        timer(2005).subscribe(_ => {
            if (this.heroHtmlElement.classList.contains('heroRespawn')) {
                this.heroHtmlElement.classList.remove('heroRespawn');
                this.heroHtmlElement.classList.add('defaultHeroAnimation');
                this.isInvulnerable = false;
            }
        });
    }
    public unsubscribeEvents() {
        for (const sub of this.subs.values()) {
            sub.unsubscribe();
        }
    }
    public disableMovementAbility() {
        this.isCollided = true;
        this.subs.get('moveSub')?.unsubscribe();
        this.subs.get('stopSub')?.unsubscribe();
        this.keysPressed.clear();

        timer(1000).subscribe(_ => {
            this.subs.set('moveSub', this._move$.subscribe(this.moveObserver));
            this.subs.set('stopSub', this._stop$.subscribe(this.stopObserver));

            this.isCollided = false;
        });
    }
    public getMoveDirection() {
        return Array.from(this.keysPressed);
    }
    public increaseSize() {
        this.stats.size.height! += 7.5;
        this.stats.size.width += 7.5;
        this.stats.speed -= .1;
        this.updateHero();
    }
}