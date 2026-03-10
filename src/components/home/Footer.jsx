import styled from 'styled-components';

const FooterWrapper = styled.footer`
  text-align: center;
  padding: 24px 24px calc(24px + env(safe-area-inset-bottom));
  color: var(--text-color-secondary);
  font-size: 13px;
  max-width: 800px;
  margin: 0 auto;
  border-top: 1px solid var(--border-color);
`;

function Footer() {
  return (
    <FooterWrapper>
      FanqieTC · 僅供個人學習交流使用 ·{' '}
      <a href="https://github.com/denniemok/fanqie-novel-reader" target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
    </FooterWrapper>
  );
}

export default Footer;
