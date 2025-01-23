import { contextBridge, ipcRenderer, Rectangle } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    getBounds: ()=>ipcRenderer.invoke('get-bounds'),
    setBounds: (options: Partial<Rectangle & { relative: boolean }>)=>ipcRenderer.send('set-bounds', options),
    setClickThrough: (state: boolean)=>ipcRenderer.send('set-click-through', state),
    setAlwaysOnTop: (state: boolean)=>ipcRenderer.send('set-always-on-top', state),
    minimize: ()=>ipcRenderer.send('minimize'),
    close: ()=>ipcRenderer.send('close')
});