const models = require('../models');
const express = require('express');
const helpers = require('../utils/helpers.js');
const session = require('../utils/session.js');         
const router = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Returns JWT. 
 *     description: login
 *     produces:
 *      - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           examples:
 *             - {"email":"test@test.com","password":"test"}
 *     responses:
 *       200:
 *         description: login were succesfull
 *         examples:
 *           - { "token": "jwt_token", "expires": "2018-07-17T07:17:40.554Z" }
 */

router.post('/', helpers.asyncMiddleware(async (req, res, next) => {
  const data = await (session.initiate(req.body.email, req.body.password));

  res.json(data);
}));

module.exports = router;
