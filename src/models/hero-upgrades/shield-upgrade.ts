import { Upgrade } from "./upgrade";
import shield from "../../assets/svgs/shield.svg";
import { timer } from "rxjs";

export class ShieldUpgrade extends Upgrade {

    constructor() {
        super('shield');

        const div = document.createElement('div');
        div.dataset.name = this.name;
        div.innerHTML = shield;
        div.style.width = this.size.width + 'px';
        div.classList.add('mob');

        div.style[this.respawnPoint.x.side] = this.respawnPoint.x.coord + 'px';
        this.respawnPoint.y.side === 'bottom' && this.respawnPoint.y.coord == 0
            ? div.style[this.respawnPoint.y.side] = this.respawnPoint.y.coord + this.size.width + 'px'
            : div.style[this.respawnPoint.y.side] = this.respawnPoint.y.coord + '%';

        document.querySelector('section')?.appendChild(div);
        timer(8000).subscribe(_ => document.querySelector(`[data-name="${this.name}"]`)?.remove());
    }
    public onCollide() {
        const upgrade: HTMLDivElement = document.querySelector(`[data-name="${this.name}"]`)!;
        upgrade.remove();

        this.gameState.makeHeroInvulnerable();
    }
}