import { Observable } from "rxjs";
import { GameObject } from "../objects/game-object";

export abstract class MobCreatorFactory {
    public abstract createSingleMob(): GameObject;
    public abstract createWave(numberOfMobs: number): Observable<Array<GameObject>>;
}