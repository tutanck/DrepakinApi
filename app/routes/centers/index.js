const { Router } = require('express');
const { query, param, validationResult } = require('express-validator');
const { validateRequest } = require('../../utils/validation');
const {
  list,
  details,
  adminDetails,
  near,
  create,
  update,
} = require('../../services/centers');
const { ecRules } = require('./validators');
const {
  bailedOutAuthentication,
  ensureAuthenticated,
  ensureIsAdmin,
} = require('../../middlewares/auth-middleware');

const router = Router();

router.get(
  '/list',

  [
    bailedOutAuthentication,
    query('page')
      .optional()
      .isInt({ min: 1 }),
    query('perPage')
      .optional()
      .isInt({ min: 1 }),
  ],

  async (req, res) => {
    validateRequest(validationResult(req));

    const { page, perPage } = req.query;
    const { currentUser } = res.locals;
    const userId = currentUser ? currentUser._id : undefined;

    const result = await list(page, perPage, userId);

    return res.status(200).json(result);
  },
);

router.get(
  '/details/by/:id',

  [bailedOutAuthentication, param('id').isMongoId()],

  async (req, res) => {
    validateRequest(validationResult(req));

    const { id } = req.params;
    const { currentUser } = res.locals;
    const userId = currentUser ? currentUser._id : undefined;

    const result = await details(id, userId);

    return res.status(200).json(result);
  },
);

router.get(
  '/admin/details/by/:id',

  [ensureAuthenticated, ensureIsAdmin, param('id').isMongoId()],

  async (req, res) => {
    validateRequest(validationResult(req));

    const { id } = req.params;

    const result = await adminDetails(id);

    return res.status(200).json(result);
  },
);

router.post(
  '/admin/new',

  [ensureAuthenticated, ensureIsAdmin, ...ecRules],

  async (req, res) => {
    validateRequest(validationResult(req), { onlyFirstError: true });

    const center = req.body;
    const { currentUser } = res.locals;
    const userId = currentUser._id;

    const result = await create(userId, center);

    return res.status(201).json(result);
  },
);

router.put(
  '/admin/update/:id',

  [ensureAuthenticated, ensureIsAdmin, param('id').isMongoId(), ...ecRules],

  async (req, res) => {
    validateRequest(validationResult(req));

    const centerId = req.params.id;
    const center = req.body;
    const { currentUser } = res.locals;
    const userId = currentUser._id;

    const result = await update(centerId, userId, center);

    return res.status(201).json(result);
  },
);

router.get(
  '/near/:lng/:lat',

  [
    bailedOutAuthentication,
    param('lng').isFloat({ min: -180, max: 180 }),
    param('lat').isFloat({ min: -90, max: 90 }),
    query('page')
      .optional()
      .isInt({ min: 1 }),
    query('perPage')
      .optional()
      .isInt({ min: 1 }),
  ],

  async (req, res) => {
    validateRequest(validationResult(req));

    const { lng, lat } = req.params;
    const { page, perPage } = req.query;
    const { currentUser } = res.locals;
    const userId = currentUser ? currentUser._id : undefined;

    const result = await near(lng, lat, page, perPage, userId);

    return res.status(200).json(result);
  },
);

module.exports = router;
