'use strict';
const { body, param, validationResult } = require('express-validator');
const { supabaseAdmin } = require('../config/supabase');

function rejectIfInvalid(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, error: 'Validation failed', details: errors.array() });
    return true;
  }
  return false;
}

async function listRecipes(_req, res) {
  const { data, error } = await supabaseAdmin
    .from('vault_recipes')
    .select('id, title, description, ingredients, instructions, prep_time_minutes, serves, created_at')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.json({ success: true, recipes: data });
}

const submitRecipeValidators = [
  body('title').isString().trim().isLength({ min: 2, max: 200 }),
  body('description').optional({ checkFalsy: true }).isString().isLength({ max: 2000 }),
  body('ingredients').optional({ checkFalsy: true }).isString().isLength({ max: 4000 }),
  body('instructions').optional({ checkFalsy: true }).isString().isLength({ max: 6000 }),
  body('prep_time_minutes').optional({ checkFalsy: true }).isInt({ min: 1, max: 6000 }).toInt(),
  body('serves').optional({ checkFalsy: true }).isInt({ min: 1, max: 1000 }).toInt(),
];

async function submitRecipe(req, res) {
  if (rejectIfInvalid(req, res)) return;

  const { title, description, ingredients, instructions, prep_time_minutes, serves } = req.body;

  const { data, error } = await supabaseAdmin
    .from('vault_recipes')
    .insert({
      submitted_by: req.user.id,
      title, description, ingredients, instructions,
      prep_time_minutes, serves,
      approved: false,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.status(201).json({ success: true, recipe: data });
}

async function listCouncilVotes(_req, res) {
  const { data, error } = await supabaseAdmin
    .from('council_votes')
    .select('id, question, options, ends_at, created_at')
    .gt('ends_at', new Date().toISOString())
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.json({ success: true, votes: data });
}

const castCouncilVoteValidators = [
  param('id').isUUID(4),
  body('selected_option').isString().trim().isLength({ min: 1, max: 200 }),
];

async function castCouncilVote(req, res) {
  if (rejectIfInvalid(req, res)) return;

  const voteId = req.params.id;
  const { selected_option } = req.body;

  const { data: vote, error: voteErr } = await supabaseAdmin
    .from('council_votes')
    .select('id, options, ends_at')
    .eq('id', voteId)
    .single();

  if (voteErr || !vote) return res.status(404).json({ success: false, error: 'Vote not found' });
  if (new Date(vote.ends_at) <= new Date()) {
    return res.status(409).json({ success: false, error: 'Voting period closed' });
  }
  const options = Array.isArray(vote.options) ? vote.options : [];
  if (!options.includes(selected_option)) {
    return res.status(400).json({ success: false, error: 'Invalid option for this vote' });
  }

  const { error } = await supabaseAdmin
    .from('council_vote_responses')
    .upsert(
      { user_id: req.user.id, vote_id: voteId, selected_option },
      { onConflict: 'user_id,vote_id' },
    );

  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.status(201).json({ success: true });
}

async function listBrotherhood(_req, res) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, username, full_name, profile_image_url, board_rank, city, country, events_hosted')
    .eq('vault_member', true)
    .order('events_hosted', { ascending: false })
    .limit(200);

  if (error) return res.status(500).json({ success: false, error: error.message });
  return res.json({ success: true, members: data });
}

module.exports = {
  listRecipes,
  submitRecipeValidators,
  submitRecipe,
  listCouncilVotes,
  castCouncilVoteValidators,
  castCouncilVote,
  listBrotherhood,
};
