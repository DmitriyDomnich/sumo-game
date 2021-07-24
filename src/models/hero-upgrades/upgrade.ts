import { v4 as generateCode } from "uuid";
import { GameState } from "../game-state";
import { ObjectPosition } from "../object-position";

export abstract class Upgrade {

    private readonly _name: string;
    protected readonly respawnPoint: ObjectPosition;
    protected readonly gameState: GameState = GameState.getInstance();
    public readonly size = { width: 35 };

    constructor(upgradeType: string) {
        this._name = `upgrade-${upgradeType}->${generateCode()}`;
        this.respawnPoint = this.getRandomRespawnPoint();
    }

    public get name(): string {
        return this._name;
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

    public abstract onCollide(): void;
}