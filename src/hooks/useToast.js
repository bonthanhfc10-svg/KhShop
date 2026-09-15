import { useState, useEffect, useCallback } from 'react';

let toastId = 0;

export default function useToast() {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((message, { duration = 3000 } = {}) => {
    const id = ++toastId;
    setToasts((prev) => {
      const next = prev.length >= 3 ? prev.slice(1) : prev;
      return [...next, { id, message }];
    });
    setTimeout(() => remove(id), duration);
  }, [remove]);

  return { toasts, show, remove };
}
