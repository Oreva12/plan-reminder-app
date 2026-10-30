const { getPlanById } = require('../services/planService');

async function loadPlan(req, res, next) {
  try {
    // req.params.id comes from the URL (e.g., /api/plans/:id)
    req.plan = await getPlanById(req.params.id, req.user);
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = loadPlan;