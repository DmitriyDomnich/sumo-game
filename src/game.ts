import { from, interval } from 'rxjs';
import { find, takeWhile, tap } from 'rxjs/operators';
import { Hero } from './models/hero';
import './styles/_game.scss';
import { GameState } from './models/game-state';
import { Tooltip } from 'bootstrap';
import { GameObject } from './models/objects/game-object';
import { MobCreator } from './models/mob-creator';
import { Upgrade } from './models/hero-upgrades/upgrade';



if (!localStorage.getItem('results')) {
    localStorage.setItem('results', JSON.stringify(new Array<number>()));
}

Hero.getInstance();
const heroElement: HTMLElement = document.querySelector('#hero')!;


const mobCreator = new MobCreator();

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new Tooltip(tooltipTriggerEl)
})

interval(50).pipe(takeWhile(GameState.checkHealth)).subscribe(_ => {
    checkCollision();
});

function checkCollision(): void {
    const heroCoords = heroElement.getBoundingClientRect();
    const mobs = from(document.querySelectorAll(`[data-name]`))!;

    mobs.pipe(
        tap((mobEl: any) => {
            const mobCoords = mobEl.getBoundingClientRect();

            if (mobCoords.x < heroCoords.x + heroCoords.width &&
                mobCoords.x + mobCoords.width > heroCoords.x &&
                mobCoords.y < heroCoords.y + heroCoords.height &&
                mobCoords.y + mobCoords.height > heroCoords.y) {
                mobEl.dataset.name.startsWith('mob')
                    ? from(mobCreator.mobs).pipe(find((mob: GameObject) => mob.name === mobEl.dataset.name)).subscribe({
                        next: mob => mob?.onCollide()
                    })
                    : from(mobCreator.upgrades).pipe(find((upgrade: Upgrade) => upgrade.name === mobEl.dataset.name)).subscribe({
                        next: upgrade => upgrade?.onCollide()
                    });
            }
        })
    ).subscribe();
}
