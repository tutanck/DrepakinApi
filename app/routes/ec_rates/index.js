const { Router } = require('express');
const { param, body, validationResult } = require('express-validator');
const { validateRequest } = require('../../utils/validation');
const {
  uniqueByCenter_User,
  updateRate,
  averageByCenter,
} = require('../../services/ec_rates');

const { ensureAuthenticated } = require('../../middlewares/auth-middleware');

const router = Router();

router.get(
  '/unique/by/center/:centerId/by/user/:userId',

  [param('centerId').isMongoId(), param('userId').isMongoId()],

  async (req, res) => {
    validateRequest(validationResult(req));

    const { centerId, userId } = req.params;

    const result = await uniqueByCenter_User(centerId, userId);

    return res.status(200).json(result);
  },
);

router.post(
  '/update/by/center/:centerId',

  [
    ensureAuthenticated,
    param('centerId').isMongoId(),
    body('rate').isInt({ min: 1, max: 5 }),
  ],

  async (req, res) => {
    validateRequest(validationResult(req));

    const { centerId } = req.params;
    const { rate } = req.body;
    const { currentUser } = res.locals;
    const userId = currentUser._id;

    const result = await updateRate(centerId, userId, rate);

    return res.status(200).json(result);
  },
);

router.get(
  '/average/by/center/:centerId',

  [param('centerId').isMongoId()],

  async (req, res) => {
    validateRequest(validationResult(req));

    const { centerId } = req.params;

    const result = await averageByCenter(centerId);

    return res.status(200).json(result);
  },
);

module.exports = router;
