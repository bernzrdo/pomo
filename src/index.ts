import { app, BrowserWindow, globalShortcut, ipcMain, Menu, Rectangle, shell } from 'electron';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if(require('electron-squirrel-startup'))
    app.quit();

function isDev(){
    return process.env['WEBPACK_SERVE'] === 'true';
}

function createWindow(){

    const win = new BrowserWindow({
        icon: 'assets/icon.png',
        title: 'Pomo',
        transparent: true,
        frame: false,
        resizable: false,
        fullscreenable: false,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            devTools: isDev()
        }
    });

    if(isDev()) win.webContents.openDevTools();

    Menu.setApplicationMenu(Menu.buildFromTemplate([]));

    win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    let bounds = win.getBounds();
    x = bounds.x;
    y = bounds.y;

    win.webContents.setWindowOpenHandler(details=>{
        shell.openExternal(details.url);
        return { action: 'deny' }
    });

};

app.on('ready', createWindow);

app.on('window-all-closed', ()=>{

    if(process.platform !== 'darwin')
        app.quit();

});

app.on('activate', ()=>{

    if(BrowserWindow.getAllWindows().length === 0)
        createWindow();

});

let x: number;
let y: number;
let width: number;
let height: number;

ipcMain.handle('get-bounds', e=>{
    const win = BrowserWindow.fromWebContents(e.sender);
    return win?.getBounds();
});

ipcMain.on('set-bounds', (e, options: Partial<Rectangle & { relative: boolean }>)=>{

    const win = BrowserWindow.fromWebContents(e.sender);
    if(!win) return;
    
    if(!options.relative){
        x = options.x ?? x;
        y = options.y ?? y;
    }else{
        x += options.x ?? 0;
        y += options.y ?? 0;
    }

    width = options.width ?? width;
    height = options.height ?? height;

    win.setBounds({ x, y, width, height }, false);

});

ipcMain.on('set-click-through', (e, state: boolean)=>{
    const win = BrowserWindow.fromWebContents(e.sender);
    win?.setIgnoreMouseEvents(state, state ? { forward: true } : undefined);
});

let onTop: Record<number, NodeJS.Timeout> = {};

ipcMain.on('set-always-on-top', (e, state: boolean)=>{
    const win = BrowserWindow.fromWebContents(e.sender);
    if(!win) return;
    
    win.setAlwaysOnTop(state);
    if(state)
        onTop[win.id] = setInterval(()=>!win.isDestroyed() && win.moveTop());
    else
        clearInterval(onTop[win.id]);
    
});

ipcMain.on('minimize', e=>{
    const win = BrowserWindow.fromWebContents(e.sender);
    win?.minimize();
});

ipcMain.on('close', e=>{
    const win = BrowserWindow.fromWebContents(e.sender);
    win?.close();
});
