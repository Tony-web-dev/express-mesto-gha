const router = require('express').Router();
const {
  getUsers, getUserByID, addUser, editUser, editUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userID', getUserByID);
router.post('/', addUser);
router.patch('/me', editUser);
router.patch('/me/avatar', editUserAvatar);

module.exports = router;