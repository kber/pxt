import * as compiler from './compilerSimple';

export class ProjectView {}

const global: any = window;
global.compile = function(code: string) {
  return compiler.compileAsync(code);
};

global.run = function(code: string) {
  global.compile(code).then((opts: any) => {
    pxsim.Embed.run(opts);
  });
};
