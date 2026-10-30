const express = require('express');
const requireAuth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');

const router = express.Router();

// Anyone logged in can list categories
router.get('/', requireAuth, listCategories);

// Only admins can create/update/delete
router.post('/', requireAuth, requireRole('admin'), createCategory);
router.patch('/:id', requireAuth, requireRole('admin'), updateCategory);
router.delete('/:id', requireAuth, requireRole('admin'), deleteCategory);

module.exports = router;