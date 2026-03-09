import React, { useState } from 'react';
import styled from 'styled-components';
import { Megaphone } from 'lucide-react';
import { GrayButton } from '../common/GrayButton';
import { useToast } from '../../contexts/ToastContext';
import { migrateCacheFromLocalStorage } from '../../utils/migrate';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
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

const NoticeCard = styled.div`
  padding: 20px;
  background-color: var(--background-color2);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  font-size: 14px;
  color: var(--text-color-secondary);
  line-height: 1.6;
`;

function NoticeBoard() {
  const [migrating, setMigrating] = useState(false);
  const { showToast } = useToast();

  const handleMigrate = async () => {
    setMigrating(true);
    try {
      const { migrated } = await migrateCacheFromLocalStorage();
      showToast(migrated > 0 ? `已遷移 ${migrated} 筆快取至 IndexedDB` : '沒有需要遷移的資料');
    } catch (err) {
      showToast('遷移失敗，請稍後再試', 3500);
    } finally {
      setMigrating(false);
    }
  };

  return (
    <Section>
      <SectionTitle><Megaphone /> 公告</SectionTitle>
      <NoticeCard>
        2026-03-09 章節快取已升級至 IndexedDB，不再受 localStorage 容量限制，可下載更多章節。
        若您之前使用過本應用，請點擊下方按鈕遷移舊資料。<br></br>
        <GrayButton type="button" onClick={handleMigrate} disabled={migrating} style={{ marginTop: 12, opacity: migrating ? 0.6 : 1 }}>
          {migrating ? '遷移中…' : '遷移 localStorage 快取至 IndexedDB'}
        </GrayButton>
        <br></br>
      </NoticeCard>
    </Section>
  );
}

export default NoticeBoard;
