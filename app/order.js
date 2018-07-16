const models = require('../models');
const express = require('express');
const helpers = require('../utils/helpers.js');
const session = require('../utils/session.js');         
const router = express.Router();


/**
 * @swagger
 * /order:
 *   post:
 *     summary: list order
 *     description: order
 *     produces:
 *      - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           examples:
 *             - {}
 *     responses:
 *       200:
 *         description: login were succesfull
 *         examples:
 *           - [{"id":"7a663591-9bff-44ab-a572-688610f0d568","user_id":"0464b7b0-2afb-4ef5-b44f-9d509d9a90d4","product_id":"0176f6b1-9ec1-436f-bc0e-53a1fe5b9039","product":{"name":"Lightweight Taekwondo Uniform","price":"17.95","image":"https://www.karatemart.com/images/products/large/lightweight-taekwondo-uniform-8453700.jpg"},"user":{"email":"test@fff.com"}}]
 */

router.post('/', helpers.asyncMiddleware(async (req, res, next) => {
  const data = await models.order.findAll({
    include: [{
      model: models.product,
      as: 'product',
      attributes: ['name', 'price', 'image']
    },{
      model: models.user,
      as: 'user',
      attributes: ['email']
    }]
  });

  res.json(data);
}));


/**
 * @swagger
 * /order:
 *   put:
 *     summary: create new order
 *     description: create order by product_id
 *     produces:
 *      - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           examples:
 *             - {"product_id":"0176f6b1-9ec1-436f-bc0e-53a1fe5b9039"}
 *     responses:
 *       200:
 *         description: login were succesfull
 *         examples:
 *           - {"id":"7a663591-9bff-44ab-a572-688610f0d568","product_id":"0176f6b1-9ec1-436f-bc0e-53a1fe5b9039","user_id":"0464b7b0-2afb-4ef5-b44f-9d509d9a90d4"}
 */
router.put('/', helpers.asyncMiddleware(async (req, res, next) => {
  const data = await models.order.create({product_id: req.body.product_id, user_id: res.locals.currentUser.id});

  res.json(data);
}));

module.exports = router;
