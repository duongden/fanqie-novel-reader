import React from 'react';
import styled from 'styled-components';

const ReaderWrapper = styled.div`
  margin: 0 auto;
  padding: 40px 24px 100px 24px;
  padding-top: calc(140px + env(safe-area-inset-top));
  padding-bottom: calc(100px + env(safe-area-inset-bottom));
  max-width: 800px;
  background-color: var(--background-color);
  min-height: 100vh;

  @media (max-width: 480px) {
    padding: 24px 16px 100px 16px;
    padding-top: calc(130px + env(safe-area-inset-top));
    padding-bottom: calc(100px + env(safe-area-inset-bottom));
  }

  p {
    line-height: 2;
    font-size: ${(p) => p.$fontSize ?? 18}px;
    color: color-mix(in srgb, var(--text-color) ${(p) => p.$textBrightness ?? 90}%, transparent);
    margin-bottom: 1.8em;
    text-align: justify;
    letter-spacing: 0.05em;
    font-family: ${(p) => p.$fontFamily ?? 'Noto Serif TC, Noto Serif SC, SimSun, PMingLiU, Georgia, serif'};
  }

  br {
    display: none;
  }
`;

function Reader({ chapterData, fontSize = 18, fontFamily = 'Georgia, serif', textBrightness = 90 }) {
  if (!chapterData || !chapterData.content) return null;

  // Split content by newlines and wrap in <p> tags for better semantics and styling
  const paragraphs = chapterData.content
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return (
    <ReaderWrapper $fontSize={fontSize} $fontFamily={fontFamily} $textBrightness={textBrightness}>
      {paragraphs.map((text, index) => (
        <p key={index}>{text}</p>
      ))}
    </ReaderWrapper>
  );
}

export default Reader;
