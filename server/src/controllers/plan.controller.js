const Plan = require('../models/Plan');
const { getPlans, renewPlan } = require('../services/planService');
const ApiError = require('../utils/ApiError');

async function listPlans(req, res, next) {
  try {
    const plans = await getPlans(req.user);
    res.json({ plans });
  } catch (err) {
    next(err);
  }
}

async function getPlan(req, res) {
  // req.plan was attached by loadPlan middleware
  res.json({ plan: req.plan });
}

async function createPlan(req, res, next) {
  try {
    const { name, provider, category, expiryDate } = req.body;
    
    const plan = await Plan.create({
      name,
      provider,
      category,
      expiryDate,
      owner: req.user._id, // Automatically tie it to the logged-in user
    });

    res.status(201).json({ plan });
  } catch (err) {
    next(err);
  }
}

async function updatePlan(req, res, next) {
  try {
    const { name, provider, category, expiryDate, cancelledAt } = req.body;
    
    // We update the plan already loaded by the middleware
    req.plan.name = name || req.plan.name;
    req.plan.provider = provider || req.plan.provider;
    req.plan.category = category || req.plan.category;
    req.plan.expiryDate = expiryDate || req.plan.expiryDate;
    
    if (cancelledAt !== undefined) {
      req.plan.cancelledAt = cancelledAt;
    }

    await req.plan.save();
    res.json({ plan: req.plan });
  } catch (err) {
    next(err);
  }
}

async function renew(req, res, next) {
  try {
    const { expiryDate } = req.body;
    if (!expiryDate) throw new ApiError(400, 'New expiryDate is required');

    const renewed = await renewPlan(req.plan._id, req.user, expiryDate);
    res.json({ plan: renewed });
  } catch (err) {
    next(err);
  }
}

async function deletePlan(req, res, next) {
  try {
    await req.plan.deleteOne();
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listPlans, getPlan, createPlan, updatePlan, renew, deletePlan };