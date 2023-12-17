const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const imageUploadController = require('./../controllers/imageUploadController');

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
  imageUploadController.uploadImageFile,
  imageUploadController.resizeUserPhoto,
  userController.updateMe,
);
router.delete('/deleteMe', userController.deleteMe);

// admin only from this poit on
router.use(authController.restrictTo('root', 'admin'));

router.post('/signup', authController.signUp);

router
  .route('/')
  .get(userController.getAllUsersOfCompany)
  .post(userController.createUser); // not available use signup

router
  .route('/company/:id')
  .get(userController.getUserOfComapny)
  .patch(userController.updateUserOfCompany);

router
  .route('/deleteOfCompany/:id')
  .patch(userController.softDeleteUserOfCompany);

router.use(authController.restrictTo('root'));

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser); // not available use signup

router.route('/delete/:id').patch(userController.softDeleteUser);

module.exports = router;
