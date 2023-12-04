const express = require('express');
const morgan = require('morgan');
const brandRouter = require('./routes/brandRoutes');
const companyRouter = require('./routes/companyRoutes');
const userRouter = require('./routes/userRoutes');
const artworkRouter = require('./routes/artworkRoutes');
const jobRouter = require('./routes/jobRoutes');
const colorRouter = require('./routes/colorRoutes');
const globalErrorHandeler = require('./controllers/errorController');

const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
console.log(`App is running in ${process.env.NODE_ENV}...`);

app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/companies', companyRouter);
app.use('/api/v1/brands', brandRouter);
app.use('/api/v1/artworks', artworkRouter);
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/colors', colorRouter);

app.use(globalErrorHandeler);

module.exports = app;
