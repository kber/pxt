const MICROBIT_BOARD_DEFINITION = {
  visual: 'microbit',
  gpioPinBlocks: [
    ['P0'],
    ['P1'],
    ['P2'],
    ['P3'],
    ['P4', 'P5', 'P6', 'P7'],
    ['P8', 'P9', 'P10', 'P11', 'P12'],
    ['P16']
  ],
  gpioPinMap: {
    P0: 'P0',
    P1: 'P1',
    P2: 'P2',
    P3: 'P3',
    P4: 'P4',
    P5: 'P5',
    P6: 'P6',
    P7: 'P7',
    P8: 'P8',
    P9: 'P9',
    P10: 'P10',
    P11: 'P11',
    P12: 'P12',
    P13: 'P13',
    P14: 'P14',
    P15: 'P15',
    P16: 'P16',
    P19: 'P19',
    P20: 'P20'
  },
  spiPins: { MOSI: 'P15', MISO: 'P14', SCK: 'P13' },
  i2cPins: { SDA: 'P20', SCL: 'P19' },
  analogInPins: ['P0', 'P1', 'P2', 'P3', 'P10'],
  groundPins: ['GND'],
  threeVoltPins: ['+3v3'],
  attachPowerOnRight: true,
  onboardComponents: [
    'accelerometer',
    'buttonpair',
    'ledmatrix',
    'speaker',
    'bluetooth',
    'thermometer',
    'compass'
  ],
  pinStyles: { P0: 'croc', P1: 'croc', P2: 'croc', GND: 'croc', '+3v3': 'croc' },
  marginWhenBreadboarding: [0, 0, 80, 0]
} as any;

export default MICROBIT_BOARD_DEFINITION;

