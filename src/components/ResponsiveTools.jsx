import React, { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { IconButton } from './IconButton';
import styled from 'styled-components';
import { useMediaQuery } from '../hooks/useMediaQuery';

const ToolsToggle = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  padding: 8px;
  min-width: 40px;
  min-height: 40px;
  color: var(--text-color-secondary);
  background: none;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--hover-background-color);
    color: var(--accent-color);
  }

  @media (max-width: 480px) {
    display: flex;
  }
`;

const Overlay = styled.div`
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  pointer-events: ${(p) => (p.$visible ? 'auto' : 'none')};
  transition: opacity 0.2s ease;

  @media (max-width: 480px) {
    display: block;
  }
`;

const ToolsPanel = styled.div`
  display: none;

  @media (max-width: 480px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: calc(12px + env(safe-area-inset-top));
    right: 0;
    width: min(240px, 85vw);
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 12px;
    background-color: rgba(18, 18, 18, 0.98);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border-color);
    border-right: none;
    border-radius: 12px 0 0 12px;
    z-index: 1001;
    box-shadow: -8px 0 24px rgba(0, 0, 0, 0.4);
    transform: translateX(${(p) => (p.$open ? '0' : '100%')});
    transition: transform 0.25s ease-out;
    overflow: hidden;
  }
`;

const ToolsPanelHeader = styled.div`
  display: none;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: 480px) {
    display: flex;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-color);
  }

  span {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-color);
  }
`;

const ToolsPanelContent = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  flex-shrink: 0;
  padding-bottom: 16px;
`;

function ResponsiveTools({ children, panelTitle = '工具' }) {
  const [toolsExpanded, setToolsExpanded] = useState(false);
  const isMobile = useMediaQuery('(max-width: 480px)');

  return (
    <>
      {isMobile ? (
        <>
          <ToolsToggle type="button" title={panelTitle} onClick={() => setToolsExpanded(true)}>
            <SlidersHorizontal size={20} strokeWidth={2.5} />
          </ToolsToggle>
          <Overlay $visible={toolsExpanded} onClick={() => setToolsExpanded(false)} aria-hidden="true" />
          <ToolsPanel $open={toolsExpanded}>
            <ToolsPanelHeader>
              <span>{panelTitle}</span>
              <IconButton type="button" title="關閉" onClick={() => setToolsExpanded(false)}>
                <X size={20} strokeWidth={2.5} />
              </IconButton>
            </ToolsPanelHeader>
            <ToolsPanelContent onClick={() => setToolsExpanded(false)}>{children}</ToolsPanelContent>
          </ToolsPanel>
        </>
      ) : (
        <>{children}</>
      )}
    </>
  );
}

export default ResponsiveTools;
