const express = require('express');
const { register, login } = require('../controllers/auth.Controller');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
module.exports = router;git 