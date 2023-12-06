const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

// Authencication route signup - login - logout
router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protect all routes from this point on
router.use(authController.protect);

// pwd reset route - forget pwd  - reset pwd

// route for updating pwd

// admin only from this poit on
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
