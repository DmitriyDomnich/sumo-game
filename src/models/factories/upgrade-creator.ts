import { Observable, of } from "rxjs";
import { GunUpgrade } from "../hero-upgrades/gun-upgrade";
import { ShieldUpgrade } from "../hero-upgrades/shield-upgrade";
import { Upgrade } from "../hero-upgrades/upgrade";

export class UpgradeCreator {

    public createUpgrade(): Observable<Upgrade> {
        return Math.round(Math.random()) ? of(new ShieldUpgrade()) : of(new GunUpgrade());
    }

}