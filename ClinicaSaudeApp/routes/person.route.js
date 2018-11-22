const express = require('express');
const router = express.Router();

// Importar os controladores
const person_controller = require('../controllers/person.controller');

router.get('/test', person_controller.test);

router.post('/create', person_controller.person_create);

module.exports = router;