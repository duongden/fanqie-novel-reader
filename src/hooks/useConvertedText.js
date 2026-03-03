import { useState, useEffect } from 'react';
import { maybeConvert } from '../utils/zh-convert';

export function useConvertedText(text, useTraditional) {
  const [converted, setConverted] = useState(text ?? '');

  useEffect(() => {
    if (!text) {
      setConverted('');
      return;
    }
    setConverted(maybeConvert(text, useTraditional));
  }, [text, useTraditional]);

  return converted;
}
