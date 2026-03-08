import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, Globe, Languages } from 'lucide-react';
import { API_OPTIONS } from '../../utils/constants';
import { getApiBase, setApiBase } from '../../services/api';
import { useTraditionalChineseToggle } from '../../hooks/useTraditionalChineseToggle';
import { parseBookIdFromInput } from '../../utils/parseBookId';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  box-sizing: border-box;
  background-color: var(--background-color2);
  border-radius: 20px;
  border: 1px solid var(--border-color);
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  gap: 12px;
  width: 100%;

  @media (max-width: 600px) {
    flex-direction: column;
  }

  input {
    flex: 1;
    padding: 14px 20px;
    border-radius: 14px;
    background-color: var(--background-color);
    border: 1px solid var(--border-color);
    color: var(--text-color);
    font-size: 16px;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 2px rgba(255, 152, 0, 0.2);
    }

    &::placeholder {
      color: var(--text-color-secondary);
      opacity: 0.5;
    }
  }

  button {
    padding: 8px 28px;
    margin: 1px 0;
    border-radius: 14px;
    background-color: var(--accent-color);
    color: #000;
    border: none;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;

    &:hover {
      background-color: var(--accent-hover);
      transform: scale(1.02);
    }

    &:active {
      transform: scale(0.98);
    }
  }
`;

const ApiSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--text-color-secondary);
  flex-wrap: wrap;

  select {
    background: none;
    border: none;
    color: var(--accent-color);
    font-weight: 600;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: background 0.2s;

    &:hover {
      background: var(--hover-background-color);
    }

    &:focus {
      outline: none;
    }
  }
`;

const TranslateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--background-color);
  color: ${(p) => (p.$active ? 'var(--accent-color)' : 'var(--text-color)')};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--hover-background-color);
    border-color: var(--accent-color);
    color: var(--accent-color);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

function AddBook({ onSubmit, refreshKey, useTraditionalChinese, onTraditionalChineseToggle }) {
  const [apiBase, setApiBaseState] = useState(() => getApiBase());
  const [localUseTraditionalChinese, toggleLocalTraditionalChinese] = useTraditionalChineseToggle();
  const isControlled = useTraditionalChinese !== undefined && onTraditionalChineseToggle !== undefined;
  const effectiveUseTraditionalChinese = isControlled ? useTraditionalChinese : localUseTraditionalChinese;

  const handleTranslateToggle = () => {
    if (isControlled) {
      onTraditionalChineseToggle();
    } else {
      toggleLocalTraditionalChinese();
    }
  };

  const handleApiChange = (e) => {
    const url = e.target.value;
    setApiBase(url);
    setApiBaseState(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputElement = document.getElementById('bookIdInput');
    const raw = inputElement.value?.trim();
    if (!raw || !onSubmit) return;
    const bookId = parseBookIdFromInput(raw) ?? raw;
    onSubmit(bookId);
  };

  return (
    <Section>
      <SectionTitle><Search /> 開始新閱讀</SectionTitle>
      <InputGroup>
        <Form onSubmit={handleSubmit}>
          <input
            key={refreshKey}
            id="bookIdInput"
            type="text"
            placeholder="貼上書籍 bookId 或 URL"
            defaultValue=""
          />
          <button type="submit">開始閱讀</button>
        </Form>
        <ApiSelectWrapper>
          <Globe size={14} />
          <span>API 服務:</span>
          <select id="apiSelect" value={apiBase} onChange={handleApiChange}>
            {API_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.url}>
                {opt.label}
              </option>
            ))}
          </select>
          <TranslateButton
            type="button"
            $active={effectiveUseTraditionalChinese}
            onClick={handleTranslateToggle}
            title={effectiveUseTraditionalChinese ? '切換為簡體中文' : '切換為繁體中文'}
          >
            <Languages size={16} strokeWidth={2.5} />
            {effectiveUseTraditionalChinese ? '繁體' : '简体'}
          </TranslateButton>
        </ApiSelectWrapper>
      </InputGroup>
    </Section>
  );
}

export default AddBook;
