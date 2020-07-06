const express = require('express');
const path = require('path');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

const config = require('config');
const db = require('./db');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(fileUpload());
app.use(routes);

db.connect()
  .then(() => {
    app.listen(config.get('http.port'), config.get('http.hostname'), () => {
      console.log(`App listen http://${config.get('http.hostname')}:${config.get('http.port')}`);
    });
  })
  .catch(err => {
    console.error(err);
  });

const gracefulExit = () => {
  db.disconnect();
  process.exit(0);
};

process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);