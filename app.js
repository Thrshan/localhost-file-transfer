const express = require('express')
const multer  = require('multer')

var app = express()
const port = 3000;

app.use(express.static('public'));
 
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    //   cb(null, 'D:/Project/file-share/uploads')
      cb(null, __dirname + '/uploads')
    },
    filename: function (req, file, cb) {
    //   cb(null, file.fieldname + '-' + Date.now())
      cb(null, file.originalname)
    }
  });
const upload = multer({ storage: storage })
// const upload = multer({ dest: 'uploads/' })

app.post('/sendFile', upload.single('fieldname'), function (req, res, next) {
    console.log(req.file);
    res.redirect('/');
});
 
app.get("/", function (req, res){
    res.sendFile('index.html');
})

app.listen(port, function (){
    console.log("Server started at port " + port);
});