import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} — UAMS` : 'UAMS';
  }, [title]);
};

export default useDocumentTitle;
