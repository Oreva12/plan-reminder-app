const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');
const { deleteCategory: deleteCategoryService } = require('../services/planService');

async function listCategories(req, res, next) {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ categories });
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const { name, reminderDays } = req.body;
    if (!name) throw new ApiError(400, 'Name is required');

    const category = await Category.create({ name, reminderDays });
    res.status(201).json({ category });
  } catch (err) {
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name, reminderDays } = req.body;
    
    const category = await Category.findByIdAndUpdate(
      id, 
      { name, reminderDays }, 
      { new: true, runValidators: true }
    );
    
    if (!category) throw new ApiError(404, 'Category not found');
    res.json({ category });
  } catch (err) {
    next(err);
  }
}

async function deleteCategory(req, res, next) {
  try {
    await deleteCategoryService(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };