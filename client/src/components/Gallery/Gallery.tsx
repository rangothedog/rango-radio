import React from 'react';

import styles from './Gallery.css';

export interface GalleryProps {
  prop?: string;
}

export function Gallery({prop = 'default value'}: GalleryProps) {
  return <div className={styles.Gallery}>Gallery {prop}</div>;
}
