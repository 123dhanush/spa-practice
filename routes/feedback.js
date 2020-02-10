const express = require('express');

const router = express.Router();

module.exports = params => {
  const { feedbackService } = params;

  router.get('/', async (request, response) => {
    const feedback = await feedbackService.getList();
    return response.json(feedback);
  });

  router.get('/:shortname', (request, response) => {
    return response.send(`Detailed page of ${request.params.shortname}`);
  });
  return router;
};
