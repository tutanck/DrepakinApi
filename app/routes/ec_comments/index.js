const { Router } = require('express');
const { query, param, body, validationResult } = require('express-validator');
const { validateRequest } = require('../../utils/validation');
const { listByCenter, addByCenter } = require('../../services/ec_comments');
const { ensureAuthenticated } = require('../../middlewares/auth-middleware');

const router = Router();

router.get(
  '/list/by/center/:centerId',

  [
    param('centerId').isMongoId(),
    query('page')
      .optional()
      .isInt({ min: 1 }),
    query('perPage')
      .optional()
      .isInt({ min: 1 }),
  ],

  async (req, res) => {
    validateRequest(validationResult(req));

    const { centerId } = req.params;
    const { page, perPage } = req.query;

    const result = await listByCenter(centerId, page, perPage);

    return res.status(200).json(result);
  },
);

router.post(
  '/add/by/:centerId',

  [
    ensureAuthenticated,
    param('centerId').isMongoId(),
    body('text')
      .isString()
      .isLength({ min: 1 }),
  ],

  async (req, res) => {
    validateRequest(validationResult(req));

    const { centerId } = req.params;
    const { text } = req.body;
    const { currentUser } = res.locals;
    const userId = currentUser._id;

    const result = await addByCenter(centerId, userId, text);

    return res.status(200).json(result);
  },
);

module.exports = router;
