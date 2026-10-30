const express = require('express');
const requireAuth = require('../middleware/auth');
const loadPlan = require('../middleware/loadPlan');
const { listPlans, getPlan, createPlan, updatePlan, renew, deletePlan } = require('../controllers/plan.controller');

const router = express.Router();

// All plan routes require login
router.use(requireAuth);

router.route('/')
  .get(listPlans)
  .post(createPlan);

// Everything below here requires the plan to exist and belong to the user
router.use('/:id', loadPlan);

router.route('/:id')
  .get(getPlan)
  .patch(updatePlan)
  .delete(deletePlan);

// Special route for renewing
router.post('/:id/renew', renew);

module.exports = router;