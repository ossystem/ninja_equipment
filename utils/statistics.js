const config = require('./config.js');
const mail = require('./mail.js');
const models = require('../models');
const pdfGenerator = require('html-pdf');
const fs = require('fs');

function generatePdf(template){
  return new Promise(function(resolve,reject){
    pdfGenerator.create(template, { format: 'Letter' }).toFile('./report.pdf', function(err,data) {
      if(err !== null) return reject(err);
      resolve(data);
    });
});
}

const statistics = async (recipients, subject, text) => {
    try {
        const countSoldProducts = await models.order.findOne({
          attributes: [[models.sequelize.fn('COUNT', 'product_id'), 'countSoldProducts']],
        });
        const bestSellingYesterday = await models.order.findOne({
          group: ['product_id'],
          attributes: ['product_id',[models.sequelize.fn('COUNT', 'product_id'), 'countSoldProduct']],
          where: [
            {
              'created_at': {
                [models.sequelize.Op.gte]: ((+Date.now()) - 86400000)
              }
            }
          ],
          include:[
            {
              model: models.product,
              as: 'product',
              attributes: ['name']
            }
          ],
          order: [[models.sequelize.literal('countSoldProduct'), 'DESC']]
        });
        const countMoney = await models.order.findOne({
          attributes: [[models.sequelize.fn('SUM', models.sequelize.literal('`product`.`price`')), 'total'], ],
          include:[
            {
              model: models.product,
              as: 'product',
              attributes: ['price']
            }
          ]
        });

        let template = fs.readFileSync('./templates/statistics.twig', 'utf8');
        template = template.replace('{{countSoldProducts}}', countSoldProducts.dataValues.countSoldProducts);
        template = template.replace('{{bestSellingYesterday}}', bestSellingYesterday.product.name);
        template = template.replace('{{countMoney}}', countMoney.dataValues.total);
        await generatePdf(template);

        const admins = await models.user.findAll({
          include:[{
            model: models.group,
            as: 'groups',
            attributes: ['systemName'],
            where: { systemName: 'admins' }
          }]
        });
        const emails = admins.map(item=> item.email);
        await mail.send(emails, 'Daily Report', `Report in attachments`, [{filename: 'report.pdf', path:'./report.pdf', contentType: 'application/pdf'}]);
    } catch(err){
      console.log('err statistics:', err);
    }

    return true;
};


module.exports = statistics;