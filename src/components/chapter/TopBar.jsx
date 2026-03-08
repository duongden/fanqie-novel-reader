import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { List, Minus, Plus, Sun, Moon, RefreshCw, Languages, Type, ChevronDown } from 'lucide-react';
import { useConvertedText } from '../../hooks/useConvertedText';
import ActionBar from '../common/ActionBar';
import HomeButton from '../common/HomeButton';
import { IconButton, IconLink } from '../common/IconButton';
import { FONT_SIZE_MIN, FONT_SIZE_MAX, TEXT_BRIGHTNESS_MIN, TEXT_BRIGHTNESS_MAX, CHINESE_FONTS } from '../../utils/constants';
import { buildCatalogUrl } from '../../utils/navigation';

const TopBarWrapper = styled.div`
  display: flex;
  padding: 16px 24px;
  padding-top: calc(16px + env(safe-area-inset-top));
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  background-color: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--border-color);

  @media (max-width: 480px) {
    padding: 12px 16px;
    padding-top: calc(12px + env(safe-area-inset-top));
    gap: 10px;
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  align-self: stretch;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;

  h1 {
    color: var(--text-color);
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 16px;
    }
    h3 {
      font-size: 11px;
    }
  }

  h3 {
    color: var(--text-color-secondary);
    font-size: 12px;
    font-weight: 400;
    margin: 4px 0 0 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ProgressBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  align-self: stretch;
`;

const ProgressBarContainer = styled.div`
  height: 4px;
  flex: 1;
  border-radius: 2px;
  background-color: var(--progressBar);
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background-color: var(--accent-color);
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: var(--text-color-secondary);
  min-width: 60px;
  text-align: right;

  .current {
    color: var(--text-color);
  }
`;

const FontDropdownWrapper = styled.div`
  position: relative;
`;

const FontTrigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px;
  min-width: 44px;
  min-height: 44px;
  color: var(--text-color-secondary);
  background: none;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  @media (hover: hover) {
    &:hover {
      background-color: var(--hover-background-color);
      color: var(--accent-color);
    }
  }

  @media (max-width: 480px) {
    min-width: 40px;
    min-height: 40px;
    padding: 8px;
  }
`;

const FontDropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  max-height: 280px;
  overflow-y: auto;
  background-color: rgba(18, 18, 18, 0.98);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 1002;
  padding: 8px;
`;

const FontOption = styled.button`
  display: block;
  width: 100%;
  padding: 10px 12px;
  text-align: left;
  font-size: 14px;
  color: var(--text-color);
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  font-family: ${(p) => p.$fontFamily ?? 'inherit'};

  @media (hover: hover) {
    &:hover {
      background-color: var(--hover-background-color);
      color: var(--accent-color);
    }
  }

  ${(p) =>
    p.$active &&
    `
    color: var(--accent-color);
    font-weight: 600;
  `}
`;

function FontDropdown({ title = '字體', fontFamily, onFontFamilyChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const currentLabel = CHINESE_FONTS.find((f) => f.value === fontFamily)?.label ?? CHINESE_FONTS[0].label;

  return (
    <FontDropdownWrapper ref={ref}>
      <FontTrigger type="button" title="字體" onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="listbox">
        <Type size={20} strokeWidth={2.5} />
        <ChevronDown size={16} strokeWidth={2.5} style={{ opacity: open ? 1 : 0.6 }} />
      </FontTrigger>
      {open && (
        <FontDropdownMenu role="listbox" aria-label="選擇字體">
          {CHINESE_FONTS.map((font) => (
            <FontOption
              key={font.value}
              role="option"
              aria-selected={fontFamily === font.value}
              $active={fontFamily === font.value}
              $fontFamily={font.value}
              onClick={() => {
                onFontFamilyChange(font.value);
                setOpen(false);
              }}
            >
              {font.label}
            </FontOption>
          ))}
        </FontDropdownMenu>
      )}
    </FontDropdownWrapper>
  );
}

function TopBar({ chapterData, bookInfo, fontSize, onFontSizeChange, fontFamily, onFontFamilyChange, textBrightness, onTextBrightnessChange, useTraditionalChinese = false, onTraditionalChineseToggle, onRefresh }) {
  const convertedTitle = useConvertedText(chapterData?.novel_data?.title, useTraditionalChinese);
  const convertedBookName = useConvertedText(bookInfo?.book_info?.original_book_name, useTraditionalChinese);

  if (!chapterData || !chapterData.novel_data) return null;

  const { order, serial_count } = chapterData.novel_data;
  const progress = ((parseInt(order) / parseInt(serial_count)) * 100).toFixed(1);

  return (
    <TopBarWrapper>
      <InfoRow>
        <TitleBlock>
          <h1>{convertedTitle}</h1>
          {bookInfo && <h3>{convertedBookName}</h3>}
        </TitleBlock>
        <ActionBar panelTitle="工具">
            <HomeButton title="返回首頁" />
            {onFontSizeChange && (
              <IconButton
                type="button"
                title="減小字號"
                disabled={fontSize <= FONT_SIZE_MIN}
                onClick={() => onFontSizeChange(-1)}
              >
                <Minus size={20} strokeWidth={2.5} />
              </IconButton>
            )}
            {onFontSizeChange && (
              <IconButton
                type="button"
                title="增大字號"
                disabled={fontSize >= FONT_SIZE_MAX}
                onClick={() => onFontSizeChange(1)}
              >
                <Plus size={20} strokeWidth={2.5} />
              </IconButton>
            )}
            {onFontFamilyChange && (
              <FontDropdown title="字體" fontFamily={fontFamily} onFontFamilyChange={onFontFamilyChange} />
            )}
            {onTraditionalChineseToggle && (
              <IconButton
                type="button"
                title={useTraditionalChinese ? '切換為簡體中文' : '切換為繁體中文'}
                onClick={onTraditionalChineseToggle}
                style={useTraditionalChinese ? { color: 'var(--accent-color)' } : undefined}
              >
                <Languages size={20} strokeWidth={2.5} />
              </IconButton>
            )}
            {onTextBrightnessChange && (
              <IconButton
                type="button"
                title="變暗"
                disabled={textBrightness <= TEXT_BRIGHTNESS_MIN}
                onClick={() => onTextBrightnessChange(-1)}
              >
                <Moon size={20} strokeWidth={2.5} />
              </IconButton>
            )}
            {onTextBrightnessChange && (
              <IconButton
                type="button"
                title="變亮"
                disabled={textBrightness >= TEXT_BRIGHTNESS_MAX}
                onClick={() => onTextBrightnessChange(1)}
              >
                <Sun size={20} strokeWidth={2.5} />
              </IconButton>
            )}
            {onRefresh && (
              <IconButton type="button" title="重新載入章節" onClick={onRefresh}>
                <RefreshCw size={20} strokeWidth={2.5} />
              </IconButton>
            )}
            {chapterData?.novel_data?.book_id && (
              <IconLink to={buildCatalogUrl(chapterData.novel_data.book_id)} title="目錄">
                <List size={20} strokeWidth={2.5} />
              </IconLink>
            )}
          </ActionBar>
      </InfoRow>
      <ProgressBox aria-hidden="true">
        <ProgressBarContainer>
          <Progress style={{ width: `${progress}%` }} />
        </ProgressBarContainer>
        <ProgressText>
          <span className="current">{order}</span> / {serial_count}
        </ProgressText>
      </ProgressBox>
    </TopBarWrapper>
  );
}

export default TopBar;
