import { Observer, Subject, Subscription, timer } from "rxjs";
import { GameFinisher } from "./game-handlers/game-finisher";
import { Hero } from "./hero";

export class GameState {

    private static instance: GameState;
    private readonly hero = Hero.getInstance();
    private _progress = 0;
    private _points = 0;
    private _additionalSize = 0;
    private _speed = 10;
    private _subscription?: Subscription;
    private readonly _shieldObserver: any = {
        next: (_: any) => {
            this.hero.isInvulnerable = false;
            this.hero.heroHtmlElement.classList.remove('healthBlinking');
        }
    };
    private readonly _timer$ = timer(12000);
    private readonly _progressBar: HTMLDivElement = document.querySelector('#progress>div')!;
    private readonly _pointsCounter: HTMLDivElement = document.querySelector('.points')!;
    private readonly changeState = new Subject<void>();

    constructor() {
        this.changeState.subscribe({
            next: _ => {
                this._pointsCounter.innerHTML = `Points: ${this._points}`;
                this._progressBar.style.width = this._progress + '%';
            }
        });
    }

    public static getInstance(): GameState {
        if (!GameState.instance) {
            GameState.instance = new GameState();
        }
        return GameState.instance;
    }
    public static checkHealth() {
        if (document.querySelectorAll('.health').length) {
            return true;
        }
        return false;
    }

    public get speed(): number {
        return this._speed;
    }
    public get progress(): number {
        return this._progress;
    }
    public get points(): number {
        return this._points;
    }
    public set points(val: number) {
        this._points = val;
    }
    public get additionalSize(): number {
        return this._additionalSize;
    }

    public increaseProgress(val: number): void {
        if (this._progress + val >= 100) {
            this.increaseObjectsSize();
            this.hero.increaseSize();
            this._progress = 0;
        } else {
            this._progress += val;
        }
        this._points += +val.toFixed();
        this.changeState.next();
    }
    public decreaseProgress(val: number): void {
        if (this._progress - val < 0) {
            this._progress = 0;
            GameFinisher.decreaseHeroHealth();
        } else {
            this._progress -= val;
        }
        if (this._points - val > 0) {
            this._points -= +val.toFixed();
        }
        this.changeState.next();
    }
    public increaseObjectsSize() {
        this._additionalSize += 10;
        this._speed += 2;
    }
    public makeHeroInvulnerable() {
        this.hero.isInvulnerable = true;
        this.hero.heroHtmlElement.classList.add('healthBlinking');
        if (this.hero.isInvulnerable) {
            this._subscription?.unsubscribe();
            this._subscription = this._timer$.subscribe(this._shieldObserver);
        } else {
            this._subscription = this._timer$.subscribe(this._shieldObserver);
        }
    }
}