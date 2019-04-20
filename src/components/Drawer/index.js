import React, { useRef, useEffect } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';

export default function Drawer({ open, setOpen, children }) {
  const paperRef = useRef();

  useEffect(() => {
    if (open) paperRef.current.focus();
  }, [open]);

  return (
    <>
      <div
        className={clsx(styles.fill, styles.overlay, { [styles.open]: open })}
        onClick={() => setOpen(false)}
      />
      <div
        className={clsx(styles.fill, styles.paper, { [styles.open]: open })}
        tabIndex={-1}
        ref={paperRef}
      >
        {children}
      </div>
    </>
  );
}
