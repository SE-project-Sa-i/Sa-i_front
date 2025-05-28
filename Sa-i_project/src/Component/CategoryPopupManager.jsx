import React, { useState } from 'react';
import CategoryEdit from './Categoryedit';
import  CategoryDelete  from './Categorydelete';
import  CategoryDeleteConfirmed  from './CategorydeleteConfirmed';
import CategorySaved from './CategorySaved';

export default function CategoryPopupManager({ onClose }) {
  // 상태: edit → delete → confirmed
  const [mode, setMode] = useState('edit');

  return (
    <>
      {mode === 'edit' && (
        <CategoryEdit
          onClose={onClose}
          onDeleteClick={() => setMode('delete')}
          onSaveClick={() => setMode('saved')}
        />
      )}

      {mode === 'delete' && (
        <CategoryDelete
          onClose={onClose}
          onConfirmDelete={() => setMode('confirmed')}
          onCancelDelete={() => setMode('edit')}
        />
      )}

      {mode === 'confirmed' && (
        <CategoryDeleteConfirmed
          onClose={onClose} // 최종 OK 클릭 시 팝업 종료
        />
      )}

      {mode === 'saved' && (
        <CategorySaved
          onClose={onClose} // 최종 OK 클릭 시 팝업 종료
        />
      )}
    </>
  );
}
