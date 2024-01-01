const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const multiParser = require('./../utils/multiParser');

const router = express.Router();

// Authencication route for login - logout
router.post('/login', authController.login); // ok
router.post('/logout', authController.logout); // ok

// pwd reset route for forget pwd  - reset pwd
router.post('/forgotPassword', authController.forgotPassword); // ok
router.patch('/resetPassword/:token', authController.resetPassword); // ok

// Protect all routes from this point on
router.use(authController.protect);
// route for updating pwd
router.patch('/updateMyPassword', authController.updatePassword); // ok

// route for updateMe
router.get('/me', userController.getMe, userController.getUser); // ok
router.patch(
  '/updateMe', // ok
  multiParser.uploadImageFile,
  multiParser.resizeUserPhoto,
  userController.updateMe,
);
router.delete('/deleteMe', userController.deleteMe); // Partial, not allowing to actualy delete

// admin only from this poit on
router.use(authController.restrictTo('root', 'admin'));

// router.post('/signup', authController.signUp); // users must be send an invitation by there admin
router.post('/invite', multiParser.uploadFields, authController.invite); // TODO

router
  .route('/')
  .get(userController.getAllUsersOfCompany) // only api
  .post(userController.createUser); // not available use signup

router
  .route('/company/:id')
  .get(userController.getUserOfComapny) // only api
  .patch(userController.updateUserOfCompany); // only api

router
  .route('/deleteOfCompany/:id') // only api
  .patch(userController.softDeleteUserOfCompany); // Partial, not allowing to actualy delete

router.route('/delete/:id').patch(userController.softDeleteUser); // only api

router.use(authController.restrictTo('root'));

router
  .route('/api/:id')
  .get(userController.getUser) // only api
  .patch(userController.updateUser) // only api
  .delete(userController.deleteUser); // only api

router.route('/api/').get(userController.getAllUsers); // only api

module.exports = router;
