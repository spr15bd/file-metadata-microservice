'use strict';

var express = require('express');
var cors = require('cors');
var path = require('path');
// require and use "multer"...
var multer  = require('multer');
var app = express();
var port = process.env.PORT || 3000;

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

// Set storage engine
const multerConf = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, callback) {
    callback(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});

// Initialise upload
const upload = multer({
  storage: multerConf,
  limits: {fileSize: 1000000}  // limit uploaded files to 1mb
}).single('upfile');  

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', function(req, res){
  
  upload(req, res, function(error) {
    if (error) {
      if (error.code=='LIMIT_FILE_SIZE') {
        res.send("The file size is too big (max size is 1mb)");
      } else {
        res.send(error);
      }
      console.log(error);
    } else {
      if (!req.file){
        res.send("No input (filename) found, please go back and submit a file to upload.");
      } else {
        console.log(req.file);
        res.json({filename: req.file.filename, size: req.file.size + " " + "bytes"});
      }
    }
  });
  
});

app.listen(port, function () {
  console.log(`Node.js listening on port ${port}`);
});