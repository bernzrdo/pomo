import { Rectangle } from 'electron';
import '@tabler/icons-webfont/dist/tabler-icons.min.css';
import './font.scss';
import './index.scss';
import './lib/window';
import './lib/flow';
import './lib/timer';
import './lib/init';

declare global {
    const electron: {
        getBounds: ()=>Promise<Rectangle>;
        setBounds: (options: Partial<Rectangle & { relative: boolean }>)=>void;
        setClickThrough: (state: boolean)=>void;
        setAlwaysOnTop: (state: boolean)=>void;
        minimize: ()=>void;
        close: ()=>void;
    }
}