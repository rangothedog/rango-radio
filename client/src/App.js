import React, {useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import microphone from './img/microphone-large.png';
import { Artist } from './components/Artist/Artist.tsx';
import { Audio } from './components/Audio/Audio.tsx';
import { Soundcloud } from './components/Soundcloud/Soundcloud.tsx';
import { Youtube } from './components/Youtube/Youtube.tsx';
import { Gallery } from './components/Gallery/Gallery.tsx';
import config from './config.json';
import styles from './App.css';

console.log("config", config);
console.log("styles", styles);

const active = config.sites.filter(site => site.active)[0];
console.log("active", active);

const server = config.server.protocol + "://" + config.server.host + ":" + config.server.port;
console.log("server", server);

const titles = active.title.split(" ");
console.log("titles", titles);
  

function App() {
  const [featuredArtists, setFeaturedArtists] = useState(null);
  const [featuredArtist, setFeaturedArtist] = useState(null);
  const [featuredArtistIndex, setFeaturedArtistIndex] = useState(0);
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
      console.log("App.featured url", featuredUrl);

      fetch(featuredUrl)
        .then((response) => {
          console.log("App.featured response", response);
          return response.clone().json();
        })
        .then((featured) => {
          console.log("App.featured data", featured);
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
    loadFeaturedArtists();
  }, [featuredArtists, loadFeaturedArtists]);

  return (
    <div className="app">
      <div className="app-header">
        <div>
          <h1>{titles.length > 0 ? titles[0]: ""}</h1>
          <img src={microphone} className="app-microphone" alt="microphone" />
          <h1>{titles.length > 1 ? titles[1]: ""}</h1>
        </div>
      </div>
      <div className="app-main">
        <Tabs>
          <TabList>
            <Tab><div className="app-stage-title">Artist</div></Tab>
            <Tab><div className="app-stage-title">Listen</div></Tab>
            <Tab><div className="app-stage-title">Soundcloud</div></Tab>
            <Tab><div className="app-stage-title">YouTube</div></Tab>
            <Tab><div className="app-stage-title">Gallery</div></Tab>
          </TabList>
          <TabPanel>
            <div className="app-stage app-stage-1">
              <div className="app-stage-content app-stage-artist">                
                <Artist 
                  artist={featuredArtist}
                  server={server}
                />
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="app-stage app-stage-2">
              <div className="app-stage-content app-stage-audio">
                <Audio
                  artist={featuredArtist}
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
                  url={featuredArtist ? featuredArtist.soundcloud_playlist : ""}           
                  onPlaybackChange={soundcloudPlaybackChange}
                />
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="app-stage app-stage-4">
              <div className="app-stage-content app-stage-youtube">
                <Youtube className="app-youtube"
                  url={featuredArtist? featuredArtist.youtube_playlist : ""}
                  onPlaybackChange={youtubePlaybackChange}
                />
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="app-stage app-stage-5">
              <div className="app-stage-content app-stage-gallery">                
                <Gallery className="app-gallery"
                  artist={featuredArtist}
                  server={server}                
                />
              </div>
            </div>
          </TabPanel>
        </Tabs>  
      </div>      
      <div className="app-footer">        
        <div>
          {error}
          <span>
            <a className="app-link" href="https://www/rangothedog.com" target="_blank" rel="noopener noreferrer">
              rangothedog.com
            </a>
          </span>
          </div>
      </div>      
    </div>
  );
}

export default App;
