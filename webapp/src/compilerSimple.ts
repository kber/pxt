import compileOptions from './compileOptions';
import compilerFiles from './compilerFiles';
import pxtparts from './pxtparts';
import MICROBIT_BOARD_DEFINITION from './boards/microbit';

const global: any = window;
global.compileOptions = compileOptions;

export class PromiseQueue {
  promises: any = {};

  enqueue<T>(id: string, f: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      let arr = this.promises[id];
      if (!arr) {
        arr = this.promises[id] = [];
      }
      arr.push(() =>
        f()
          .finally(() => {
            arr.shift();
            if (arr.length == 0) delete this.promises[id];
            else arr[0]();
          })
          .then(resolve, reject)
      );
      if (arr.length == 1) arr[0]();
    });
  }
}


let noOpAsync = new Promise<any>(() => {});

function catchUserErrorAndSetDiags(r: any) {
  return (v: any) => {
    if (v.isUserError) {
      return Promise.resolve();
    } else return Promise.reject(v);
  };
}

export interface CompileOptions {
  trace?: boolean;
  native?: boolean;
  debug?: boolean;
  debugExtensionCode?: boolean;
  background?: boolean; // not explicitly requested by user (hint for simulator)
  forceEmit?: boolean;
  clickTrigger?: boolean;
}

export let emptyProgram = `(function (ectx) {
'use strict';
ectx.runtime.setupPerfCounters([]);
ectx.setupDebugger(1)
return function (s) {
    // START
    ectx.runtime.kill()
    return ectx.leave(s, s.r0)
}
})
`;

export function emptyCompileResult(): pxtc.CompileResult {
  return {
    success: true,
    diagnostics: [],
    times: {},
    breakpoints: [],
    outfiles: {
      'binary.js': emptyProgram.replace('// START', '')
    }
  };
}

export function compileAsync(code: string): Promise<pxtc.CompileResult> {
  compileOptions.fileSystem['main.ts'] = code;
  return compileCoreAsync(compileOptions as any)
    .then(resp => {
      return ensureApisInfoAsync().then(() => {
        if (!resp.usedSymbols || !cachedApis) return resp;
        for (let k of Object.keys(resp.usedSymbols)) {
          resp.usedSymbols[k] = lookup(cachedApis.byQName, k);
        }
        return resp;
      });
    })
    .then(resp => {
      return getRunOptions(resp);
    })
    .catch(catchUserErrorAndSetDiags(noOpAsync));
}

function assembleCore(src: string): Promise<{ words: number[] }> {
  return workerOpAsync('assemble', { fileContent: src });
}

export function assembleAsync(src: string) {
  let stackBase = 0x20004000;
  return assembleCore(`.startaddr ${stackBase - 256}\n${src}`).then(r => {
    return assembleCore(`.startaddr ${stackBase - (r.words.length + 1) * 4}\n${src}`).then(rr => {
      if (rr.words.length == r.words.length) throw new Error('assemble length equals!');
      return rr;
    });
  });
}

function compileCoreAsync(opts: pxtc.CompileOptions): Promise<pxtc.CompileResult> {
  return workerOpAsync('compile', { options: opts });
}

export function py2tsAsync(): Promise<{
  generated: any;
  diagnostics: pxtc.KsDiagnostic[];
}> {
  return Promise.resolve(null);
}

export function completionsAsync(
  fileName: string,
  position: number,
  fileContent?: string
): Promise<pxtc.CompletionInfo> {
  return workerOpAsync('getCompletions', {
    fileName,
    fileContent,
    position
    // runtime: pxt.appTarget.runtime
  });
}

export function syntaxInfoAsync(
  infoType: pxtc.InfoType,
  fileName: string,
  position: number,
  fileContent: string
): Promise<pxtc.SyntaxInfo> {
  return workerOpAsync('syntaxInfo', {
    fileName,
    fileContent,
    position,
    infoType
  });
}

export function workerOpAsync(op: string, arg: pxtc.service.OpArg) {
  return pxt.worker
    .getWorker('/worker.js')
    .opAsync(op, arg)
    .then(res => {
      return res;
    });
}

let firstTypecheck: Promise<void>;
let cachedApis: pxtc.ApisInfo;
let refreshApis = false;

function ensureApisInfoAsync(): Promise<void> {
  if (refreshApis || !cachedApis)
    return (
      workerOpAsync('apiInfo', {})
        .then(apis => {
          cachedApis = apis;
        })
    );
  else return Promise.resolve();
}

export interface UpgradeResult {
  success: boolean;
  editor?: string;
  patchedFiles?: any;
  errorCodes?: any;
}


export function newProjectAsync() {
  firstTypecheck = null;
  return workerOpAsync('reset', {});
}

namespace pxt.worker {
  let workers: any = {};

  // Gets a cached worker for the given file
  export function getWorker(workerFile: string): Iface {
    let w = workers[workerFile];
    if (!w) {
      w = workers[workerFile] = makeWebWorker(workerFile);
    }
    return w;
  }

  export interface Iface {
    opAsync: (op: string, arg: any) => Promise<any>;
    recvHandler: (v: any) => void;
  }

