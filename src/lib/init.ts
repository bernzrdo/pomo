import { $page, switchPage } from './flow';
import { version } from './../../package.json';
import { updateHome } from './timer';

const ICONS = {

    minimize: 
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+
            '<path stroke="none" d="M0 0h24v24H0z" fill="none"/>'+
            '<path d="M5 12l14 0" />'+
        '</svg>',
    
    close:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+
            '<path stroke="none" d="M0 0h24v24H0z" fill="none"/>'+
            '<path d="M18 6l-12 12" />'+
            '<path d="M6 6l12 12" />'+
        '</svg>',

    hourglass:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">'+
            '<path stroke="none" d="M0 0h24v24H0z" fill="none"/>'+
            '<path d="M6.5 7h11" />'+
            '<path d="M6.5 17h11" />'+
            '<path d="M6 20v-2a6 6 0 1 1 12 0v2a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1z" />'+
            '<path d="M6 4v2a6 6 0 1 0 12 0v-2a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1z" />'+
        '</svg>',

    pause:
        '<svg viewBox="0 0 24 24" fill="currentColor">'+
            '<path stroke="none" d="M0 0h24v24H0z" fill="none"/>'+
            '<path d="M9 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" />'+
            '<path d="M17 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" />'+
        '</svg>',
    
    resume:
        '<svg viewBox="0 0 24 24" fill="currentColor">'+
            '<path stroke="none" d="M0 0h24v24H0z" fill="none"/>'+
            '<path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" />'+
        '</svg>',

    stop:
        '<svg viewBox="0 0 24 24" fill="currentColor">'+
            '<path stroke="none" d="M0 0h24v24H0z" fill="none"/>'+
            '<path d="M17 4h-10a3 3 0 0 0 -3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3 -3v-10a3 3 0 0 0 -3 -3z" />'+
        '</svg>',

    
    
}

function pre($element: HTMLElement, html: string){
    $element.innerHTML = html + $element.innerHTML;
}

// Controls
for(let $controls of document.querySelectorAll('.title-bar .controls') as NodeListOf<HTMLDivElement>){

    const $minimizeBtn = document.createElement('button');
    $minimizeBtn.innerHTML = ICONS.minimize;
    $minimizeBtn.addEventListener('click', ()=>electron.minimize());
    $controls.appendChild($minimizeBtn);

    const $closeBtn = document.createElement('button');
    $closeBtn.innerHTML = ICONS.close;
    $closeBtn.addEventListener('click', ()=>electron.close());
    $controls.appendChild($closeBtn);

}

// Modes Icon
for(let $btn of $page.home.querySelectorAll('.modes button') as NodeListOf<HTMLButtonElement>)
    pre($btn, ICONS.hourglass);

// Time
for(let $time of document.querySelectorAll('.time') as NodeListOf<HTMLDivElement>){
    
    function div($parent: HTMLDivElement, className: string){
        const $digit = document.createElement('div');
        $digit.className = className;
        $parent.appendChild($digit);
    }

    function display($parent: HTMLDivElement){
        div($parent, 'digit-0');
        div($parent, 'digit-1');
        div($parent, 'colon');
        div($parent, 'digit-2');
        div($parent, 'digit-3');
    }

    const $fill = document.createElement('div');
    $fill.className = 'fill';
    display($fill)
    $time.appendChild($fill);
    
    const $stroke = document.createElement('div');
    $stroke.className = 'stroke';
    display($stroke)
    $time.appendChild($stroke);

}

// Timer Icons
pre($page.timer.querySelector('.pause-btn')!, ICONS.pause);
pre($page.timer.querySelector('.resume-btn')!, ICONS.resume);
pre($page.timer.querySelector('.stop-btn')!, ICONS.stop);

// Footer
for(let $footer of document.querySelectorAll('.footer') as NodeListOf<HTMLDivElement>){
    
    const $version = document.createElement('div');
    $version.innerText = `v${version}`;
    $footer.appendChild($version);

    $footer.innerHTML += '·';
    
    const $sourceCode = document.createElement('a');
    $sourceCode.href = 'https://github.com/bernzrdo/pomo';
    $sourceCode.innerText = 'Source Code';
    $footer.appendChild($sourceCode);

    $footer.innerHTML += '·';
    
    const $feedback = document.createElement('a');
    $feedback.href = 'https://tally.so/r/npRadq';
    $feedback.innerText = 'Feedback';
    $footer.appendChild($feedback);

}

// Render
updateHome();

// Start
switchPage('home');