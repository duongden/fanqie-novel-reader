import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { parseBookIdFromInput } from '../../utils/parseBookId';
import { buildCatalogUrl } from '../../utils/navigation';
import Section from './Section';

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  box-sizing: border-box;
  background-color: var(--background-color2);
  border: var(--retro-border-width) solid var(--border-color);
  width: 100%;
  box-shadow: var(--retro-shadow);
`;

const FormEl = styled.form`
  display: flex;
  gap: 12px;
  width: 100%;

  @media (max-width: 600px) {
    flex-direction: column;
  }

  input {
    flex: 1;
    padding: 14px 20px;
    background-color: var(--background-color);
    border: 1px solid var(--border-color);
    color: var(--text-color);
    font-size: 16px;
    transition: all 0.1s steps(2);
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 2px rgba(143, 163, 143, 0.2);
    }

    &::placeholder {
      color: var(--text-color-secondary);
      opacity: 0.5;
    }
  }

  button {
    padding: 8px 28px;
    background-color: var(--accent-color);
    color: #000;
    border: 2px solid #000;
    font-size: 16px;
    font-weight: 900;
    cursor: pointer;
    transition: all 0.1s steps(2);
    white-space: nowrap;
    text-transform: uppercase;
    box-shadow: 4px 4px 0px #000;
    font-family: inherit;

    &:hover {
      background-color: var(--accent-hover);
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0px #000;
    }

    &:active {
      transform: translate(1px, 1px);
      box-shadow: 0px 0px 0px #000;
    }
  }
`;

function Form() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const raw = inputRef.current?.value?.trim();
    if (!raw) return;
    const bookId = parseBookIdFromInput(raw) ?? raw;
    navigate(buildCatalogUrl(bookId));
  };

  return (
    <Section>
      <InputGroup>
        <FormEl onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            placeholder="貼上番茄小說書籍 ID 或 網址"
            defaultValue=""
            autoFocus
          />
          <button type="submit">開始閱讀</button>
        </FormEl>
      </InputGroup>
    </Section>
  );
}

export default Form;
