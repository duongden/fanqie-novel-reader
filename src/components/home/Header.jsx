import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: calc(60px + env(safe-area-inset-top));
  margin-bottom: 10px;
  gap: 16px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, var(--accent-color), #ffcc80);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 480px) {
    font-size: 26px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: var(--text-color-secondary);
  max-width: 400px;
  /* line-height: 0.8; */
  margin: 0;
`;

function Header() {
  return (
    <HeaderWrapper>
      <Title>番茄繁體閱讀</Title>
      <Subtitle>
        免除手機號登錄 · 粉碎無效廣告擾<br />
        為繁體閱讀而生 · 讓小說回歸純粹<br />
      </Subtitle>
    </HeaderWrapper>
  );
}

export default Header;
