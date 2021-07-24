import { from, of } from "rxjs";
import { RottenFood } from "../objects/rotten-food";
import { MobCreatorFactory } from "./mob-creator-factory";

export class RottenFoodCreator extends MobCreatorFactory {
    public createSingleMob() {
        return new RottenFood();
    }
    public createWave(numberOfMobs: number) {
        const wave: Array<RottenFood> = [];
        for (let i = 0; i < numberOfMobs; i++) {
            wave.push(new RottenFood());
        }
        return of(wave);
    }
}