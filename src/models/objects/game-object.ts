import { interval, Subject } from "rxjs";
import { GameState } from "../game-state";
import { Svg } from "../interfaces/svg";
import { ObjectPosition } from "../object-position";
import { Stats } from "../stats-model";
import { v4 as generateCode } from 'uuid';

export abstract class GameObject {

    private readonly _defaultWidth = 35;
    private readonly _defaultSpeed = 10;
    protected readonly respawnPoint: ObjectPosition;
    protected _name: string = '';
    protected readonly gameState: GameState = GameState.getInstance();
    protected stats: Stats;

    constructor(mobType: string) {
        this.stats = {
            speed: this.getRandomSpeed(),
            size: {
                width: this.getRandomSizeBetweenLowestAndHighest()
            }
        };
        this.respawnPoint = this.getRandomRespawnPoint();
        this.name = `mob-${mobType}->${generateCode()}`;
    }

    public get name(): string {
        return this._name;
    }
    public set name(val: string) {
        this._name = val;
    }
    abstract onCollide(): void;

    private getRandomSizeBetweenLowestAndHighest(): number {
        return Math.random() * (this._defaultWidth + this.gameState.additionalSize - this._defaultWidth) + this._defaultWidth;
    }
    private getRandomSpeed(): number {
        return Math.random() * (this._defaultSpeed + this.gameState.speed - this._defaultSpeed) + this._defaultSpeed;
    }
    protected getRandomRespawnPoint(): ObjectPosition {
        const coords = {
            xCoords: ['left', 'right'],
            yCoords: ['top', 'bottom']
        };

        const randPlace = () => Math.round(Math.random());
        const randCoord = (coord: number) => Math.random() * coord;

        let respawnPoint = {
            x: {
                side: coords.xCoords[randPlace()],
                coord: +randCoord(innerWidth * 80 / 100).toFixed(0)
            },
            y: {
                side: coords.yCoords[randPlace()],
                coord: randCoord(80)
            }
        };

        if (Math.round(Math.random())) {
            respawnPoint.x.coord = 0;
        } else {
            respawnPoint.y.coord = 0;
        }

        return respawnPoint;
    }
    protected getRandomSvg(svgs: Svg[]) {
        return svgs[Math.floor((Math.random() * svgs.length))];
    }
    protected getMoveDirection(): { side: string } {
        let direction!: { side: string };
        if (!this.respawnPoint.x.coord) {
            this.respawnPoint.x.side === 'left'
                ? direction = { side: 'left' }
                : direction = { side: 'right' };
        } else if (!this.respawnPoint.y.coord) {
            this.respawnPoint.y.side === 'top'
                ? direction = { side: 'top' }
                : direction = { side: 'bottom' };
        }
        return direction;
    }
    public move(): void {
        const { side } = this.getMoveDirection();
        const mob: HTMLDivElement = document.querySelector(`[data-name^="${this.name}"]`)!;

        let size: number;

        const h1 = document.querySelector('h1')!.clientHeight;

        side === 'right' || side === 'left'
            ? size = (innerWidth * 80 / 100)
            : size = innerHeight - h1 - document.querySelector('.head')!.clientHeight;

        const inter$ = interval(100).subscribe({
            next: _ => {
                mob.style[side] = (+mob.style[side].slice(0, mob.style[side].length - 2)) + this.stats.speed + 'px';
                if (+mob.style[side].slice(0, mob.style[side].length - 2) > size) {
                    mob.remove();
                    inter$.unsubscribe();
                }
            }
        });
    };
}