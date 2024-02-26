const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");

const Config = require("./config");
const config = new Config("./config.json");
let schema = config.read();

const name = schema.server.name;
const port = schema.server.port;
const description = schema.server.description;

let path = schema.server.contentDirectory;
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

if (schema.server.cors.enabled) {
  const corsOptions = {
    origin: schema.server.cors.origin,
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

app.get('/image/:artist/:filename', (req, res) => {  
  const file = content + req.path.replace("/image/", "");
  fs.exists(file, (exists) => {
    if (exists) {
      console.log("image", file)
      res.sendFile(file);
    } else {
      console.log("image", "Error: 404", file);
      res.status(404).send('Error: 404');
      res.end();    
    }
  });
});

app.get('/image/:artist/:album/:track/:filename', (req, res) => {  
  const file = content + req.path.replace("/image/", "");
  fs.exists(file, (exists) => {
    if (exists) {
      console.log("image", file)
      res.sendFile(file);
    } else {
      console.log("image", "Error: 404", file);
      res.status(404).send('Error: 404');
      res.end();
    }
  });
});

app.get('/stream/:artist/:album/:track/:filename', (req, res) => {
  const file = content + req.path.replace("/stream/", "");
  fs.exists(file, (exists) => {
    if (exists) {
      console.log("stream", file);
      const rstream = fs.createReadStream(file);
      rstream.pipe(res);
    } else {
      console.log("stream", "Error: 404", file);
      res.status(404).send('Error: 404');
      res.end();
    }
  });
});

app.get('/download/:artist/:album/:track/:filename', (req, res) => {
  const file = content + req.path.replace("/download/", "");
  fs.exists(file, (exists) => {
    if (exists) {
        console.log("download", file);
        res.download(file);
    } else {
      console.log("download", "Error: 404", file);
      res.status(404).send('Error: 404');
      res.end();      
    }
  });
});

app.get('/artists/', (req, res) => {
  let schema = config.read();  
  console.log("artists", schema.artists);
  res.json(artists);
});

app.get('/featured/', (req, res) => {
  let schema = config.read();  
  const featured = schema.artists.filter(artist => artist.featured);
  console.log("featured", featured);
  res.json(featured);
});

app.get('/artist/:artistId', (req, res) => {
  const artistId = req.path.replace("/artist/", "");
  console.log("artistId", artistId);
  let schema = config.read();
  const artists = schema.artists.filter(artist => artist.id == artistId);  
  if (artists.length > 0) {
    const artist = artists[0];
    console.log("artist", artist);
    res.json(artist);
  } else {
    console.log("artist", "Error: 404", artistId);
    res.status(404).send('Error: 404');
    res.end();      
  }
});

app.get('/albums/:artistId', (req, res) => {
  const artistId = req.path.replace("/albums/", "");
  console.log("artistId", artistId);
  let schema = config.read();
  const artists = schema.artists.filter(artist => artist.id == artistId);    
  if (artists.length > 0) {
    const artist = artists[0];
    const albums = artist.albums;
    console.log("albums", albums);
    res.json(artist);
  } else {
    console.log("albums", "Error: 404", artistId);
    res.status(404).send('Error: 404');
    res.end();      
  }
});

app.get('/tracks/:artistId', (req, res) => {
  const artistId = req.path.replace("/tracks/", "");
  console.log("artistId", artistId);
  let schema = config.read();
  const artists = schema.artists.filter(artist => artist.id == artistId);
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
  } else {
    console.log("tracks", "Error: 404", artistId);
    res.status(404).send('Error: 404');
    res.end();      
  }
});

const server = app.listen(port, () => {
  const now = new Date();
  console.log(`${name}:${port} ${description} started at ${now}.`);
});

process.on('SIGINT', function() {
  server.close();
  const now = new Date();
  console.log(`${name}:${port} ${description} stopped at ${now}.`);
  process.exit(0);
});