import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.css';

export default function Box({ as = 'div', className, gutterBottom, ...props }) {
  const Component = as;
  return (
    <Component
      className={clsx(
        {
          [styles.gutterBottom]: gutterBottom
        },
        className
      )}
      {...props}
    />
  );
}
