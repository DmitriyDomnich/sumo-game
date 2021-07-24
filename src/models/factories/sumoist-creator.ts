import { of } from "rxjs";
import { Sumoist } from "../objects/sumoist";
import { MobCreatorFactory } from "./mob-creator-factory";

export class SumoistCreator extends MobCreatorFactory {
    public createSingleMob() {
        return new Sumoist();
    }
    public createWave(numberOfMobs: number) {
        const wave: Array<Sumoist> = [];
        for (let i = 0; i < numberOfMobs; i++) {
            wave.push(new Sumoist());
        }
        return of(wave);
    }
}