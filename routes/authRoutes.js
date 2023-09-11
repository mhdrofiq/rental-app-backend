const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.route('/')
    .post(authController.login)

router.route('/refresh')
    .get(authController.refresh)

router.route('/adminRegister')
    .post(authController.adminRegister)

router.route('/reviewerRegister')
    .post(authController.reviewerRegister)

router.route('/logout')
    .get(authController.logout)

module.exports = router