import { Point } from 'electron';
import { hide, moved, show } from './util';

const WIDTH = 620;
const TINY_WIDTH = 190;

type Page = 'home' | 'timer' | 'tinyTimer';

export const $page: Record<Page, HTMLElement> = {
    home: document.querySelector('.home')!,
    timer: document.querySelector('.timer')!,
    tinyTimer: document.querySelector('.tiny-timer')!
}

let activePage: Page;

let pos: Point;
let tinyPos: Point = { x: screen.availWidth - 50 - 190, y: screen.availHeight - 50 - 85 };

async function getPoint(): Promise<Point> {
    let bounds = await electron.getBounds();
    return { x: bounds.x, y: bounds.y }
}

export async function switchPage(page: Page){

    let x: number | undefined;
    let y: number | undefined;

    // hide last page
    if(activePage){

        if(activePage == 'tinyTimer'){
            electron.setAlwaysOnTop(false);
            cancelTinyTimerFade();
            x = pos.x;
            y = pos.y;
            tinyPos = await getPoint();
        }

        hide($page[activePage]);

    }
    
    // show new page

    show($page[page]);
    activePage = page;

    let rect = $page[page].getBoundingClientRect();
    let width = WIDTH;
    let height = rect.height + rect.y;

    if(page == 'tinyTimer'){
        electron.setAlwaysOnTop(true);
        tinyTimerFade();
        width = TINY_WIDTH;
        x = tinyPos.x;
        y = tinyPos.y;
        pos = await getPoint();
    }
    
    if(page == 'home'){
        height += 300;
    }

    electron.setBounds({ x, y, width, height }); 

}

// Timer ↔ Tiny Timer

addEventListener('blur', ()=>activePage == 'timer' && switchPage('tinyTimer'));

let willOpen = false;
addEventListener('mousedown', ()=>activePage == 'tinyTimer' && (willOpen = true));
addEventListener('mousemove', e=>activePage == 'tinyTimer' && willOpen && moved(e) && (willOpen = false));
addEventListener('mouseup', ()=>activePage == 'tinyTimer' && willOpen && switchPage('timer'));

// Tiny Timer Fade

const $tinyTime: HTMLDivElement = $page.tinyTimer.querySelector('.time')!;
let fadeTimeout: NodeJS.Timeout;

function tinyTimerFade(){
    if(activePage != 'tinyTimer') return;
    if($tinyTime.classList.contains('ended')) return;
    fadeTimeout = setTimeout(()=>$page.tinyTimer.classList.add('fade'), 3e3);
}

export function cancelTinyTimerFade(){
    if(activePage != 'tinyTimer') return;

    clearTimeout(fadeTimeout);
    $page.tinyTimer.classList.remove('fade');
}

addEventListener('mousemove', ()=>{
    if(activePage != 'tinyTimer') return;
    cancelTinyTimerFade();
    tinyTimerFade();
});
