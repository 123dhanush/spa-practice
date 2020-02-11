const express = require('express');
var session = require('express-session');
const router = express.Router();
var ss;
const { check, validationResult } = require('express-validator');
router.use(
  session({
    secret: 'fffe',
    feedback: '',
    resave: false,
    saveUninitialized: true,
  })
);
module.exports = params => {
  const { feedbackService } = params;

  router.get('/', async (request, response, next) => {
    try {
      const feedback = await feedbackService.getList();
      console.log(feedback);
      const errors = request.session.feedback ? request.session.feedback.errors : false;

      const successmessage = request.session.feedback ? request.session.feedback.message : false;
      request.session.feedback = {};
      return response.render('layout', {
        pageTitle: 'Feedback',
        template: 'feedback',
        feedback,
        errors,
        successmessage,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.get('/:shortname', (request, response, next) => {
    try {
      return response.send(`Detailed page of ${request.params.shortname}`);
    } catch (err) {
      return next(err);
    }
  });

  router.post(
    '/',
    [
      check('name')
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage('A name s required'),
      check('email')
        .trim()
        .isLength({ min: 10 })
        .escape()
        .withMessage('An email is required'),
      check('title')
        .trim()
        .isLength({ min: 5 })
        .escape()
        .withMessage('A title is required'),
    ],
    async (request, response) => {
      ss = request.session;

      console.log(request.body);
      const errors = validationResult(request);
      console.log(errors);
      if (!errors.isEmpty()) {
        request.session.feedback = {
          errors: errors.array(),
        };
        return response.redirect('/feedback');
      }
      const { name, email, title, message } = request.body;
      await feedbackService.addEntry(name, email, title, message);
      request.session.feedback = {
        message: 'Thank you for your feedback',
      };
      return response.redirect('/feedback');
    }
  );
  return router;
};
