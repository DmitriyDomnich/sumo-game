import { timer } from "rxjs";
import { mergeWith, switchMap } from "rxjs/operators";
import { FreshFoodCreator } from "./factories/fresh-food-creator"
import { PufferFishCreator } from "./factories/puffer-fish-creator";
import { RottenFoodCreator } from "./factories/rotten-food-creator";
import { SumoistCreator } from "./factories/sumoist-creator";
import { UpgradeCreator } from "./factories/upgrade-creator";
import { Upgrade } from "./hero-upgrades/upgrade";
import { GameObject } from "./objects/game-object";

export class MobCreator {

    private readonly _defaultDelay = 750;
    private readonly _freshFoodCreator = new FreshFoodCreator();
    private readonly _rottenFoodCreator = new RottenFoodCreator();
    private readonly _sumoistCreator = new SumoistCreator();
    private readonly _pufferFishCreator = new PufferFishCreator();
    private readonly _upgradeCreator = new UpgradeCreator();
    private _mobs = new Array<GameObject>();
    private _upgrades = new Array<Upgrade>();

    constructor() {
        const freshFood$ = timer(this._defaultDelay, this.getRandomIntervalTime()).pipe(
            switchMap(_ => timer(this._defaultDelay, this.getRandomIntervalTime())
                .pipe(switchMap(_ => this._freshFoodCreator.createWave(this.getRandomMobNumber(10)))
                )));
        const rottenFood$ = timer(this._defaultDelay, this.getRandomIntervalTime()).pipe(
            switchMap(_ => timer(this._defaultDelay, this.getRandomIntervalTime())
                .pipe(switchMap(_ => this._rottenFoodCreator.createWave(this.getRandomMobNumber(10)))
                )));
        const sumoist$ = timer(this._defaultDelay, this.getRandomIntervalTime()).pipe(
            switchMap(_ => timer(this._defaultDelay, this.getRandomIntervalTime())
                .pipe(switchMap(_ => this._sumoistCreator.createWave(this.getRandomMobNumber(6)))
                )));
        const pufferFish$ = timer(this._defaultDelay, this.getRandomIntervalTime()).pipe(
            switchMap(_ => timer(this._defaultDelay, this.getRandomIntervalTime())
                .pipe(switchMap(_ => this._pufferFishCreator.createWave(this.getRandomMobNumber(4)))
                )));
        const upgrades$ = timer(1000, 3000).pipe(
            switchMap(_ => this._upgradeCreator.createUpgrade())
        );
        const res$ = freshFood$.pipe(mergeWith(pufferFish$, rottenFood$, sumoist$));
        upgrades$.subscribe({
            next: upgrade => {
                this.upgrades.push(upgrade);
                this.upgrades = this.upgrades.filter(upgrade => document.querySelector(`[data-name="${upgrade.name}"]`));
            }
        })
        res$.subscribe({
            next: (mobs: GameObject[]) => {
                mobs.forEach(mob => mob.move());
                this.mobs.push(...mobs);
                this.mobs = this.mobs.filter(mob => document.querySelector(`[data-name="${mob.name}"]`));
            }
        });
    }

    public get mobs(): Array<GameObject> {
        return this._mobs;
    }
    public set mobs(mobs: GameObject[]) {
        this._mobs = mobs;
    }
    public get upgrades(): Upgrade[] {
        return this._upgrades;
    }
    public set upgrades(val: Upgrade[]) {
        this._upgrades = val;
    }

    private getUpgradeIntervalTime(): number {
        return Math.round(Math.random() * 15000 + 6000)
    }
    private getRandomIntervalTime(): number {
        return Math.round(Math.random() * 6000 + 5000);
    }
    private getRandomMobNumber(max: number): number {
        return Math.round(Math.random() * max);
    }

}