import config from './default.config.ts';
import { log } from './utils.ts';

//export const config = Object.create(defaultConfig);
export { config };
const nodeEnv = process.env.NODE_ENV || 'development';
const configPath = process.env.LDACAPI_CONFIG_PATH || `../${nodeEnv}.config.ts`;
(async () => {
  try {
    const actualConfig = await import(configPath);
    log.info(`Loaded config from ${configPath}`);
    merge(config as unknown as PlainObject, actualConfig.default as PlainObject);    
  } catch (error) {
    log.error(error);
  }
})();

type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object' && value !== null && Object.is((value as object).constructor, Object);
}

function merge(target: PlainObject, source: PlainObject) {
  for (const key in source) {
    const value = source[key];
    if (isPlainObject(value)) {
      if (!isPlainObject(target[key])) {
        target[key] = {};
      }
      merge(target[key] as PlainObject, value);
    } else {
      target[key] = value;
    }
  }
}