import { Stats } from "./stats-model";
import { from, fromEvent, interval, Observable, Subscription, timer } from "rxjs";
import { GameFinisher } from "./game-handlers/game-finisher";
import heroSvg from "../assets/svgs/hero.svg";
import gunSvg from "../assets/svgs/gun.svg";
import { tap } from "rxjs/operators";

export class Hero {

    public static heroInstance: Hero;
    private readonly rightLeg: HTMLElement;
    private readonly leftLeg: HTMLElement;
    private keysPressed: Set<string> = new Set<string>();
    private move$ = fromEvent(document, 'keydown');
    private stop$ = fromEvent(document, 'keyup');
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
        this.subs.set('moveSub', this.move$.subscribe(this.moveObserver));
        this.subs.set('stopSub', this.stop$.subscribe(this.stopObserver));
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
    private createGun(): Element {
        const gun = document.createElement('div');
        gun.innerHTML = gunSvg;
        gun.dataset.name = 'gun';
        gun.style.width = this.stats.size.width + 'px';
        gun.classList.add('mob', 'rotateGun');
        return gun;
    }
    private positionGun(gun: HTMLDivElement) {
        const coords = this.heroHtmlElement.getBoundingClientRect();
        const top = document.querySelector('.flex-centered-container')!.getBoundingClientRect().height;

        gun.style.left = coords.left - (window.innerWidth * 0.1) + 'px';
        gun.style.setProperty('top', `calc(${coords.top}px - ${top}px - 3em)`);
        return gun;
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
    private checkGunOverflow(gun: HTMLDivElement): boolean { // TODO: transfer to class
        const ySize = innerHeight - document.querySelector('h1')!.clientHeight - document.querySelector('.head')!.clientHeight;
        const xSize = innerWidth * 80 / 100;
        if (+gun.style.top.slice(0, gun.style.top.length - 2) > ySize
            || +gun.style.top.slice(0, gun.style.top.length - 2) < 0
            || +gun.style.left.slice(0, gun.style.left.length - 2) < 0
            || +gun.style.left.slice(0, gun.style.left.length - 2) > xSize) {
            return true;
        }
        return false;
    }
    private getGunSide(click: MouseEvent): string { // TODO: transfer to class
        const coords = this.heroHtmlElement.getBoundingClientRect();
        let side: 'right' | 'left' | 'bottom' | 'top';
        if (click.clientY < coords.bottom && click.clientY > coords.top) {
            click.clientX - coords.left < 0 ? side = 'left' : side = 'right';
        } else {
            click.clientY - coords.top < 0 ? side = 'top' : side = 'bottom';
        }
        return side;
    }
    private checkGunCollision(gun: HTMLElement, sub: Subscription): void { // TODO: transfer to class
        const mobs = from(document.querySelectorAll(`[data-name^="mob-rotten-food"], [data-name^="mob-sumoist"], [data-name^="mob-puffer-fish"]`));

        const gunCoords = gun.getBoundingClientRect();
        mobs.pipe(
            tap((badMobEl: any) => {
                const mobCoords = badMobEl.getBoundingClientRect();

                if (mobCoords.x < gunCoords.x + gunCoords.width &&
                    mobCoords.x + mobCoords.width > gunCoords.x &&
                    mobCoords.y < gunCoords.y + gunCoords.height &&
                    mobCoords.y + mobCoords.height > gunCoords.y) {
                    badMobEl.remove();
                    sub.unsubscribe();
                    gun.remove();
                }
            })
        ).subscribe();
    }
    public getGun() {
        this.subs.get('shootSub')?.unsubscribe();
        this.subs.set('shootSub', this._shoot$.subscribe({
            next: (click: any) => {
                this.subs.get('shootSub')?.unsubscribe();

                const coords = this.heroHtmlElement.getBoundingClientRect();
                const gun = document.querySelector('section')?.appendChild(this.positionGun(this.createGun() as HTMLDivElement))!;

                // TODO: refactor with filter operator 
                //#region
                if ((click.clientY < coords.bottom && click.clientY > coords.top) || (click.clientX < coords.right && click.clientX > coords.left)) {
                    const inter$ = interval(100).subscribe(_ => {
                        const side = this.getGunSide(click);
                        side === 'right' || side === 'bottom'
                            ? side === 'right'
                                ? gun.style.left = (+getComputedStyle(gun).left.slice(0, +getComputedStyle(gun).left.length - 2)) + 40 + 'px'
                                : gun.style.top = (+getComputedStyle(gun).top.slice(0, +getComputedStyle(gun).top.length - 2)) + 40 + 'px'
                            : side === 'left'
                                ? gun.style.left = (+getComputedStyle(gun).left.slice(0, +getComputedStyle(gun).left.length - 2)) - 40 + 'px'
                                : gun.style.top = (+getComputedStyle(gun).top.slice(0, +getComputedStyle(gun).top.length - 2)) - 40 + 'px';
                        if (this.checkGunOverflow(gun)) {
                            gun.remove();
                            inter$.unsubscribe();
                        }
                        this.checkGunCollision(gun, inter$);
                    });
                } else {
                    const x = click.clientX - coords.left;
                    const y = click.clientY - coords.top;
                    const hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                    const [left, top] = [hypotenuse / x, hypotenuse / y];

                    const inter$ = interval(100).subscribe(_ => {
                        if ((left < 0 && top > 0) || (left > 0 && top < 0)) {
                            if (left > 0 && top < 0) {
                                gun.style.left = (+gun.style.left.slice(0, gun.style.left.length - 2)) + (Math.abs(top) * 10) + 'px';
                                gun.style.top = (+getComputedStyle(gun).top.slice(0, +getComputedStyle(gun).top.length - 2)) + (left * (-10)) + 'px';
                            } else {
                                gun.style.left = (+gun.style.left.slice(0, gun.style.left.length - 2)) + (top * (-10)) + 'px';
                                gun.style.top = (+getComputedStyle(gun).top.slice(0, +getComputedStyle(gun).top.length - 2)) + (Math.abs(left) * 10) + 'px';
                            }
                        } else {
                            gun.style.left = (+gun.style.left.slice(0, gun.style.left.length - 2)) + (top * 10) + 'px';
                            gun.style.top = (+getComputedStyle(gun).top.slice(0, +getComputedStyle(gun).top.length - 2)) + (left * 10) + 'px';
                        }
                        if (this.checkGunOverflow(gun)) {
                            gun.remove();
                            inter$.unsubscribe();
                        }
                        this.checkGunCollision(gun, inter$);
                    });
                }
                //#endregion 
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
            this.subs.set('moveSub', this.move$.subscribe(this.moveObserver));
            this.subs.set('stopSub', this.stop$.subscribe(this.stopObserver));

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