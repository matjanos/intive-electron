import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer } from 'electron';
import * as childProcess from 'child_process';

@Injectable()
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  childProcess: typeof childProcess;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.childProcess = window.require('child_process');
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

  sendIpcMsg(topic: string, ...args) {
    if (!this.isElectron()) {
      console.warn('Can\'t send message since it\'s not Electron app')
      return;
    }

    this.ipcRenderer.send(topic, args);
  }

  subscribeToIpcMsg(topic: string, callback: (sender:any, msg: any) => void) {
    var a = this.ipcRenderer.on(topic, callback);
  }
}
