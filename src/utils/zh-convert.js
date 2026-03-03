import { Converter } from 'opencc-js';
import { getUseTraditionalChinese } from './storage';

let converter = null;

function getConverter() {
  if (!converter) {
    converter = Converter({ from: 'cn', to: 'tw' });
  }
  return converter;
}

export function toTraditional(text) {
  if (!text || typeof text !== 'string') return text;
  return getConverter()(text);
}

export function maybeConvert(text, useTraditional) {
  const shouldConvert = useTraditional !== undefined ? useTraditional : getUseTraditionalChinese();
  if (!shouldConvert || !text || typeof text !== 'string') return text;
  return getConverter()(text);
}