const BOARD_INIT_DUMMY_CODE = '// total=3805 new=25.34% cached=21.02% other=53.64%\n(function (ectx) {\n\'use strict\';\nconst runtime = ectx.runtime;\nconst oops = ectx.oops;\nconst doNothing = ectx.doNothing;\nconst pxsim = ectx.pxsim;\nconst globals = ectx.globals;\nconst maybeYield = ectx.maybeYield;\nconst setupDebugger = ectx.setupDebugger;\nconst isBreakFrame = ectx.isBreakFrame;\nconst breakpoint = ectx.breakpoint;\nconst trace = ectx.trace;\nconst checkStack = ectx.checkStack;\nconst leave = ectx.leave;\nconst checkResumeConsumed = ectx.checkResumeConsumed;\nconst setupResume = ectx.setupResume;\nconst setupLambda = ectx.setupLambda;\nconst checkSubtype = ectx.checkSubtype;\nconst failedCast = ectx.failedCast;\nconst buildResume = ectx.buildResume;\nconst mkVTable = ectx.mkVTable;\nconst __this = runtime;\nconst pxtrt = pxsim.pxtrt;\nlet yieldSteps = 1;\nectx.setupYield(function() { yieldSteps = 100; })\npxsim.setTitle("a");\npxsim.setConfigData({}, {});\npxtrt.mapKeyNames = [\n ""\n];\n__this.setupPerfCounters([]);\nconst pxsim_Array__getAt = pxsim.Array_.getAt;\nconst pxsim_Array__length = pxsim.Array_.length;\nconst pxsim_Array__mk = pxsim.Array_.mk;\nconst pxsim_Array__push = pxsim.Array_.push;\nconst pxsim_Boolean__bang = pxsim.Boolean_.bang;\nconst pxsim_String__concat = pxsim.String_.concat;\nconst pxsim_String__stringConv = pxsim.String_.stringConv;\nconst pxsim_numops_toBool = pxsim.numops.toBool;\nconst pxsim_numops_toBoolDecr = pxsim.numops.toBoolDecr;\nconst pxsim_pxtcore_mkAction = pxsim.pxtcore.mkAction;\nconst pxsim_pxtcore_mkClassInstance = pxsim.pxtcore.mkClassInstance;\nconst pxsim_pxtrt_ldlocRef = pxsim.pxtrt.ldlocRef;\nconst pxsim_pxtrt_mapGetByString = pxsim.pxtrt.mapGetByString;\nconst pxsim_pxtrt_stclo = pxsim.pxtrt.stclo;\nconst pxsim_pxtrt_stlocRef = pxsim.pxtrt.stlocRef;\nconst pxsim_Boolean_ = pxsim.Boolean_;\nconst pxsim_pxtcore = pxsim.pxtcore;\nconst pxsim_String_ = pxsim.String_;\nconst pxsim_ImageMethods = pxsim.ImageMethods;\nconst pxsim_Array_ = pxsim.Array_;\nconst pxsim_pxtrt = pxsim.pxtrt;\nconst pxsim_numops = pxsim.numops;\n\n\nfunction _main___P2341(s) {\nlet r0 = s.r0, step = s.pc;\ns.pc = -1;\n\n\nwhile (true) {\nif (yieldSteps-- < 0 && maybeYield(s, step, r0)) return null;\nswitch (step) {\n  case 0:\n\n    globals.zeroFx8___377 = (0);\n    r0 = (0.5 * 256);\n    s.tmp_0 = r0;\n    r0 = (s.tmp_0 | 0);\n    globals.oneHalfFx8___378 = (r0);\n    globals.oneFx8___380 = (1);\n    globals.twoFx8___381 = (2);\n    r0 = pxsim.pins.createBuffer(17);\n    globals.matBuf___539 = (r0);\n    r0 = undefined;\n    return leave(s, r0)\n  default: oops()\n} } }\n_main___P2341.info = {"start":0,"length":0,"line":0,"column":0,"endLine":0,"endColumn":0,"fileName":"pxt_modules/robotbit/main.ts","functionName":"<main>","argumentNames":[]}\n_main___P2341.continuations = [  ]\n\nfunction _main___P2341_mk(s) {\n    checkStack(s.depth);\n    return {\n        parent: s, fn: _main___P2341, depth: s.depth + 1,\n        pc: 0, retval: undefined, r0: undefined, overwrittenPC: false, lambdaArgs: null,\n  tmp_0: undefined,\n} }\n\n\n\n\n\nfunction Fx8__P376(s) {\nlet r0 = s.r0, step = s.pc;\ns.pc = -1;\n\n\nwhile (true) {\nif (yieldSteps-- < 0 && maybeYield(s, step, r0)) return null;\nswitch (step) {\n  case 0:\n\n    if (s.lambdaArgs) {\n      s.arg0 = (s.lambdaArgs[0]);\n      s.lambdaArgs = null;\n    }\n    r0 = (s.arg0 * 256);\n    s.tmp_0 = r0;\n    r0 = (s.tmp_0 | 0);\n    return leave(s, r0)\n  default: oops()\n} } }\nFx8__P376.info = {"start":42,"length":68,"line":4,"column":0,"endLine":6,"endColumn":1,"fileName":"pxt_modules/core/fixed.ts","functionName":"Fx8","argumentNames":["v"]}\n\nfunction Fx8__P376_mk(s) {\n    checkStack(s.depth);\n    return {\n        parent: s, fn: Fx8__P376, depth: s.depth + 1,\n        pc: 0, retval: undefined, r0: undefined, overwrittenPC: false, lambdaArgs: null,\n  tmp_0: undefined,\n  arg0: undefined,\n} }\n\n\n\n\n\nconst breakpoints = setupDebugger(1, [])\n\nreturn _main___P2341\n})\n';
export const MICROBIT_BOARD_SIM_INIT_MSG: any = {
  type: 'run',
  boardDefinition: MICROBIT_BOARD_DEFINITION,
  parts: [] as any,
  fnArgs: {},
  code: BOARD_INIT_DUMMY_CODE,
  partDefinitions: {},
  highContrast: false,
  light: false,
  cdnUrl: '/cdn/',
  localizedStrings: {},
  refCountingDebug: false,
  clickTrigger: true,
  storedState: {}
}