  export function wrap(send: (v: any) => void): Iface {
    let pendingMsgs: any = {};
    let msgId = 0;
    let q = new PromiseQueue();

    let initPromise = new Promise<void>((resolve, reject) => {
      pendingMsgs['ready'] = resolve;
    });
    q.enqueue('main', () => initPromise);

    let recvHandler = (data: any) => {
      if (pendingMsgs.hasOwnProperty(data.id)) {
        let cb = pendingMsgs[data.id];
        delete pendingMsgs[data.id];
        cb(data.result);
      }
    };

    function opAsync(op: string, arg: any) {
      return q.enqueue(
        'main',
        () =>
          new Promise<any>((resolve, reject) => {
            let id = '' + msgId++;
            pendingMsgs[id] = (v: any) => {
              if (!v) {
                //pxt.reportError("worker", "no response")
                reject(new Error('no response'));
              } else if (v.errorMessage) {
                //pxt.reportError("worker", v.errorMessage)
                reject(new Error(v.errorMessage));
              } else {
                resolve(v);
              }
            };
            send({ id, op, arg });
          })
      );
    }

    return { opAsync, recvHandler };
  }

  export function makeWebWorker(workerFile: string) {
    let worker = new Worker(workerFile);
    let iface = wrap(v => worker.postMessage(v));
    worker.onmessage = ev => {
      iface.recvHandler(ev.data);
    };
    return iface;
  }

  export function makeWebSocket(url: string, onOOB: (v: any) => void = null) {
    let ws = new WebSocket(url);
    let sendq: string[] = [];
    let iface = wrap(v => {
      let s = JSON.stringify(v);
      if (sendq) sendq.push(s);
      else ws.send(s);
    });
    ws.onmessage = ev => {
      let js = JSON.parse(ev.data);
      if (onOOB && js.id == null) {
        onOOB(js);
      } else {
        iface.recvHandler(js);
      }
    };
    ws.onopen = ev => {
      // pxt.debug('socket opened');
      for (let m of sendq) ws.send(m);
      sendq = null;
    };
    ws.onclose = ev => {
      // pxt.debug('socket closed')
    };
    ws.onerror = ev => {
      // pxt.debug('socket errored')
    };
    return iface;
  }
}

function getRunOptions(res: pxtc.CompileResult, options: any = {}) {
  const js = res.outfiles['binary.js'];
  const boardDefinition = MICROBIT_BOARD_DEFINITION;
  const parts = computeUsedParts(res, true);
  const fnArgs = res.usedArguments;
  // lastCompileResult = res;
  const { mute, highContrast, light, clickTrigger, storedState, autoRun } = options;

  const opts: any = {
    type: 'run',
    code: js,
    boardDefinition: boardDefinition,
    mute,
    parts,
    // debug,
    fnArgs,
    highContrast,
    light,
    // aspectRatio: parts.length ? pxt.appTarget.simulator.partsAspectRatio : pxt.appTarget.simulator.aspectRatio,
    partDefinitions: computePartDefinitions(parts),
    cdnUrl: '/cdn/',
    localizedStrings: {},
    refCountingDebug: false,
    version: '',
    clickTrigger: clickTrigger,
    // breakOnStart: debug,
    storedState: storedState,
    autoRun
  };

  return opts;
}

export function computeUsedParts(resp: any, ignoreBuiltin = false): string[] {
  if (!resp.usedSymbols) return [];

  let parts: string[] = [];
  Object.keys(resp.usedSymbols).forEach(symbol => {
    let info = resp.usedSymbols[symbol];
    if (info && info.attributes.parts) {
      let partsRaw = info.attributes.parts;
      if (partsRaw) {
        let partsSplit = partsRaw.split(/[ ,]+/);
        partsSplit.forEach((p: any) => {
          if (0 < p.length && parts.indexOf(p) < 0) {
            parts.push(p);
          }
        });
      }
    }
  });

  if (ignoreBuiltin) {
    const builtinParts = MICROBIT_BOARD_DEFINITION.onboardComponents;
    if (builtinParts) parts = parts.filter(p => builtinParts.indexOf(p) < 0);
  }

  //sort parts (so breadboarding layout is stable w.r.t. code ordering)
  parts.sort();
  parts = parts.reverse(); //not strictly necessary, but it's a little
  // nicer for demos to have "ledmatrix"
  // before "buttonpair"

  return parts;
}

function computePartDefinitions(parts: string[]): any {
  if (!parts || !parts.length) return {};

  let res: any = {};
  try {
    let p = pxtparts;
    Object.keys(p).forEach(k => {
      if (parts.indexOf(k) >= 0) {
        let part: any = (res[k] = p[k]);
        if (typeof part.visual.image === 'string' && /\.svg$/i.test(part.visual.image)) {
          let key: any = part.visual.image;
          let f = compilerFiles[key].content;
          if (!f) console.error('missing file content');
          part.visual.image = `data:image/svg+xml,` + encodeURIComponent(f);
        }
      }
    });
  } catch (e) {
    console.error('parts', e);
  }
  return res;
}

function lookup<T>(m: any, key: string): T {
  if (m.hasOwnProperty(key)) return m[key];
  return null;
}
