import React, { useRef, useState, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import { Analyzer, AnalyzerData } from '../Analyzer/Analyzer.tsx';
import 'react-h5-audio-player/lib/styles.css';

import styles from './Audio.css';

export interface AudioProps {
  artist?: any;
  server?: string;
  onPlaybackChange?: (isPlaying: boolean, player:any) => void;
}

export function Audio(props: AudioProps) {
  
  console.log("Audio", props);
  console.log("Audio.styles", styles);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRef = useRef<MediaElementAudioSourceNode | null>(null);
  const playerRef = useRef<AudioPlayer | null>(null);  

  const { artist, server, onPlaybackChange } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState(Array<any>);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(-1);
  const [streamUrl, setStreamUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);


  function handlePlay() {
    console.log("Audio.Play", playerRef.current);
    setIsPlaying(true);
    if (playerRef && playerRef.current) {
      if (onPlaybackChange) {
        onPlaybackChange(true, playerRef.current);
      }
    }     
  }

  function handlePause() {
    console.log("Audio.Pause", playerRef.current);
    setIsPlaying(false);
    if (playerRef && playerRef.current) {            
      if (onPlaybackChange) {
        onPlaybackChange(false, playerRef.current);
      }
    }     
  }

  function clickPrevious() {
    if (selectedTrackIndex > 0) {
      console.log("Audio.clickPrevious", selectedTrackIndex);
      setSelectedTrackIndex(selectedTrackIndex - 1);
    }
  }

  function clickNext() {    
    if (selectedTrackIndex < tracks.length - 1) {
      console.log("Audio.clickNext", selectedTrackIndex);
      setSelectedTrackIndex(selectedTrackIndex + 1);
    }
  
  }
  useEffect(() => {
    console.log("Audio.useEffect.player", playerRef.current)

    const albums = artist.albums;   

    if (albums && albums.length > 0) {
      const tracks: any[] =  [];
      albums.forEach(album => {         
        album.tracks.forEach(track => {
          tracks.push(track);
        });
      });
      setTracks(tracks);
      console.log("App.setTracks", tracks);

      if (tracks && tracks.length > 0) {
        const track = tracks[0];
        console.log("track", track);
        setSelectedTrack(track);
        console.log("App.setSelectedTrack", track);
        if (track) {
          if (tracks && tracks.length > 0) {
            const trackIndex = tracks.indexOf(track);
            console.log("App.setSelectedTrackIndex", trackIndex);
            setSelectedTrackIndex(trackIndex);
          }
        }
      }
    }
    
    const selectedTrack = tracks && tracks.length ? tracks[selectedTrackIndex] : null;    
    console.log("Audio.useEffect.selectedTrack", selectedTrack);
    if (!selectedTrack) {
      return;
    }
        
    setStreamUrl(server + (selectedTrack as any)?.stream ?? "");
    setImageUrl(server + (selectedTrack as any)?.image ?? ""); 
    setSelectedTrack(selectedTrack);        

    const audioElement = (playerRef.current as any).audio.current as HTMLAudioElement | null;
    console.log("Audio.useEffect.audioElement", audioElement);
    if (!audioElement) {
      return;
    }
    
    audioElement.crossOrigin = "anonymous";
    if (audioContextRef.current == null) {
      audioContextRef.current = new window.AudioContext();
      console.log("Audio.useEffect.audioContext", audioContextRef.current);
    }

    console.log("Audio.useEffect.audioContext.state", audioContextRef.current?.state);
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
      console.log("Audio.useEffect.audioContext.resume", audioContextRef.current);
    }

    analyzerRef.current = audioContextRef.current.createAnalyser();
    console.log("Audio.useEffect.analyzer", analyzerRef.current);
    if (!analyzerRef.current) {
      return;
    }
    
    if (mediaRef.current == null) {
      mediaRef.current = audioContextRef.current.createMediaElementSource(audioElement);
      console.log("Audio.useEffect.mediaRef", mediaRef.current);          
    }

    if (mediaRef.current) {
      mediaRef.current.connect(analyzerRef.current);
      analyzerRef.current.connect(audioContextRef.current.destination);    
    }

    const draw = () => {
      const canvas = canvasRef.current;      
      if (!canvas) {
        return;  
      }
  
      const canvasCtx = canvas.getContext('2d');    
      if (!canvasCtx) {
        return;
      }

      if (!analyzerRef.current) {      
        return; 
      }

      const bufferLength = analyzerRef.current.frequencyBinCount;
      
      requestAnimationFrame(draw);

      const dataArray = new Uint8Array(bufferLength);

      analyzerRef.current.getByteFrequencyData(dataArray);
  
      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        canvasCtx.fillStyle = `rgb(${barHeight + 100},50,50)`;
        canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
      }      
    };

    draw();
  }, [artist, selectedTrackIndex, isPlaying]);
  
  
  return <div className="audio-player">
    <div className="audio-player-track">
      {/* <button className="audio-player-button left" onClick={e => setTrackIndex(trackIndex - 1)}>&lt;</button> */}
      <div className="audio-player-track-left">
        <div className="audio-player-image">
          <img src={imageUrl || ""} height={200} width={200} />
        </div>        
      </div>
      <div className="audio-player-track-right">
          <div className="audio-player-track-row">
            <div className="audio-player-track-col audio-player-artist">{artist?.name}</div>
            <div className="audio-player-track-col audio-player-title">{(selectedTrack as any)?.title}</div>
            <div className="audio-player-track-col audio-player-date">{(selectedTrack as any)?.date}</div>
            <div className="audio-player-track-col audio-player-urls">
              <div className="audio-player-track-col audio-player-track-url spotify">        
                <a className="app-link" href={(selectedTrack as any)?.spotify} target="_blank" rel="noopener noreferrer">
                    Spotify
                  </a>
                </div>
                <div className="audio-player-track-col audio-player-track-url amazon">
                  <a className="app-link" href={(selectedTrack as any)?.amazon} target="_blank" rel="noopener noreferrer">
                    Amazon
                  </a>
                </div>
                <div className="audio-player-track-col audio-player-track-url apple">
                  <a className="app-link" href={(selectedTrack as any)?.apple} target="_blank" rel="noopener noreferrer">
                    Apple
                  </a>
                </div>
              </div>
          </div>          
        </div>      
    </div>
    
    {/*<button className="audio-player-button right" onClick={e => setTrackIndex(trackIndex + 1)}>&gt;</button>*/}
    
    <div className="audio-player-canvas">
      <canvas ref={canvasRef}/>
    </div>
    <AudioPlayer
      autoPlay={false}
      autoPlayAfterSrcChange={false}
      src={streamUrl || ""}
      onPlay={handlePlay}
      onPause={handlePause}      
      onClickNext={clickNext}
      onClickPrevious={clickPrevious}
      ref={playerRef}
      showSkipControls={true}
    />
  </div>;
}
