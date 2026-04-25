'use strict';
const router = require('express').Router();
const {
  listRecipes,
  submitRecipeValidators,
  submitRecipe,
  listCouncilVotes,
  castCouncilVoteValidators,
  castCouncilVote,
  listBrotherhood,
} = require('../controllers/vaultController');
const { requireAuth, requireVaultMember } = require('../middleware/auth');

router.get ('/recipes',          requireAuth, requireVaultMember, listRecipes);
router.post('/recipes',          requireAuth, requireVaultMember, submitRecipeValidators, submitRecipe);
router.get ('/council',          requireAuth, requireVaultMember, listCouncilVotes);
router.post('/council/:id/vote', requireAuth, requireVaultMember, castCouncilVoteValidators, castCouncilVote);
router.get ('/brotherhood',      requireAuth, requireVaultMember, listBrotherhood);

module.exports = router;
