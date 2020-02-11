const express = require('express');

const app = express();
const path = require('path');
const createError = require('http-errors');
const cookieSession = require('cookie-session');

const bodyparser = require('body-parser');
const FeedbackService = require('./services/FeedbackService');
const SpeakersService = require('./services/SpeakerService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakersService = new SpeakersService('./data/speakers.json');

const port = 3000;
const routes = require('./routes');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.locals.sitename = ' Meetups';
app.use(express.static(path.join(__dirname, './static')));

app.use(bodyparser.urlencoded({ extended: true }));

app.use(async (request, response, next) => {
  try {
    const names = await speakersService.getNames();
    response.locals.speakerNames = names;
    // console.log(response.locals);
    return next();
  } catch (err) {
    return next(err);
  }
});

app.get('/throw', (request, response, next) => {
  setTimeout(() => {
    return next(new Error('some thing went  wrong'));
  }, 500);
});

app.use(
  '/',
  routes({
    feedbackService,
    speakersService,
  })
);

app.set('trust proxy', 1);
app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
  })
);

app.use((request, response, next) => {
  return next(createError(404, 'file not found'));
});

app.use((err, request, response, next) => {
  response.locals.message = err.message;
  const status = err.status || 500;
  response.locals.status = status;
  response.status(status);
  response.render('error');
});
app.listen(port, () => {
  console.log(`server listening at port ${port}`);
});
