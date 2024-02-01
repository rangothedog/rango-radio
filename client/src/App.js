import React, {useEffect, useLayoutEffect, useState, useRef} from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import banner from './img/rango-radio-banner.png';
import cover from './img/artist/rango/countrysong/rango_country_song.jpg';
import microphone from './img/microphone-large.png';
import { Audio } from './components/Audio/Audio.tsx';
import { Soundcloud } from './components/Soundcloud/Soundcloud.tsx';
import { Youtube } from './components/Youtube/Youtube.tsx';
import config from './config.json';
import styles from './App.css';

console.log("config", config);
console.log("styles", styles);
const active = config.sites.filter(site => site.active)[0];
const clientId = active ? active.soundcloud_client_id : null;
console.log("active", active);
const shows = active && active.length > 0 ? active[0].shows : null;
const showUrl = "https://soundcloud.com/matthewmeadowsmusic/rango-unmuzzled-31-the-fail";
const videoUrl = "https://www.youtube.com/watch?v=L4FjzrYCLQY";

const artist = "Rango";
const songTitle = "Country Song";
const stream = "http://localhost:3001/stream/rango/countrysong/countrysong/rango_country_song.mp3";

const server = config.server.protocol + "://" + config.server.host + ":" + config.server.port;
console.log("server", server);

function App() {
  const audioRef = useRef(null);
  const soundCloudRef = useRef(null);
  const youtubeRef = useRef(null);

  const [featuredArtists, setFeaturedArtists] = useState(null);
  const [featuredArtist, setFeaturedArtist] = useState(null);
  const [featuredArtistIndex, setFeaturedArtistIndex] = useState(0);
  const [tracks, setTracks] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(-1);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function soundcloudPlaybackChange(isPlaying, player) {
    console.log("Soundcloud playback change", isPlaying, player);
  }

  function youtubePlaybackChange(isPlaying, player) {
    console.log("Youtube playback change", isPlaying, player);
  }

  function audioPlaybackChange(isPlaying, player) {
    console.log("Audio playback change", isPlaying, player);
  }

  function loadFeaturedArtists() {
    if (loading) {
      const featuredUrl = server + "/featured";
      console.log("featured url", featuredUrl);

      fetch(featuredUrl)
        .then((response) => {
          console.log("featured response", response);
          return response.clone().json();
        })
        .then((featured) => {
          console.log("featured data 1", featured);
          setFeaturedArtists(featured);
          console.log("App.setFeturedArtists", featured);

          if (featured && featured.length > 0) {
            const artist = featured[0];
            setFeaturedArtist(artist);
            console.log("App.setFeturedArtist", artist);

            if (artist && artist.albums && artist.albums.length > 0) {

              if (featured && featured.length > 0) {
                const index = featured.indexOf(artist);
                console.log("App.setFeturedArtistIndex", index);
                setFeaturedArtistIndex(index);
              }

              const albums = artist.albums;

              if (albums && albums.length > 0) {
                const tracks = [];
                albums.forEach((album) => {
                  const albumTracks = album.tracks;
                  albumTracks.forEach((track) => {
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
                    //if (audioRef && audioRef.current) {
                    //  audioRef.current.setTrack(track);
                    //}
                    if (tracks && tracks.length > 0) {
                      const trackIndex = tracks.indexOf(track);
                      console.log("App.setSelectedTrackIndex", trackIndex);
                      setSelectedTrackIndex(trackIndex);
                    }
                  }
                }
              }
            }
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setError(error);
        });
    }
  }

  useEffect(() => {

    console.log("App.useEffect");
    
  }, [featuredArtists]);

  useLayoutEffect(() => {
    console.log("App.useLayoutEffect");
    loadFeaturedArtists();
  }, [featuredArtists]);

  return (
    <div className="app">
      <div className="app-header">
        <h1>{active.title}</h1>
          <a
            className="app-link"
            href="https://www/rangoradio.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Dog House
          </a>        
      </div>
      <div className="app-main">
        <Tabs>
          <TabList>
            <Tab><div className="app-stage-title">Artist</div></Tab>
            <Tab><div className="app-stage-title">Listen</div></Tab>
            <Tab><div className="app-stage-title">Soundcloud</div></Tab>
            <Tab><div className="app-stage-title">YouTube</div></Tab>
          </TabList>
          <TabPanel>
            <div className="app-stage app-stage-1">
              <div className="app-stage-content app-stage-artist">
              <img src={cover} className="app-stage-image" alt="Rango" /> 
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="app-stage app-stage-2">
              <div className="app-stage-content app-stage-audio">            
                <Audio
                  artist={featuredArtist}
                  tracks={tracks}
                  server={server}
                  onPlaybackChange={audioPlaybackChange}
                />                        
              </div>
            </div>
          </TabPanel>
        
          <TabPanel>
            <div className="app-stage app-stage-3">          
              <div className="app-stage-content app-stage-soundcloud">
                <Soundcloud              
                  url={showUrl}              
                  onPlaybackChange={soundcloudPlaybackChange}            
                />
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="app-stage app-stage-4">            
              <div className="app-stage-content app-stage-youtube">
                <Youtube className="app-youtube"              
                  url={videoUrl}              
                  onPlaybackChange={youtubePlaybackChange}
                />
              </div>
            </div>
          </TabPanel>
        </Tabs>  
      </div>      
      <div className="app-footer">
        Footer
        <div>{error}</div>
      </div>
      
    </div>
  );
}

export default App;
