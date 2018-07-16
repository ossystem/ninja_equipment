'use strict';

const Sequelize = require('sequelize');
const errors = require('../utils/errors.js');

const Helpers = {
  asyncHandler: fn => (params, callback, sid, req, res, next, ...args) =>
    fn(params, callback, sid, req, res, next, ...args).catch(next),

  asyncMiddleware: fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  },
  searchableAttributes: (model) => {
    const attributes = model.attributes || [];
    const keys = Object.keys(attributes);
    const result = [];
    let key;

    for (let i = 0, ilen = keys.length; i < ilen; ++i) {
      key = keys[i];
      if (attributes[key].searchable) {
        result.push(key);
      }
    }

    return result;
  },

  // [TODO] advanced search:
  // regex: /(?:(\w+):(?:"([^"]+)"|([^"\s]*)))|(?:"([^"]+)"|([^\s]+))/g

  sequelizeConcat(attributes, sequelize) {
    return sequelize.literal(attributes.map(value => sequelize.escape(sequelize.col(value))).join(' || " " || '));
  },

  sequelizify(params, model, defaults, lang) {
    const query = defaults || {};
    const me = this;

    if (params.id) {
      query.where = query.where || {};
      query.where.id = params.id;
    }

    if (params.filter) {
      query.where = query.where || {};
      params.filter.forEach((filter) => {
        let prop = filter.property;
        const { value } = filter;
        let cond = null;

        if (prop === '#search') {
          // Special case for the "#search" property
          prop = '$or';
          cond = me.searchableAttributes(model).map((attr) => {
            const field = model.attributes[attr];

            if (field && field.type && lang && field.type instanceof Sequelize.JSON) {
              return ({
                [attr]: {
                  $like: {
                    [lang]: `%${value}%`,
                  },
                },
              });
            }

            return ({ [attr]: { $like: `%${value}%` } });
          });
        } else {
          switch (filter.operator) {
            case '<': cond = { $lt: value }; break;
            case '<=': cond = { $lte: value }; break;
            case '>=': cond = { $gte: value }; break;
            case '>': cond = { $gt: value }; break;
            case '!=': cond = { $ne: value }; break;
            case 'in': cond = { $in: value }; break;
            case 'notin': cond = { $notIn: value }; break;
            case 'like': cond = { $like: value }; break;
              // case '/=' // NOT SUPPORTED!
              // case '=':
            default:
              cond = value;
              break;
          }

          if (!(prop in model.attributes)) {
            // let's try in another table:
            // https://github.com/sequelize/sequelize/issues/3095#issuecomment-149277205
            prop = `$${prop}$`;
          }
        }

        query.where[prop] = cond;
      });
    }

    if (params.sort) {
      query.order = query.order || [];
      params.sort.forEach((sorter) => {
        const prop = sorter.property;
        query.order.push([
          prop in model.attributes ? prop : model.sequelize.col(prop),
          sorter.direction,
        ]);
      });
    }

    if (params.group) {
      query.group = params.group.property;
    }

    if (params.start) {
      query.offset = params.start;
    }

    if (params.limit) {
      query.limit = params.limit;
    }

    return query;
  },

  fetchFilters(params, model, defaults) {
    const field = params.field;
    if (!field) {
      throw errors.generate('Missing field argument');
    }

    const sequelize = model.sequelize;
    const column = field in model.attributes ? field : sequelize.col(field);
    const label = this.sequelizeConcat([].concat(params.label || field), sequelize);
    const query = this.sequelizify(params, model, Object.assign(defaults || {}, {
      attributes: [[label, 'label'], [column, 'value']],
      group: [column],
      distinct: true,
      plain: false,
      include: [{
        all: true,
        nested: true,
        attributes: [],
      }],
    }));

    return model.aggregate(`${model.name}.id`, 'count', query);
  },

  idsFromParams(params) {
    const type = typeof (params);
    if (type === 'string') {
      return [params];
    }

    if (type === 'object') {
      if (params.id) {
        return [params.id];
      } else if (Array.isArray(params)) {
        return params.map(param => param.id);
      }
    }

    return [];
  },

  extractFields(inputs, names) {
    const fields = {};
    names.forEach((name) => {
      if (inputs.hasOwnProperty(name)) {
        const value = inputs[name];
        if (value !== undefined) {
          fields[name] = value;
        }
      }
    });
    return fields;
  },

  excludeFields(inputs, names) {
    names.forEach((name) => {
      if (inputs.hasOwnProperty(name)) {
        inputs[name] = undefined;
      }
    });
    return inputs;
  },

  jsonGetter(fieldName) {
    const currentValue = this.getDataValue(fieldName);
    if (typeof currentValue === 'string') {
      this.dataValues[fieldName] = JSON.parse(currentValue);
    }
    return this.dataValues[fieldName];
  },
};

module.exports = Helpers;
