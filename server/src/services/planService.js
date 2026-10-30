const Plan = require('../models/Plan');
const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');

// Helper: scope the query based on role
function scopePlansToUser(user) {
  if (user.role === 'admin') {
    return {}; // Admin sees everything
  }
  return { owner: user._id }; // Owner sees only their own
}

async function getPlans(user) {
  const filter = scopePlansToUser(user);
  // Populate pulls in the category details
  return Plan.find(filter).populate('category', 'name reminderDays').sort({ expiryDate: 1 });
}

async function getPlanById(planId, user) {
  const filter = { _id: planId, ...scopePlansToUser(user) };
  const plan = await Plan.findOne(filter).populate('category', 'name reminderDays');
  
  // We return 404 if not found OR if they don't own it (prevents leaking existence)
  if (!plan) throw new ApiError(404, 'Plan not found');
  return plan;
}

async function renewPlan(planId, user, newExpiryDate) {
  const plan = await getPlanById(planId, user);
  
  plan.expiryDate = newExpiryDate;
  plan.cancelledAt = null; // Renewing un-cancels it
  await plan.save();
  
  return plan;
}

async function deleteCategory(categoryId) {
  // The Guard: Check if any plans use this category
  const planCount = await Plan.countDocuments({ category: categoryId });
  if (planCount > 0) {
    throw new ApiError(409, `Cannot delete: ${planCount} plans use this category. Reassign them first.`);
  }
  
  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) throw new ApiError(404, 'Category not found');
  return category;
}

module.exports = {
  getPlans,
  getPlanById,
  renewPlan,
  deleteCategory,
};