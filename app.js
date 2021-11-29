const express = require('express')
const multer = require('multer')
const socketio = require('socket.io');
const http = require('http');
const dp = require('./modules/generateDP');
const ip = require('./modules/ip')

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
    profilePic = dp.generateProfilePic();
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
  console.log(ip.getIp());
  res.render('index', { username : "Kevin"
  });
});

// Initiate a server
server.listen(port, function () {
  console.log("Server started at port " + port);
});
