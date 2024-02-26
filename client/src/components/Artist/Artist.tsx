import React, {useState, useEffect} from 'react';

import styles from './Artist.css';

export interface ArtistProps {
  artist?: any;
  server?: string;
}

export function Artist(props: ArtistProps) {
  
  console.log("Artist", props);
  console.log("Artist.styles", styles);

  const { artist, server } = props;
  const [imageUrl, setImageUrl] = useState("");
  
  useEffect(() => {
    console.log("Artist.useEffect")

    setImageUrl(server + (artist as any)?.image ?? "");
    
  }, [artist, server, imageUrl]);


  return <div className="Artist">
    <div className="artist-header">
      <img width="200" src={imageUrl} className="artist-image" alt={artist?.name} />
      <div>
        <h1>{artist?.name}</h1>
        <p>{artist?.bio}</p>
        <div className="artist-location">
          <h2>{artist?.city}</h2>
          <h2>{artist?.state}</h2>
          <h2>{artist?.country}</h2>
        </div>
      </div>
    </div>
    <div className="artist-links">
      <a className="app-link" href={artist?.facebook_profile} target="_blank" rel="noopener noreferrer">
        Facebook
      </a>
      <a className="app-link" href={artist?.twitter_profile} target="_blank" rel="noopener noreferrer">
        Twitter
      </a>
      <a className="app-link" href={artist?.instagram_profile} target="_blank" rel="noopener noreferrer">
        Instagram
      </a>
      <a className="app-link" href={artist?.soundcloud_profile} target="_blank" rel="noopener noreferrer">
        Soundcloud
      </a>
      <a className="app-link" href={artist?.youtube_profile} target="_blank" rel="noopener noreferrer">
        YouTube
      </a>
    </div>
  </div>
  ;
}
