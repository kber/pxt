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
    pxsim.Embed.run(opts);
  });
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
