const models = require('../models');
const express = require('express');
const helpers = require('../utils/helpers.js');

const router = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Returns a profile data.
 *     description: register
 *     produces:
 *      - application/json
 *     requestBody:
  *       content:
 *         application/json:
 *           examples:
 *             email: "test@fff.com"
 *             password: 1
 *     responses:
 *       200:
 *         description: register were succesfull
 *         examples:
 *           - {"id": "some id", "email": "test@fff.com"}
 */

router.post('/', helpers.asyncMiddleware(async (req, res, next) => {
  const params = req.body;
  const userSecureData = models.user.generateHashAndSalt(params.password);

  params.password_hash = userSecureData.password_hash;
  params.password_salt = userSecureData.password_salt;
  
  const user = await models.user.create(params);
  const group = await models.group.findOne({
    where: { systemName: "developers" },
  });

  await user.setGroups(group);

  res.json(user);
}));

module.exports = router;
