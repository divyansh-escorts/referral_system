// Import statements remain the same

// Initialize Express app
const express = require("express");
const app = express();

// Import other modules
require("./middlewares/dbConnection");
const fetchSecrets = require("./middlewares/fetchSecrets");
// Serve static files before other middleware
const serveIndex = require('serve-index');
app.use('/ftp', express.static('public/ftp'), serveIndex('public/ftp', { icons: true }));

// Body parsers and other middleware
const bodyParser = require('body-parser');
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '2gb' }));
app.use(bodyParser.json({ limit: '150mb' }));
app.use(bodyParser.urlencoded({
  limit: '150mb',
  extended: true
}));

// File upload middleware
const fileUpload = require('express-fileupload');
app.use(fileUpload());

// Rate limiting middleware (optional)
// const rateLimitMiddleware = require("./middlewares/rateLimiter");
// app.use(rateLimitMiddleware);

// Routes
app.post('/upload', function (req, res) {
  console.log('POST /upload request');
  if (!req.files || Object.keys(req.files).length === 0) return res.status(400).send('No files were uploaded.');

  let sampleFile = req.files.file;
  let uploadPath = __dirname + '/public/ftp/' + sampleFile.name;

  sampleFile.mv(uploadPath, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    res.send('File uploaded!');
  });
});

// Use other routes
app.use('/', require('./routes'));

// Error-handling middleware for other errors (optional)
app.use((err, req, res, next) => {
  console.error(err); // You can customize this
  res.status(500).send('Internal Server Error');
});

app.listen(3304, async () => {
  let secrets = await fetchSecrets();
  console.log("App listening at port " + secrets.port);
});
// var options = {
//   key: fs.readFileSync('privatekey.pem'),
//   cert: fs.readFileSync('certificate.pem')
// };
// https.createServer(options, app).listen(3302)
