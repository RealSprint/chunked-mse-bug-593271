const express = require('express');
const fs = require('fs');
const app = express();

app.use('/', express.static('static'));
app.get('/list', function (req, res) {
  fs.readdir('static/segments', (err, fileNames) => {
    res.json(fileNames.filter((val) => {
      return !val.startsWith('.');
    }));
  });
});
app.listen(3000, function () {
  console.log('Repro server listening on port 3000!');
});
