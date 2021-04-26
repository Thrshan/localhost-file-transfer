const express = require('express')
const multer = require('multer')

const app = express()
const port = 3000;

// app.use(express.static('public'));

const filesArray = []

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
const upload = multer({
  storage: storage
})

app.post('/sendFile', upload.single('fieldname'), function (req, res, next) {
  let ts = new Date().getTime();
  filesArray.push({
    "fileName": req.file.originalname,
    "id": ts,
    "get": "http://192.168.43.148:3000/get?file=" + ts
  });
  res.redirect('/');
});

app.get("/files", function (req, res) {
  res.send(filesArray);
});

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

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, function () {
  console.log("Server started at port " + port);
});