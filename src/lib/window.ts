
// Click-through

import { moved } from './util';

let isClickThrough = false;

addEventListener('mouseover', e=>{
    
    let isRoot = e.target == document.documentElement;
    
    if(isRoot != isClickThrough){
        isClickThrough = isRoot;
        electron.setClickThrough(isClickThrough);
    }

});

// App Drag

let dragging = false;

for(let $drag of document.querySelectorAll('.app-drag') as NodeListOf<HTMLElement>){
    $drag.addEventListener('mousedown', ()=>{
        dragging = true;
        document.body.classList.add('dragging');
    });
}

addEventListener('mousemove', e=>{
    if(!dragging || !moved(e)) return;
    electron.setBounds({
        x: e.movementX,
        y: e.movementY,
        relative: true
    });
});

addEventListener('mouseup', ()=>{
    if(!dragging) return;

    dragging = false;
    document.body.classList.remove('dragging');

});
