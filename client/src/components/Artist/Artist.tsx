import React from 'react';

import styles from './Artist.css';

export interface ArtistProps {
  artist?: any;
}

export function Artist(props: ArtistProps) {
  
  console.log("Artist", props);
  console.log("Artist.styles", styles);

  const { artist } = props;
  return <div>
    <img src={artist.image} className="artist-image" alt={artist.name} />
    <h1>{artist.name}</h1>
    <p>{artist.bio}</p>
    <h3>{artist.city}</h3>
    <h3>{artist.state}</h3>
    <h3>{artist.country}</h3>
  </div>
  ;
}
