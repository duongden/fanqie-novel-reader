import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, AlertCircle } from 'lucide-react';
import styled from 'styled-components';

const ErrorBackground = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--error-background-color);
  position: fixed;
  inset: 0;
  z-index: 999;
  backdrop-filter: blur(20px);
  padding: 16px;
  padding-bottom: max(16px, env(safe-area-inset-bottom));
`;

const ErrorMessage = styled.div`
  display: flex;
  padding: 20px 20px 20px 100px;
  align-items: flex-start;
  gap: 10px;
  border-radius: 30px;
  position: relative;
  z-index: 999;
  width: 100%;
  max-width: 375px;
  background-color: #ffffff;
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: left bottom;

  @media (max-width: 480px) {
    padding: 18px 14px 18px 88px;
    border-radius: 20px;
  }

  @media (max-width: 360px) {
    padding: 16px 12px 16px 80px;
    border-radius: 16px;
  }
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  flex: 1 0 0;
  min-width: 0;

  h1 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    align-self: stretch;
    overflow: hidden;
    font-size: 20px;
    text-overflow: ellipsis;
    font-weight: 700;
    line-height: 120%;
    color: var(--high-color);

    @media (max-width: 360px) {
      font-size: 17px;
    }
  }

  span {
    color: var(--high-color);
    margin: 0 5px;
  }

  p {
    align-self: stretch;
    color: #858585;
    font-size: 14px;
    font-weight: 400;
    line-height: 140%;
    word-break: break-word;

    @media (max-width: 360px) {
      font-size: 13px;
    }
  }
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--high-color);
`;

const ErrorIconWrapper = styled.div`
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--high-color);
`;

function Error({ message, href }) {
  const navigate = useNavigate();
  return (
    <ErrorBackground role="alert">
      <ErrorMessage>
        <InfoBlock>
          <h1>啊~ 哦～～～</h1>
          <p dangerouslySetInnerHTML={{ __html: message }} />
        </InfoBlock>
        <CloseButton onClick={() => navigate(href)}>
          <X size={24} strokeWidth={2} />
        </CloseButton>
        <ErrorIconWrapper>
          <AlertCircle size={48} strokeWidth={2} />
        </ErrorIconWrapper>
      </ErrorMessage>
    </ErrorBackground>
  );
}

export default Error;
