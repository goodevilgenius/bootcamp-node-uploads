var path = require('path');
var fs = require('fs');
var mv = require('mv');
var express = require("express");
var exphbs = require("express-handlebars");

// body-parser is for basic forms, but it doesn't handle file uploads.
var bodyParser = require("body-parser");

// multer is our middleware for parsing forms that include file uploads
var multer = require('multer');

// tmp allows us to easily create temporary files and directories. We'll be storing our uploads in a temp directory
var tmp = require('tmp');

var PORT = process.env.PORT || 3000;
var tempDir = tmp.dirSync(); // Create a new temp directory

// Setup multer. Upload files to a temp directory, limit to 10 MB
var upload = multer({
  dest: tempDir.name,
  limits: {
    fileSize: 10*1024*104
  }
});

var app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get('/', function(req, res) {
  res.render('index');
});

// upload.single('image') acts as a middleware function for this route.
// It parses the form data, and looks for a file upload that was given as <input type="file" name="image">.
// The parameter passed to single must match the name specified in the input field, in this case "image".
app.post('/image-upload', upload.single('image'), function(req, res) {
  console.log(req.file);

  // We're storing to a temp directory. Also, multer gives the file a weird name, so we'll restore the original name
  // Using mv instead of fs.rename because fs.rename doesn't work between file systems, so this won't work properly on heroku
  // If using heroku, you would probably do something completely different, since files won't persist on heroku.
  // On heroku, here, you would probably upload the files to a CDN and store the URLs in your database.
  var newFile = path.join(__dirname, 'public/uploads/images', req.file.originalname);
  mv(req.file.path, newFile, function(err) {
    if (err) {
      throw err;
    }
    console.log('Moved ' + req.file.filename + ' to ' + newFile);
    res.redirect('/');
  })
});

app.get('/gallery', function(req, res) {
  fs.readdir(__dirname + '/public/uploads/images', function(err, files) {
    console.log(files);
    // Get all files that aren't hidden (those that don't start with .)
    var nonHiddenFiles = files.filter(function(file) {
      return file[0] != '.';
    });

    res.render('gallery', {files: nonHiddenFiles});
  })
})

app.listen(PORT, function() {
  console.log("Listening on port:%s", PORT);
});
