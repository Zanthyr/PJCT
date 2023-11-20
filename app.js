const express = require('express');
const morgan = require('morgan');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
console.log(process.env.NODE_ENV);

app.use(express.json());

const router = express.Router();

router.get('/', (req, res) => {
  res.send('GET request to the homepage');
});
module.exports = app;
