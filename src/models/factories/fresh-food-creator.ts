import { of } from "rxjs";
import { FreshFood } from "../objects/fresh-food";
import { MobCreatorFactory } from "./mob-creator-factory";

export class FreshFoodCreator extends MobCreatorFactory {
    public createSingleMob() {
        return new FreshFood();
    }
    public createWave(numberOfMobs: number) {
        const wave: Array<FreshFood> = [];
        for (let i = 0; i < numberOfMobs; i++) {
            wave.push(new FreshFood());
        }
        return of(wave);
    }
}