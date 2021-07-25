import { from, iif, interval, of, Subscription } from "rxjs";
import { filter, finalize, switchMap, takeWhile, tap } from "rxjs/operators";
import { Hero } from "./hero";
import gunSvg from "../assets/svgs/gun.svg";

export class Gun {

    private readonly hero: Hero = Hero.getInstance();
    private readonly click: MouseEvent;
    private gunHtmlElement: HTMLDivElement;
    private sub?: Subscription;

    constructor(click: MouseEvent) {
        this.gunHtmlElement = document.querySelector('section')?.appendChild(this.positionGun(this.createGun() as HTMLDivElement))!;
        this.click = click;
    }

    private createGun(): Element {
        const gun = document.createElement('div');
        gun.innerHTML = gunSvg;
        gun.dataset.name = 'gun';
        gun.style.width = 30 + 'px';
        gun.classList.add('mob', 'rotateGun');
        return gun;
    }
    private positionGun(gun: HTMLDivElement) {
        const coords = this.hero.heroHtmlElement.getBoundingClientRect();
        const top = document.querySelector('.flex-centered-container')!.getBoundingClientRect().height;

        gun.style.left = coords.left - (window.innerWidth * 0.1) + 'px';
        gun.style.setProperty('top', `calc(${coords.top}px - ${top}px - 3em)`);
        return gun;
    }
    private getGunSide(click: MouseEvent): string {
        const coords = this.hero.heroHtmlElement.getBoundingClientRect();
        let side: 'right' | 'left' | 'bottom' | 'top';
        if (click.clientY < coords.bottom && click.clientY > coords.top) {
            click.clientX - coords.left < 0 ? side = 'left' : side = 'right';
        } else {
            click.clientY - coords.top < 0 ? side = 'top' : side = 'bottom';
        }
        return side;
    }
    private checkGunOverflow(gun: HTMLDivElement): boolean {
        const ySize = innerHeight - document.querySelector('h1')!.clientHeight - document.querySelector('.head')!.clientHeight;
        const xSize = innerWidth * 80 / 100;
        if (+gun.style.top.slice(0, gun.style.top.length - 2) > ySize
            || +gun.style.top.slice(0, gun.style.top.length - 2) < 0
            || +gun.style.left.slice(0, gun.style.left.length - 2) < 0
            || +gun.style.left.slice(0, gun.style.left.length - 2) > xSize) {
            gun.remove();
            return false;
        }
        return true;
    }
    private checkGunCollision(gun: HTMLElement): boolean {
        const mobs = document.querySelectorAll(`[data-name^="mob-rotten-food"], [data-name^="mob-sumoist"], [data-name^="mob-puffer-fish"]`);
        const gunCoords = gun.getBoundingClientRect();

        return Array.from(mobs).find(mobEl => {
            const mobCoords = mobEl.getBoundingClientRect();
            if (mobCoords.x < gunCoords.x + gunCoords.width &&
                mobCoords.x + mobCoords.width > gunCoords.x &&
                mobCoords.y < gunCoords.y + gunCoords.height &&
                mobCoords.y + mobCoords.height > gunCoords.y) {
                mobEl.remove();
                gun.remove();
                return true;
            }
        }) ? false : true;
    }

    public move(): void {
        const coords = this.hero.heroHtmlElement.getBoundingClientRect();
        const condition = ((this.click.clientY < coords.bottom && this.click.clientY > coords.top)
            || (this.click.clientX < coords.right && this.click.clientX > coords.left));

        const otherSide$ = iif(
            () => condition,
            interval(100).pipe(
                tap(_ => {
                    const side = this.getGunSide(this.click);
                    side === 'right' || side === 'bottom'
                        ? side === 'right'
                            ? this.gunHtmlElement.style.left = (+getComputedStyle(this.gunHtmlElement).left.slice(0, +getComputedStyle(this.gunHtmlElement).left.length - 2)) + 40 + 'px'
                            : this.gunHtmlElement.style.top = (+getComputedStyle(this.gunHtmlElement).top.slice(0, +getComputedStyle(this.gunHtmlElement).top.length - 2)) + 40 + 'px'
                        : side === 'left'
                            ? this.gunHtmlElement.style.left = (+getComputedStyle(this.gunHtmlElement).left.slice(0, +getComputedStyle(this.gunHtmlElement).left.length - 2)) - 40 + 'px'
                            : this.gunHtmlElement.style.top = (+getComputedStyle(this.gunHtmlElement).top.slice(0, +getComputedStyle(this.gunHtmlElement).top.length - 2)) - 40 + 'px';
                }),
                takeWhile(_ => this.checkGunCollision(this.gunHtmlElement) && this.checkGunOverflow(this.gunHtmlElement))
            ),
            interval(100).pipe(
                tap(_ => {
                    const x = this.click.clientX - coords.left;
                    const y = this.click.clientY - coords.top;
                    const hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                    const [left, top] = [hypotenuse / x, hypotenuse / y]
                    if ((left < 0 && top > 0) || (left > 0 && top < 0)) {
                        if (left > 0 && top < 0) {
                            this.gunHtmlElement.style.left = (+this.gunHtmlElement.style.left.slice(0, this.gunHtmlElement.style.left.length - 2)) + (Math.abs(top) * 10) + 'px';
                            this.gunHtmlElement.style.top = (+getComputedStyle(this.gunHtmlElement).top.slice(0, +getComputedStyle(this.gunHtmlElement).top.length - 2)) + (left * (-10)) + 'px';
                        } else {
                            this.gunHtmlElement.style.left = (+this.gunHtmlElement.style.left.slice(0, this.gunHtmlElement.style.left.length - 2)) + (top * (-10)) + 'px';
                            this.gunHtmlElement.style.top = (+getComputedStyle(this.gunHtmlElement).top.slice(0, +getComputedStyle(this.gunHtmlElement).top.length - 2)) + (Math.abs(left) * 10) + 'px';
                        }
                    } else {
                        this.gunHtmlElement.style.left = (+this.gunHtmlElement.style.left.slice(0, this.gunHtmlElement.style.left.length - 2)) + (top * 10) + 'px';
                        this.gunHtmlElement.style.top = (+getComputedStyle(this.gunHtmlElement).top.slice(0, +getComputedStyle(this.gunHtmlElement).top.length - 2)) + (left * 10) + 'px';
                    }
                }),
                takeWhile(_ => this.checkGunCollision(this.gunHtmlElement) && this.checkGunOverflow(this.gunHtmlElement))
            ));
        this.sub = otherSide$.subscribe({
            complete: () => {
                this.sub?.unsubscribe();
            }
        });
    }
}