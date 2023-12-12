const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

// Authencication route for login - logout
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// pwd reset route for forget pwd  - reset pwd
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes from this point on
router.use(authController.protect);
// route for updating pwd
router.patch('/updateMyPassword', authController.updatePassword);

// route for updateMe
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);
router.delete('/deleteMe', userController.deleteMe);

// admin only from this poit on
router.use(authController.restrictTo('systemAdmin'));

router.post('/signup', authController.signUp);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser);

router.route('/delete/:id').patch(userController.softDelete);

module.exports = router;
