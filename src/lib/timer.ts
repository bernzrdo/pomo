import { $page, cancelTinyTimerFade, switchPage } from './flow';
import { addLog, logs, renderLogs } from './logs';
import { hide, pad, show } from './util';

export type Mode = 'Focus' | 'Short break' | 'Long break';

const DURATION: Record<Mode, number> = {
    'Focus': 25 * 60 * 1e3,
    'Short break': 5 * 60 * 1e3,
    'Long break': 15 * 60 * 1e3
}

class Timer {

    mode: Mode;
    start: Date;
    end: Date;
    ended = false;

    #time: number;
    #runningSince: number | null;

    constructor(mode: Mode){
        this.mode = mode;
        this.#time = DURATION[mode];
        this.#updateState();
        switchPage('timer');
    }

    get paused(){
        return this.#runningSince == null;
    }

    get time(){

        let time = this.#time;

        if(!this.paused)
            time -= Date.now() - this.#runningSince!;

        if(time < 0){
            this.#end();
            return 0;
        }

        return time;
    }

    pause(){
        if(this.paused) return;

        this.#time = this.time;
        this.#runningSince = null;
        this.#updateState();

        this.end = new Date();

    }

    resume(){
        if(!this.paused) return;

        if(!this.start) this.start = new Date();

        this.#runningSince = Date.now();
        this.#updateState();

    }

    stop(){
        
        this.pause();

        if(this.start){
            addLog({
                mode: this.mode,
                duration: DURATION[this.mode] - this.time,
                start: this.start,
                end: this.end
            });
        }

        updateHome();
        switchPage('home');
    }

    #end(){
        if(this.ended) return;
        this.ended = true;
        this.pause();
        cancelTinyTimerFade();
    }

    #updateState(){

        $mode.innerText = this.mode;

        hide($pauseBtn);
        hide($resumeBtn);
        if(!this.ended) show(this.paused ? $resumeBtn : $pauseBtn);
        
        for(let $time of $times){
            if(this.ended) $time.classList.add('ended');
            else $time.classList.remove('ended');
        }

        this.#update();
    }

    #update(){

        // update time
        for(let $time of $times){
            this.#updateTime($time.querySelector('.fill')!);
            this.#updateTime($time.querySelector('.stroke')!);
        }

        // progress
        let progress = 100 - (this.time * 100 / DURATION[this.mode]);
        for(let $bar of $progressBars){
            $bar.style.transform = `translateX(-${progress}%)`
        }

        if(!this.paused) requestAnimationFrame(()=>this.#update());
    }

    #updateTime($parent: HTMLDivElement){

        const $colon: HTMLDivElement = $parent.querySelector('.colon')!;
        const d = (i: number): HTMLDivElement =>$parent.querySelector(`.digit-${i}`)!;

        let m = pad(Math.floor(this.time / 1e3 / 60));
        let s = pad(Math.floor(this.time / 1e3) % 60);

        // set numbers
        d(0).setAttribute('number', m[0]);
        d(1).setAttribute('number', m[1]);
        // :
        d(2).setAttribute('number', s[0]);
        d(3).setAttribute('number', s[1]);

        // clear fade
        d(0).classList.remove('fade');
        d(1).classList.remove('fade');
        $colon.classList.remove('fade');
        d(2).classList.remove('fade');
        d(3).classList.remove('fade');

        // add fade
        if(m[0] == '0'){
            d(0).classList.add('fade');

            if(m[1] == '0'){
                d(1).classList.add('fade');

                if(s[0] == '0'){
                    $colon.classList.add('fade');
                    d(2).classList.add('fade');

                    if(s[1] == '0'){
                        d(3).classList.add('fade');
                    }

                }
            }
        }

    }

}

export let timer: Timer | null = null;

const $focus: HTMLButtonElement = $page.home.querySelector('.modes .focus')!;
const $shortBreak: HTMLButtonElement = $page.home.querySelector('.modes .short-break')!;
const $longBreak: HTMLButtonElement = $page.home.querySelector('.modes .long-break')!;

     $focus.addEventListener('click', ()=>timer = new Timer('Focus'));
$shortBreak.addEventListener('click', ()=>timer = new Timer('Short break'));
 $longBreak.addEventListener('click', ()=>timer = new Timer('Long break'));

const $times: NodeListOf<HTMLDivElement> = document.querySelectorAll('.time');
const $progressBars: NodeListOf<HTMLDivElement> = document.querySelectorAll('.progress .bar');
const $mode: HTMLDivElement = $page.timer.querySelector('.mode')!;

const $pauseBtn: HTMLButtonElement = $page.timer.querySelector('.pause-btn')!;
$pauseBtn.addEventListener('click', ()=>timer && timer.pause())

const $resumeBtn: HTMLButtonElement = $page.timer.querySelector('.resume-btn')!;
$resumeBtn.addEventListener('click', ()=>timer && timer.resume());

const $stopBtn: HTMLButtonElement = $page.timer.querySelector('.stop-btn')!;
$stopBtn.addEventListener('click', ()=>{
    if(!timer) return;

    timer.stop();
    timer = null;

});

export function updateHome(){
    highlight();
    renderLogs();
}

function highlight(){

    // remove highlight
    $focus.classList.remove('highlight');
    $shortBreak.classList.remove('highlight');
    $longBreak.classList.remove('highlight');

    // if user is starting or just took a break
    // highlight focus mode
    let lastLog = logs[0];
    if(
        logs.length == 0 ||
        lastLog?.mode == 'Short break' ||
        lastLog?.mode == 'Long break'
    ){
        $focus.classList.add('highlight');
        return;
    }

    // count how focused user has been since a long break
    let focusTime = 0;
    for(let { mode, duration } of logs){
        if(mode == 'Focus') focusTime += duration;
        if(mode == 'Long break') break;
    }

    // if user has been focused for less than 4 * focus durations
    // highlight short break
    if(focusTime < 4 * DURATION.Focus) $shortBreak.classList.add('highlight');
    // else highlight long break
    else $longBreak.classList.add('highlight');

}

