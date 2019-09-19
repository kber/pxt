import * as compiler from './compilerSimple';

export class ProjectView {}

const global: any = window;
global.compile = function(code: string, isNative: boolean = false) {
  return compiler.compileAsync(code, isNative);
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
