const express = require('express');

const router = express.Router();

module.exports = params => {
  const { speakersService } = params;

  router.get('/', async (request, response) => {
    const speakers = await speakersService.getList();
    console.log(speakers);

    response.render('layout', { pageTitle: 'Speakers', template: 'speakers', speakers });
  });

  // router.get('/:shortname', (request, response) => {
  //   return response.send('feedback form posted');
  // });
  return router;
};
