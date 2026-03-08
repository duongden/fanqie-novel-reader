import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: calc(40px + env(safe-area-inset-top));
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
  line-height: 0.8;
  margin: 0;
`;

function Header() {
  return (
    <HeaderWrapper>
      <Title>番茄小說閱讀器</Title>
      <Subtitle>本地儲存、免安裝、免註冊、無廣告</Subtitle>
      <Subtitle>無需中國大陸手機號即可在線存取番茄小說</Subtitle>
      <Subtitle>支援多章節下載與 TXT 匯出</Subtitle>
    </HeaderWrapper>
  );
}

export default Header;
