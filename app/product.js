const models = require('../models');
const express = require('express');
const helpers = require('../utils/helpers.js');
const session = require('../utils/session.js');         
const router = express.Router();

/**
 * @swagger
 * /product:
 *   post:
 *     summary: list Products with pagination, simple filtering by category and search by products title 
 *     description: product
 *     produces:
 *      - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           examples:
 *             page: 1
 *             start: 0
 *             limit: 25
 *             group: 
 *             property: null
 *             direction: ASC
 *             sort: 
 *             - 
 *               property: name
 *               direction: ASC
 *             filter: 
 *             - 
 *               property: category_id
 *               value: "38905470-accb-4905-8091-8418f6ea8ed9"
 *             - 
 *               property: "#search"
 *               value: fff
 *     responses:
 *       200:
 *         description: succesfull
 *         examples:
 *           - { "token": "some_jwt_token", "expires": "2018-07-17T07:17:40.554Z" }
 */

router.post('/', helpers.asyncMiddleware(async (req, res, next) => {
  const data = await models.product.findAndCount(helpers.sequelizify(req.body, models.product));
  res.json(data);
}));


/**
 * @swagger
 * /product/{productId}:
 *   get:
 *     summary: show details of a certain Product
 *     description: show details of a certain Product (name, image URL, price, description and category)
 *     parameters:
 *       - in: path
 *         name: productId
 *         type: integer
 *         required: true
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: succesfull
 *         examples:
 *           - {"id":"7a663591-9bff-44ab-a572-688610f0d568","product_id":"0176f6b1-9ec1-436f-bc0e-53a1fe5b9039","user_id":"0464b7b0-2afb-4ef5-b44f-9d509d9a90d4"}
 */
router.get('/:id', helpers.asyncMiddleware(async (req, res, next) => {
  const data = await models.product.findOne({
    where: { id: req.params.id },
    include: [{
      model: models.category,
      as: 'category',
      attributes: ['name'],
    }]
  });

  res.json(data);
}));

module.exports = router;
