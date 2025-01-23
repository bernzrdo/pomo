
export function show($element: HTMLElement){
    $element.style.removeProperty('display');
}

export function hide($element: HTMLElement){
    $element.style.display = 'none';
}

export function moved(e: MouseEvent){
    return e.movementX != 0 || e.movementY != 0;
}

export function toTime(date: Date){
    
    let h = pad(date.getHours());
    let m = pad(date.getMinutes());

    return `${h}:${m}`;
}

export function pad(number: number){
    return number.toString().padStart(2, '0')
}