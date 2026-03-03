import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Minus, Plus, Sun, Moon, RefreshCw, Languages } from 'lucide-react';
import HomeButton from './HomeButton';
import styled from 'styled-components';
import { maybeConvert } from '../utils/zh-convert';
import { FONT_SIZE_MIN, FONT_SIZE_MAX, TEXT_BRIGHTNESS_MIN, TEXT_BRIGHTNESS_MAX } from '../utils/constants';

const TopBarWrapper = styled.div`
  display: flex;
  padding: 16px 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  background-color: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--border-color);
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  align-self: stretch;
`;

const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  color: var(--text-color-secondary);
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--hover-background-color);
    color: var(--accent-color);
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  color: var(--text-color-secondary);
  background: none;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: var(--hover-background-color);
    color: var(--accent-color);
  }

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }
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

function TopBar({ chapterData, bookInfo, fontSize, onFontSizeChange, textBrightness, onTextBrightnessChange, useTraditionalChinese = false, onTraditionalChineseToggle, onRefresh }) {
  if (!chapterData || !chapterData.novel_data) return null;

  const { order, serial_count } = chapterData.novel_data;
  const progress = ((parseInt(order) / parseInt(serial_count)) * 100).toFixed(1);

  return (
    <TopBarWrapper>
      <InfoRow>
        <TitleBlock>
          <h1>{maybeConvert(chapterData.novel_data.title, useTraditionalChinese)}</h1>
          {bookInfo && <h3>{maybeConvert(bookInfo.book_info?.book_name, useTraditionalChinese)}</h3>}
        </TitleBlock>
        <RightActions>
          <HomeButton />
          {onFontSizeChange && (
            <>
              <IconButton
                type="button"
                title="減小字號"
                disabled={fontSize <= FONT_SIZE_MIN}
                onClick={() => onFontSizeChange(-1)}
              >
                <Minus size={20} strokeWidth={2.5} />
              </IconButton>
              <IconButton
                type="button"
                title="增大字號"
                disabled={fontSize >= FONT_SIZE_MAX}
                onClick={() => onFontSizeChange(1)}
              >
                <Plus size={20} strokeWidth={2.5} />
              </IconButton>
            </>
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
            <>
              <IconButton
                type="button"
                title="變暗"
                disabled={textBrightness <= TEXT_BRIGHTNESS_MIN}
                onClick={() => onTextBrightnessChange(-1)}
              >
                <Moon size={20} strokeWidth={2.5} />
              </IconButton>
              <IconButton
                type="button"
                title="變亮"
                disabled={textBrightness >= TEXT_BRIGHTNESS_MAX}
                onClick={() => onTextBrightnessChange(1)}
              >
                <Sun size={20} strokeWidth={2.5} />
              </IconButton>
            </>
          )}
          {onRefresh && (
            <IconButton type="button" title="重新載入章節" onClick={onRefresh}>
              <RefreshCw size={20} strokeWidth={2.5} />
            </IconButton>
          )}
          <IconLink to={`/catalog?bookId=${chapterData.novel_data.book_id}`} title="目錄">
            <Menu size={20} strokeWidth={2.5} />
          </IconLink>
        </RightActions>
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
