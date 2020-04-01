const { Router } = require('express');
const { query, param, validationResult } = require('express-validator');
const { validateRequest } = require('../../utils/validation');
const {
  list,
  updateWithGoogleUser,
  detailsByGoogleId,
  revokeAdminRights,
  grantAdminRights,
} = require('../../services/users');
const {
  ensureGoogleUserAvailable,
  ensureAuthenticated,
  ensureIsAdmin,
} = require('../../middlewares/auth-middleware');

const router = Router();

router.post(
  '/login',

  [ensureGoogleUserAvailable],

  async (req, res) => {
    const { googleUser } = res.locals;

    await updateWithGoogleUser(googleUser);

    const result = await detailsByGoogleId(googleUser.google_id);

    return res.status(200).json(result);
  },
);

router.get(
  '/list',

  [
    ensureAuthenticated,
    ensureIsAdmin,
    query('page')
      .optional()
      .isInt({ min: 1 }),
    query('perPage')
      .optional()
      .isInt({ min: 1 }),
    query('search').optional(),
  ],

  async (req, res) => {
    validateRequest(validationResult(req));

    let { page, perPage, search } = req.query;

    const result = await list(page, perPage, search);

    return res.status(200).json(result);
  },
);

router.post(
  '/:id/is_admin',

  [ensureAuthenticated, ensureIsAdmin, param('id').isString()],

  async (req, res) => {
    validateRequest(validationResult(req));

    const googleId = req.params.id;

    const updatedUser = await grantAdminRights(googleId);

    return res.status(200).json(updatedUser);
  },
);

router.delete(
  '/:id/is_admin',

  [ensureAuthenticated, ensureIsAdmin, param('id').isString()],

  async (req, res) => {
    validateRequest(validationResult(req));

    const googleId = req.params.id;

    const updatedUser = await revokeAdminRights(googleId);

    return res.status(200).json(updatedUser);
  },
);

module.exports = router;
