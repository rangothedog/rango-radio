import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import styles from './Soundcloud.css';

export interface SoundcloudProps {
  url?: string;  
  onPlaybackChange?: (isPlaying: boolean, player:ReactPlayer) => void;
}

export function Soundcloud(props: SoundcloudProps) {
  
  console.log("Soundcloud", props);

  const { url, onPlaybackChange } = props; 
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  function handlePlay() {
    console.log("Soundcloud.Play", playerRef.current);
    setIsPlaying(true);       
  }
  
  function handlePause() {
    console.log("Soundcloud.Pause", playerRef.current);
    setIsPlaying(false);
  }

  function handleStart() {    
    console.log("Soundcloud.Start");
  }

  useEffect(() => {    
    console.log("Soundcloud.useEffect", playerRef.current); 
  }, [url]);
  

  return <div className="soundcloud-player">
    <ReactPlayer 
      ref={playerRef}      
      url={url}
      onPlay={handlePlay}
      onPause={handlePause} 
      onStart={handleStart}       
      />  
  </div>;
}
