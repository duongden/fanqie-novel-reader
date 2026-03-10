import React from 'react';
import styled from 'styled-components';
import { Search, Globe } from 'lucide-react';
import { API_OPTIONS, ZH_CONVERSION_OPTIONS } from '../../utils/constants';
import { useApiBase } from '../../hooks/useApiBase';
import { useConversionMode } from '../../hooks/useConversionMode';
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
    background-color: var(--background-color);
    border: none;
    color: var(--accent-color);
    font-weight: 600;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--hover-background-color);
    }

    &:focus {
      outline: none;
    }
  }
`;

function AddBook({ onSubmit, refreshKey, conversionMode, onConversionModeChange }) {
  const [apiBase, handleApiChange] = useApiBase();
  const [localConversionMode, setLocalConversionMode] = useConversionMode();
  const isControlled = conversionMode !== undefined && onConversionModeChange !== undefined;
  const effectiveConversionMode = isControlled ? conversionMode : localConversionMode;
  const handleConversionChange = isControlled ? onConversionModeChange : setLocalConversionMode;

  const handleSelectChange = (e) => {
    handleApiChange(e.target.value);
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
          <select id="apiSelect" value={apiBase} onChange={handleSelectChange}>
            {API_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span>繁簡:</span>
          <select
            value={effectiveConversionMode}
            onChange={(e) => handleConversionChange(e.target.value)}
            title="繁簡轉換"
          >
            {ZH_CONVERSION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </ApiSelectWrapper>
      </InputGroup>
    </Section>
  );
}

export default AddBook;
