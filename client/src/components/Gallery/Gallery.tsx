import React from 'react';
import ImageGallery from 'react-image-gallery';
import styles from './Gallery.css';

export interface GalleryProps {
  artist?: any;
  server?: string;
}

export function Gallery(props: GalleryProps) {
  
  console.log("Gallery", props);
  console.log("Gallery.styles", styles);

  const { artist, server } = props;
  const images = artist.gallery.map((image: any) => {
    return {
      original: server + image,
      thumbnail: server + image
    };
  });

  return (
    <div className="image-gallery-wrapper">
      <ImageGallery items={images} />      
    </div>
  );
}
