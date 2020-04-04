const { body } = require('express-validator');

const ecRules = [
  body('country')
    .isString()
    .isLength({ min: 1 }),

  body('region')
    .isString()
    .isLength({ min: 1 }),

  body('city')
    .isString()
    .isLength({ min: 1 }),

  body('hospital')
    .isString()
    .isLength({ min: 1 }),

  body('name')
    .isString()
    .isLength({ min: 1 }),

  body('name_en')
    .isString()
    .isLength({ min: 1 }),

  body('address')
    .isString()
    .isLength({ min: 1 }),

  body('consultation_managers').isArray(),

  body('phones').isArray(),

  body('for_children')
    .optional()
    .isBoolean(),

  body('for_adults')
    .optional()
    .isBoolean(),

  body('genetic_advice')
    .optional()
    .isBoolean(),

  body('specialized_consultation')
    .optional()
    .isBoolean(),

  body('officially_designated_center')
    .optional()
    .isBoolean(),

  body('ern_member')
    .optional()
    .isBoolean(),

  body('website')
    .optional({ nullable: true })
    .isURL(),

  body('location.type').equals('Point'),

  body('location.coordinates').isArray({ min: 2, max: 2 }),

  body('location.coordinates[0]').isFloat({ min: -180, max: 180 }), // lng

  body('location.coordinates[1]').isFloat({ min: -90, max: 90 }), // lat

  body('meta.place.formattedAddress')
    .isString()
    .isLength({ min: 1 }),

  body('meta.place.latitude').isFloat({ min: -90, max: 90 }),

  body('meta.place.longitude').isFloat({ min: -180, max: 180 }),

  body('meta.place.extra.googlePlaceId')
    .isString()
    .isLength({ min: 1 }),

  body('meta.place.extra.confidence').isFloat({ min: 0, max: 1 }),

  body('meta.place.extra.types')
    .optional()
    .isArray(), // TODO of string

  body('meta.place.streetNumber')
    .optional({ nullable: true })
    .isString()
    .isLength({ min: 1 }),

  body('meta.place.streetName')
    .optional({ nullable: true })
    .isString()
    .isLength({ min: 1 }),

  body('meta.place.city')
    .isString()
    .isLength({ min: 1 }),

  body('meta.place.country')
    .isString()
    .isLength({ min: 1 }),

  body('meta.place.countryCode')
    .isString()
    .isLength({ min: 1 }),

  body('meta.place.zipcode')
    .optional({ nullable: true })
    .isString()
    .isLength({ min: 1 }),

  body('meta.place.provider')
    .isString()
    .isLength({ min: 1 }),
];

module.exports = { ecRules };
