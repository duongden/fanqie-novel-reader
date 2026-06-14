import React from 'react';
import styled from 'styled-components';
import { Check } from 'lucide-react';
import {
  Modal,
  ModalTitleBar,
  ModalBody,
  ModalFooterRow,
  ModalInput,
  ModalPrimaryButton,
} from '../common/ModalBase';

const EmptyHint = styled.div`
  font-size: 13px;
  color: var(--text-color-secondary);
  opacity: 0.6;
  text-align: center;
  padding: 40px 16px;
  border: 1px dashed var(--border-color);
  background: var(--background-color2);
`;

const CollectionOption = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: ${(p) => (p.$checked ? 'rgba(212, 165, 116, 0.15)' : 'var(--background-color)')};
  border: 1px solid ${(p) => (p.$checked ? 'var(--accent-color)' : 'var(--border-color)')};
  color: var(--text-color);
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition: all 0.1s steps(2);

  &:hover {
    border-color: var(--accent-color);
    background: var(--hover-background-color);
  }

  .check {
    width: 16px;
    height: 16px;
    color: var(--accent-color);
    flex-shrink: 0;
  }
`;

function CollectionModal({
  bookId,
  collections,
  newCollectionName,
  onNewCollectionNameChange,
  onClose,
  onToggleBook,
  onCreateCollection,
}) {
  return (
    <Modal onClose={onClose}>
      <ModalTitleBar title="加入收藏夾" onClose={onClose} />
      <ModalBody>
        {collections.length === 0 ? (
          <EmptyHint>尚無收藏夾，請先建立一個</EmptyHint>
        ) : (
          collections.map((col) => {
            const checked = col.bookIds.includes(String(bookId));
            return (
              <CollectionOption
                key={col.id}
                $checked={checked}
                onClick={() => onToggleBook(col.id, bookId)}
              >
                {col.name}
                {checked && <Check className="check" />}
              </CollectionOption>
            );
          })
        )}
      </ModalBody>
      <ModalFooterRow>
        <ModalInput
          value={newCollectionName}
          onChange={(e) => onNewCollectionNameChange(e.target.value)}
          placeholder="新增收藏夾…"
          onKeyDown={(e) => { if (e.key === 'Enter') onCreateCollection(); }}
        />
        <ModalPrimaryButton type="button" onClick={onCreateCollection}>
          建立
        </ModalPrimaryButton>
      </ModalFooterRow>
    </Modal>
  );
}

export default CollectionModal;
