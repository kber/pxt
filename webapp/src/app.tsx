import * as compiler from './compilerSimple';
import { MICROBIT_BOARD_SIM_INIT_MSG } from './boards/microbit';

export class ProjectView {}

const global: any = window;
global.compile = function(code: string, isNative: boolean = false) {
  return compiler.compileAsync(code, isNative);
};

global.init = function() {
  pxsim.Embed.run(MICROBIT_BOARD_SIM_INIT_MSG);
};

global.run = function(code: string) {
  compiler.compileAsync(code).then((opts: any) => {
    if (!opts.code) throw Error('代码出错啦，请仔细检查代码');
    pxsim.Embed.run(opts);
  })
};

global.hexlify = function(code: string) {
  compiler.compileAsync(code, true).then((opts: any) => {
    linkDownload(opts.hex);
  });
};

function linkDownload(content: string) {
  const save_link = document.createElement('a');
  save_link.href = URL.createObjectURL(new Blob([content]));
  save_link.download = 'a.hex';
  save_link.click();
}

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event: MessageEvent) {
  let origin = event.origin; // || (<any>event).originalEvent.origin;
  // TODO: test origins

  let data: any = event.data || {};
  let type = data.type;
  if (!type) return;
  switch (type) {
    case "microbit-init": global.init(); break;
    case "microbit-run": global.run(data.code); break;
    case "microbit-hexlify": global.hexlify(data.code); break;
    default: break;
  }
}
