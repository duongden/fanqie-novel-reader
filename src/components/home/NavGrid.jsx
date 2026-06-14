import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { BookOpen, PlusCircle, Megaphone, MessageCircleWarning, Info, Github } from 'lucide-react';
import { GITHUB_ISSUES_URL, GITHUB_README_URL, GITHUB_REPO_URL } from '../../utils/constants';
import { ROUTES } from '../../utils/navigation';

const ICON_SIZE = 40;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  width: 100%;

  @media (max-width: 700px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  @media (max-width: 400px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

const tileStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 22px 12px;
  aspect-ratio: 1 / 1;
  background-color: var(--background-color2);
  border: var(--retro-border-width) solid var(--border-color);
  cursor: pointer;
  transition: all 0.1s steps(2);
  box-shadow: var(--retro-shadow);
  width: 100%;
  min-width: 0;
  font-family: inherit;
  color: inherit;
  text-decoration: none;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;

  & > svg {
    width: ${ICON_SIZE}px;
    height: ${ICON_SIZE}px;
    color: var(--accent-color);
    flex-shrink: 0;
  }

  @media (min-width: 600px) {
    padding: 20px 10px;
  }

  @media (hover: hover) {
    &:hover {
      transform: translate(-2px, -2px);
      border-color: var(--accent-color);
      background-color: var(--hover-background-color);
      box-shadow: 6px 6px 0px var(--background-color);

      & > svg {
        color: var(--accent-hover);
      }
    }
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: 0px 0px 0px var(--background-color);
  }
`;

const TileButton = styled.button`${tileStyles}`;

const TileLink = styled.a`${tileStyles}`;

const TileLabel = styled.span`
  font-size: 18px;
  font-weight: 900;
  color: var(--text-color);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: center;
  line-height: 1.2;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TileSubLabel = styled.span`
  font-size: 12px;
  color: var(--text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  opacity: 0.75;
  text-align: center;
  line-height: 1.3;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

function NavGrid() {
  const navigate = useNavigate();

  return (
    <Grid>
      <TileButton type="button" onClick={() => navigate(ROUTES.bookshelf)}>
        <BookOpen size={ICON_SIZE} strokeWidth={2} aria-hidden />
        <TileLabel>書架</TileLabel>
        <TileSubLabel>閱讀歷史 · 收藏</TileSubLabel>
      </TileButton>
      <TileButton type="button" onClick={() => navigate(ROUTES.newBook)}>
        <PlusCircle size={ICON_SIZE} strokeWidth={2} aria-hidden />
        <TileLabel>新書</TileLabel>
        <TileSubLabel>開始新閱讀</TileSubLabel>
      </TileButton>
      <TileButton type="button" onClick={() => navigate(ROUTES.announcements)}>
        <Megaphone size={ICON_SIZE} strokeWidth={2} aria-hidden />
        <TileLabel>公告</TileLabel>
        <TileSubLabel>更新與通知</TileSubLabel>
      </TileButton>
      <TileLink href={GITHUB_ISSUES_URL} target="_blank" rel="noopener noreferrer">
        <MessageCircleWarning size={ICON_SIZE} strokeWidth={2} aria-hidden />
        <TileLabel>回報</TileLabel>
        <TileSubLabel>問題回報</TileSubLabel>
      </TileLink>
      <TileLink href={GITHUB_README_URL} target="_blank" rel="noopener noreferrer">
        <Info size={ICON_SIZE} strokeWidth={2} aria-hidden />
        <TileLabel>關於我們</TileLabel>
        <TileSubLabel>專案介紹</TileSubLabel>
      </TileLink>
      <TileLink href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
        <Github size={ICON_SIZE} strokeWidth={2} aria-hidden />
        <TileLabel>原始碼</TileLabel>
        <TileSubLabel>GitHub 倉庫</TileSubLabel>
      </TileLink>
    </Grid>
  );
}

export default NavGrid;
