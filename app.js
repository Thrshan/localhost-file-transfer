const express = require('express')
const multer = require('multer')
const socketio = require('socket.io');
const http = require('http');

const app = express()
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('public'));

app.set("view engine", "ejs");

const filesArray = []  // Stores all the uploaded the details

// Configuring uploaded files storage part
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
const upload = multer({ storage: storage })

io.on('connection', socket => {
  console.log(socket.id);
  console.log('New connection');

  // This is the data transfered from server from client
  // 
  socket.emit('message', 'Welcome');

  socket.on('loaded', msg => {
    console.log(msg);
    profilePic = generateProfilePic();
    // console.log(profilePic);
    io.to(socket.id).emit('startup', {rawImageData : profilePic});
  });

  socket.broadcast.emit('message', ' User has joined the chat');


});

// When upload file request comes
// Receives single file and store it in configured path
app.post('/sendFile', upload.single('fieldname'), function (req, res, next) {
  let ts = new Date().getTime();
  filesArray.push({
    "fileName": req.file.originalname,
    "id": ts,
    "get": "http://192.168.43.148:3000/get?file=" + ts
  });
  res.redirect('/');
});

// Show all the uploaded files details - for dev
app.get("/files", function (req, res) {
  res.send(filesArray);
});

// When a file is requested foe download
app.get("/get", function (req, res) {
  fileId = req.query.file;
  let found = false;
  for (i = 0; i < filesArray.length; i++) {
    if (fileId == filesArray[i].id) {
      found = true;
      let downFile = async function () {
        res.download(__dirname + '/uploads/' + filesArray[i].fileName);
      }
      downFile();
      break;
    }
  }
  if (!found) {
    res.sendFile(__dirname + '/public/notFound.html')
  }
});

// Home page
app.get("/", function (req, res) {
  console.log(req.ip);
  console.log(req.connection.remoteAddress);
  res.render('index', { username : "Kevin"
  });
});

// Initiate a server
server.listen(port, function () {
  console.log("Server started at port " + port);
});

function generateProfilePic(){
  const height = 7;
  const width = 7;
  const backColor = {R:255, G:0, B:255, O:255};
  const splashColor = {R:255, G:255, B:0, O:255};

  // let points = [[0,0],[2,5], [1,3], [4,4], [5,5], [3,2]];
  const points = [];
  for (let i = 0 ; i < 10 ; i++){
    points.push([Math.floor(Math.random() * 7), Math.floor(Math.random() * 7)]);
  }

  let mirrorPoints = [];
  const middle = Math.floor(width / 2)
  for ( point of points ){
    let newPointX = 0;
    newPointX = (2 * middle) - point[1];
    mirrorPoints.push([point[0], newPointX]);
  }
  const allPoints = points.concat(mirrorPoints);

  const imageData = {R: [], G: [], B: [], O: []};

  for (let i = 0 ; i < height ; i++){
    imageData.R.push([]);
    imageData.G.push([]);
    imageData.B.push([]);
    imageData.O.push([]);
  }

  for (let i = 0 ; i < 7 ; i++){
      for (let j = 0 ; j < 7 ; j++){
        if (pointHas(allPoints, [i,j])){
          imageData.G[i].push(splashColor.G);
          imageData.B[i].push(splashColor.B);
          imageData.R[i].push(splashColor.R);
          imageData.O[i].push(splashColor.O);
        } else {
          imageData.R[i].push(backColor.R);
          imageData.G[i].push(backColor.G);
          imageData.B[i].push(backColor.B);
          imageData.O[i].push(backColor.O);
        }
      }
  }
  // console.log(rawImgData);
  return {
    height,
    width,
    imageData
  }
}

function pointHas(pointsArray, reqPoint){
  for ( point of pointsArray ){
    if (JSON.stringify(point) == JSON.stringify(reqPoint)){
      return true;
    }
  }
  return false;
}
