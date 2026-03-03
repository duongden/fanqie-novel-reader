import { Converter } from 'opencc-js/cn2t';
import { getUseTraditionalChinese } from './storage';

const converter = Converter({ from: 'cn', to: 'tw' });

export function toTraditional(text) {
  if (!text || typeof text !== 'string') return text;
  return converter(text);
}

export function maybeConvert(text, useTraditional) {
  const shouldConvert = useTraditional !== undefined ? useTraditional : getUseTraditionalChinese();
  if (!shouldConvert || !text || typeof text !== 'string') return text;
  return converter(text);
}
