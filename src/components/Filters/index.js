import React, { useState } from 'react';
import styles from './styles.module.css';
import Box from 'components/Box';
import Drawer from 'components/Drawer';
import { useData } from 'components/Data';

export default function Filters() {
  const [open, setOpen] = useState(false);
  const [{ filters, activeFilters }, { resetFilter, toggleFilter }] = useData();

  console.log({ filters, activeFilters });

  const handleReset = type => () => resetFilter(type);
  const handleChange = (type, value) => () => toggleFilter(type, value);

  return (
    <div>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen(true)}
      >
        <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24">
          <path
            fill="currentcolor"
            d="M6,13H18V11H6M3,6V8H21V6M10,18H14V16H10V18Z"
          />
        </svg>
      </button>
      <Drawer open={open} setOpen={setOpen}>
        <Box as="h2" gutterBottom>
          Building status
        </Box>
        <Box gutterBottom>
          <ul>
            <li>
              <button type="button" onClick={handleReset('status')}>
                Reset
              </button>
            </li>
            {filters.status.map(status => (
              <li key={status}>
                <label className={styles.label} htmlFor={`status-${status}`}>
                  <input
                    id={`status-${status}`}
                    type="checkbox"
                    checked={activeFilters.status.includes(status)}
                    onChange={handleChange('status', status)}
                  />{' '}
                  {status}
                </label>
              </li>
            ))}
          </ul>
        </Box>
        <Box as="h2" gutterBottom>
          Building type
        </Box>
        <ul>
          <li>
            <button type="button" onClick={handleReset('type')}>
              Reset
            </button>
          </li>
          {filters.type.map(type => (
            <li key={type}>
              <label className={styles.label} htmlFor={`type-${type}`}>
                <input
                  id={`type-${type}`}
                  type="checkbox"
                  checked={activeFilters.type.includes(type)}
                  onChange={handleChange('type', type)}
                />{' '}
                {type}
              </label>
            </li>
          ))}
        </ul>
      </Drawer>
    </div>
  );
}
