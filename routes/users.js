const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { REGEX_URL } = require('../utils/regex-url');

const {
  getAllUsers,
  getCurrentUser,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

const { auth } = require('../middlewares/auth');

router.get('/', auth, getAllUsers);
router.get('/me', auth, getCurrentUser);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().hex().length(24),
    }),
  }),
  auth,
  getUser,
);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  auth,
  updateUser,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(REGEX_URL),
    }),
  }),
  auth,
  updateAvatar,
);

module.exports = router;
