const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");

const Config = require("./config");
const config = new Config("./config.json").read();

const name = config.server.name;
const port = config.server.port;
const description = config.server.description;

let path = config.server.contentDirectory;
if (!path.startsWith("/")) { 
  path = "/" + path;
}
if (!path.endsWith("/")) {
  path += "/";
}

console.log("home", __dirname);
console.log("path", path);

const content = __dirname + path;
console.log("content", content);
app.use(path, express.static(content));

if (config.server.cors.enabled) {
  const corsOptions = {
    origin: config.server.cors.origin,
  };
  app.use(cors(corsOptions));
  console.log("cors enabled", corsOptions);
}
else {
  console.log("cors disabled");
}

app.get("/", (req, res) => {
  res.send(`${name}:${port} ${description}`);
});

/***
app.get("/schema", (req, res) => {
  res.json(config.read());
});

app.get("/active", (req, res) => {
  config.read();
  res.json(config.active());
});

app.get("/shows", (req, res) => {
  config.read();
  res.json(config.active().shows);
});

app.get("/owner", (req, res) => {
  config.read();
  res.json(config.active().owner);
});

***/

app.get('/image/:artist/:filename', (req, res) => {
  const filename = req.path.replace("/image/", "");
  const file = content + filename;
  console.log("image", file)
  res.sendFile(file);
});

app.get('/image/:artist/:album/:track/:filename', (req, res) => {
  const filename = req.path.replace("/image/", "");
  const file = content + filename;
  console.log("image", file)
  res.sendFile(file);
});

app.get('/stream/:artist/:album/:track/:filename', (req, res) => {
  const filename = req.path.replace("/stream/", "");
  console.log("stream2", filename)
  const file = content + filename;
  console.log("stream3", file);
  fs.exists(file, (exists) => {
    if (exists) {
      console.log("stream4", file);

      const rstream = fs.createReadStream(file);
      rstream.pipe(res);
    } else {
      res.status(404).send('Error: 404');
      res.end();
    }
  });
});

app.get('/download/:artist/:album/:track/:filename', (req, res) => {
  const filename = req.path.replace("/download/", "");
  const file = content + filename;
  console.log("download", file);
  fs.exists(file, (exists) => {
    if (exists) {
        res.download(file);
    }
    else {
      res.status(404).send('Error: 404');
      res.end();      
    }
  });
});

app.get('/artists/', (req, res) => {
  const artists = config.artists
  console.log("artists", artists);
  res.json(artists);
});

app.get('/featured/', (req, res) => {
  const artists = config.artists
  const featured = artists.filter(artist => artist.featured);
  console.log("featured", featured);
  res.json(featured);
});

app.get('/artist/:artistId', (req, res) => {
  const artistId = req.path.replace("/artist/", "");
  console.log("artistId", artistId);
  const artists = config.artists.filter(artist => artist.id == artistId);  
  if (artists.length > 0) {
    const artist = artists[0];
    console.log("artist", artist);
    res.json(artist);
  }
  else {
    res.status(404).send('Error: 404');
    res.end();      
  }
});

app.get('/albums/:artistId', (req, res) => {
  const artistId = req.path.replace("/albums/", "");
  console.log("artistId", artistId);
  const artists = config.artists.filter(artist => artist.id == artistId);    
  if (artists.length > 0) {
    const artist = artists[0];
    const albums = artist.albums;
    console.log("albums", albums);
    res.json(artist);
  }
  else {
    res.status(404).send('Error: 404');
    res.end();      
  }
});

app.get('/tracks/:artistId', (req, res) => {
  const artistId = req.path.replace("/tracks/", "");
  console.log("artistId", artistId);
  const artists = config.artists.filter(artist => artist.id == artistId);    
  const tracks = [];
  if (artists.length > 0) {
    const artist = artists[0];
    const albums = artist.albums;
    if (albums.length > 0) {
      const album = albums[0];
      tracks = album.tracks;
    }
    console.log("tracks", tracks);
    res.json(tracks);
  }
  else {
    res.status(404).send('Error: 404');
    res.end();      
  }
});

app.listen(port, () => {
  console.log(`${name}:${port} ${description}`);
});