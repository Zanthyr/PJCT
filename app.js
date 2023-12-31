const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const brandRouter = require('./routes/brandRoutes');
const companyRouter = require('./routes/companyRoutes');
const userRouter = require('./routes/userRoutes');
const artworkRouter = require('./routes/artworkRoutes');
const jobRouter = require('./routes/jobRoutes');
const colorRouter = require('./routes/colorRoutes');
const viewRouter = require('./routes/viewRoutes');
const globalErrorHandeler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const cors = require('cors');

const app = express();

// load view engine to render pages
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());

// log current eviroment to console - enable morgan when in dev
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
console.log(`App is running in ${process.env.NODE_ENV}...`);

// middelware method to serve static files or folders
app.use(express.static(path.join(__dirname, 'public')));

// add data from body and cookies to request
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use('/', viewRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/companies', companyRouter);
app.use('/api/v1/brands', brandRouter);
app.use('/api/v1/artworks', artworkRouter);
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/colors', colorRouter);

// glob error on non defined routes
app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandeler);

module.exports = app;
