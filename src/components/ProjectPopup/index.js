import React from 'react';
import styles from './styles.module.css';
import Box from '../Box';

export default function ProjectPopup({ project }) {
  return (
    <div className={styles.root}>
      <div>
        <img className={styles.img} src={project.image} alt={project.title} />
      </div>
      <div>
        <Box as="h2" gutterBottom>
          {project.title}
        </Box>
        <Box as="p">{project.address}</Box>
        <Box as="p" gutterBottom>
          {project.status}
          {project.completion && ` (Completion: ${project.completion})`}
        </Box>
        <Box as="p">
          <a href={project.url} rel="noopener noreferrer" target="_blank">
            Project details
          </a>
        </Box>
      </div>
    </div>
  );
}
