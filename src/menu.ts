import { Howl } from 'howler';
import { fromEvent, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import './styles/_menu.scss';
import gongHit from "./assets/sounds/gong-hit.mp3";

const scores = JSON.parse(localStorage.getItem('results')!);


for (const score of scores) {
    const li = document.createElement('li');
    li.innerHTML = score;
    document.querySelector('ol')?.appendChild(li);
}
fromEvent(document.getElementById('startGame')!, 'click').pipe(
    tap(_ => new Howl({ autoplay: true, src: gongHit })),
    switchMap(_ => timer(2000))
).subscribe({
    next: _ => {
        location.replace('./index.html');
    }
});