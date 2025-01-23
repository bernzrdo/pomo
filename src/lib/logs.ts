import { $page } from './flow';
import { Mode } from './timer';
import { toTime } from './util';

interface Log {
    mode: Mode;
    duration: number;
    start: Date;
    end: Date;
}

const $logs: HTMLDivElement = $page.home.querySelector('.logs')!;

export let logs: Log[] = [];

export function addLog(log: Log){

    let lastLog = logs[0];
    if(
        lastLog && // last log exists
        lastLog.mode == log.mode && // is the same mode
        Date.now() - lastLog.end.getTime() < 1.5 * 60 * 60 * 1e3 // was less than 1.5 hours ago
    ){

        // increment duration
        lastLog.duration += log.duration;
        lastLog.end = log.end;

        return;
    }

    // create new log
    logs.unshift(log);

}

export function renderLogs(){

    function separator(){
        const $sep = document.createElement('div');
        $sep.innerText = '---------------------------';
        $logs.appendChild($sep);
    }

    // clear logs
    $logs.innerHTML = '';

    // title
    const $title = document.createElement('div');
    $title.className = 'title';
    $title.innerText = 'Logs';
    $logs.appendChild($title);

    // logs
    for(let log of logs){

        separator();

        const $log = document.createElement('div');
        $log.className = 'log';

            const $mode = document.createElement('div');
            $mode.className = 'mode';

                const $name = document.createElement('div');
                $name.className = 'name';
                $name.innerText = log.mode;
                $mode.appendChild($name);

                const $duration = document.createElement('div');
                $duration.className = 'duration';
                $duration.innerText = parseDuration(log.duration);
                $mode.appendChild($duration);

            $log.appendChild($mode);

            const $time = document.createElement('div');
            $time.className = 'time';

                const $start = document.createElement('div');
                $start.innerText = toTime(log.start);
                $time.appendChild($start);
            
                const $end = document.createElement('div');
                $end.innerText = toTime(log.end);
                $time.appendChild($end);
            
            $log.appendChild($time);

        $logs.appendChild($log);

    }

    if(logs.length > 0){

        separator();

        const $end = document.createElement('div');
        $end.className = 'end';
        $end.innerText = 'No more logs.';
        $logs.appendChild($end);

    }else{

        const $noLogs = document.createElement('div');
        $noLogs.className = 'no-logs';
        $noLogs.innerText = 'No logs yet.';
        $logs.appendChild($noLogs);

    }

}

function parseDuration(duration: number){

    let min = Math.floor(duration / 1e3 / 60);
    if(min > 0) return `${min} min`;

    let sec = Math.floor(duration / 1e3);
    return `${sec} sec`;
}