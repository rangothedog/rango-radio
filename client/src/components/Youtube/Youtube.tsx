import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import styles from './Youtube.css';

export interface YoutubeProps {
  url?: string;
  index?: number;
  onPlaybackChange?: (isPlaying: boolean, player: ReactPlayer) => void;
}

export function Youtube(props: YoutubeProps) {
 
  console.log("Youtube", props);

  const { url, onPlaybackChange } = props;  
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);

  /***
  setIsPlaying(playing => {
    console.log("Youtube.setIsPlaying", playing);
    if (playerRef && playerRef.current) {            
      if (onPlaybackChange) {
        onPlaybackChange(true, playerRef.current);
      }
    }
    return isPlaying;
  });
  **/
 
  function handlePlay() {
    console.log("Youtube.Play", playerRef);
    setIsPlaying(true);      
  }
  
  function handlePause() {
    console.log("Youtube.Pause", playerRef);
    setIsPlaying(false);
  }

  function handleStart() {    
    console.log("Youtube.Start");
  }

  useEffect(() => {
    const player = playerRef.current;
    console.log("Youtube.useEffect", player);
  }, [url, isPlaying]);

  return <div className="youtube-player">
    <ReactPlayer 
      ref={playerRef}      
      url={url}   
      onPlay={handlePlay}
      onPause={handlePause}
      onStart={handleStart}
      />  
  </div>;
}

