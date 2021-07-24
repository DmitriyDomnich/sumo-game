import { of } from "rxjs";
import { PufferFish } from "../objects/puffer-fish";
import { MobCreatorFactory } from "./mob-creator-factory";

export class PufferFishCreator extends MobCreatorFactory {
    public createSingleMob() {
        return new PufferFish();
    }
    public createWave(numberOfMobs: number) {
        const wave: Array<PufferFish> = [];
        for (let i = 0; i < numberOfMobs; i++) {
            wave.push(new PufferFish());
        }
        return of(wave);
    }
}