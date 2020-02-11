const express = require('express');

const router = express.Router();

const feedbackRoute = require('./feedback');
const SpeakersRoute = require('./speakers');

module.exports = params => {
  const { speakersService } = params;
  router.get('/', async (request, response, next) => {
    try {
      const artwork = await speakersService.getAllArtwork();
      const topSpeakers = await speakersService.getList();
      // console.log(topSpeakers);

      return response.render('layout', {
        pageTitle: 'Welcome',
        template: 'index',
        topSpeakers,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.use('/speakers', SpeakersRoute(params));
  router.use('/feedback', feedbackRoute(params));

  return router;
};
