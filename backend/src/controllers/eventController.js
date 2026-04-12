'use strict';
const { supabaseAdmin } = require('../config/supabase');

// ──────────────────────────────────────────────────────────────────
// POST /api/events   (requires auth)
// ──────────────────────────────────────────────────────────────────
async function createEvent(req, res) {
  try {
    const {
      title, description,
      location_name, address, city, country,
      lat, lng,
      date_time, end_time,
      max_participants = 20,
      is_private = false,
      cover_color = '#800000',
    } = req.body;

    if (!title || !date_time) {
      return res.status(400).json({ success: false, error: 'title and date_time are required' });
    }

    // Build PostGIS POINT from lat/lng if provided
    const location = (lat !== undefined && lng !== undefined)
      ? `SRID=4326;POINT(${parseFloat(lng)} ${parseFloat(lat)})`
      : null;

    const eventPayload = {
      title,
      description:       description || null,
      host_id:           req.user.id,
      location_name:     location_name || null,
      address:           address || null,
      city:              city || null,
      country:           country || null,
      date_time,
      end_time:          end_time || null,
      max_participants:  parseInt(max_participants),
      is_private,
      cover_color,
      current_participants: 1,
    };
    if (location) eventPayload.location = location;

    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .insert(eventPayload)
      .select()
      .single();

    if (eventError) {
      console.error('[createEvent] insert error:', eventError);
      return res.status(500).json({ success: false, error: 'Failed to create event' });
    }

    // Add host as a participant with role = 'host'
    await supabaseAdmin.from('event_participants').insert({
      event_id: event.id,
      user_id:  req.user.id,
      role:     'host',
      status:   'confirmed',
    });

    // Increment host's events_hosted counter
    await supabaseAdmin
      .from('users')
      .update({ events_hosted: supabaseAdmin.sql`events_hosted + 1` })
      .eq('id', req.user.id)
      .catch(() => {});

    // Fetch host profile to attach to response
    const { data: host } = await supabaseAdmin
      .from('users')
      .select('id, username, full_name, avatar_url')
      .eq('id', req.user.id)
      .maybeSingle();

    return res.status(201).json({ success: true, event: { ...event, host } });
  } catch (err) {
    console.error('[createEvent]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// GET /api/events?lat=&lng=&radius=&date_from=&date_to=&limit=&offset=
// ──────────────────────────────────────────────────────────────────
async function getEvents(req, res) {
  try {
    const {
      lat, lng,
      radius = 50,    // km
      date_from,
      date_to,
      limit  = 20,
      offset = 0,
      status = 'upcoming',
    } = req.query;

    let query;

    if (lat !== undefined && lng !== undefined) {
      // Geospatial query: events within `radius` km of (lat, lng)
      // ST_DWithin works on geography in meters
      const radiusMeters = parseFloat(radius) * 1000;

      const { data, error } = await supabaseAdmin.rpc('get_nearby_events', {
        p_lat:        parseFloat(lat),
        p_lng:        parseFloat(lng),
        p_radius_m:   radiusMeters,
        p_date_from:  date_from || new Date().toISOString(),
        p_date_to:    date_to   || null,
        p_limit:      parseInt(limit),
        p_offset:     parseInt(offset),
      });

      if (error) {
        // Fallback: if the RPC doesn't exist yet, return all public events
        console.warn('[getEvents] RPC not available, falling back to plain query:', error.message);
        const { data: fallback, error: fbError } = await supabaseAdmin
          .from('events')
          .select(`*, host:host_id(id, username, full_name, avatar_url)`)
          .eq('is_private', false)
          .eq('status', status)
          .order('date_time', { ascending: true })
          .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

        if (fbError) return res.status(500).json({ success: false, error: 'Failed to fetch events' });
        return res.status(200).json({ success: true, events: fallback, count: fallback.length });
      }

      return res.status(200).json({ success: true, events: data, count: data.length });
    }

    // Non-geospatial: plain date/status filter
    let q = supabaseAdmin
      .from('events')
      .select(`*, host:host_id(id, username, full_name, avatar_url)`)
      .eq('is_private', false);

    if (status) q = q.eq('status', status);
    if (date_from) q = q.gte('date_time', date_from);
    if (date_to)   q = q.lte('date_time', date_to);

    q = q.order('date_time', { ascending: true })
         .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data, error } = await q;
    if (error) {
      console.error('[getEvents]', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch events' });
    }

    return res.status(200).json({ success: true, events: data, count: data.length });
  } catch (err) {
    console.error('[getEvents]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// GET /api/events/:id
// ──────────────────────────────────────────────────────────────────
async function getEventById(req, res) {
  try {
    const { id } = req.params;

    const { data: event, error } = await supabaseAdmin
      .from('events')
      .select(`*, host:host_id(id, username, full_name, avatar_url, bio)`)
      .eq('id', id)
      .maybeSingle();

    if (error || !event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    // Fetch participants with profiles
    const { data: participants } = await supabaseAdmin
      .from('event_participants')
      .select(`*, user:user_id(id, username, full_name, avatar_url)`)
      .eq('event_id', id)
      .order('joined_at', { ascending: true });

    // Fetch contributions
    const { data: contributions } = await supabaseAdmin
      .from('contributions')
      .select(`*, user:user_id(id, username, full_name, avatar_url)`)
      .eq('event_id', id)
      .order('created_at', { ascending: true });

    return res.status(200).json({
      success: true,
      event: {
        ...event,
        participants:  participants  || [],
        contributions: contributions || [],
      },
    });
  } catch (err) {
    console.error('[getEventById]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// PUT /api/events/:id   (requires auth — host only)
// ──────────────────────────────────────────────────────────────────
async function updateEvent(req, res) {
  try {
    const { id } = req.params;

    const { data: event } = await supabaseAdmin
      .from('events').select('host_id').eq('id', id).maybeSingle();

    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });
    if (event.host_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Only the host can edit this event' });
    }

    const allowed = ['title','description','location_name','address','city','country',
                     'date_time','end_time','max_participants','is_private','cover_color','status'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (req.body.lat !== undefined && req.body.lng !== undefined) {
      updates.location = `SRID=4326;POINT(${parseFloat(req.body.lng)} ${parseFloat(req.body.lat)})`;
    }

    const { data: updated, error } = await supabaseAdmin
      .from('events').update(updates).eq('id', id).select().single();

    if (error) return res.status(500).json({ success: false, error: 'Failed to update event' });
    return res.status(200).json({ success: true, event: updated });
  } catch (err) {
    console.error('[updateEvent]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// DELETE /api/events/:id   (requires auth — host only)
// ──────────────────────────────────────────────────────────────────
async function deleteEvent(req, res) {
  try {
    const { id } = req.params;

    const { data: event } = await supabaseAdmin
      .from('events').select('host_id').eq('id', id).maybeSingle();

    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });
    if (event.host_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Only the host can delete this event' });
    }

    const { error } = await supabaseAdmin.from('events').delete().eq('id', id);
    if (error) return res.status(500).json({ success: false, error: 'Failed to delete event' });

    return res.status(200).json({ success: true, message: 'Event deleted' });
  } catch (err) {
    console.error('[deleteEvent]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// POST /api/events/:id/join   (requires auth)
// ──────────────────────────────────────────────────────────────────
async function joinEvent(req, res) {
  try {
    const { id } = req.params;

    const { data: event } = await supabaseAdmin
      .from('events')
      .select('max_participants, current_participants, status, host_id')
      .eq('id', id)
      .maybeSingle();

    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });

    if (event.status !== 'upcoming' && event.status !== 'live') {
      return res.status(400).json({ success: false, error: 'This event is no longer accepting participants' });
    }
    if (event.current_participants >= event.max_participants) {
      return res.status(400).json({ success: false, error: 'Event is full' });
    }

    // Check already joined
    const { data: existing } = await supabaseAdmin
      .from('event_participants')
      .select('id').eq('event_id', id).eq('user_id', req.user.id).maybeSingle();

    if (existing) return res.status(409).json({ success: false, error: 'Already joined this event' });

    const { error: joinError } = await supabaseAdmin
      .from('event_participants')
      .insert({ event_id: id, user_id: req.user.id, role: 'attendee', status: 'confirmed' });

    if (joinError) return res.status(500).json({ success: false, error: 'Failed to join event' });

    // Increment current_participants
    await supabaseAdmin
      .from('events')
      .update({ current_participants: event.current_participants + 1 })
      .eq('id', id);

    return res.status(200).json({ success: true, message: 'Joined event successfully' });
  } catch (err) {
    console.error('[joinEvent]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// DELETE /api/events/:id/join   (requires auth)
// ──────────────────────────────────────────────────────────────────
async function leaveEvent(req, res) {
  try {
    const { id } = req.params;

    const { data: participant } = await supabaseAdmin
      .from('event_participants')
      .select('role').eq('event_id', id).eq('user_id', req.user.id).maybeSingle();

    if (!participant) return res.status(404).json({ success: false, error: 'Not a participant' });
    if (participant.role === 'host') {
      return res.status(400).json({ success: false, error: 'Host cannot leave their own event. Delete it instead.' });
    }

    await supabaseAdmin.from('event_participants').delete().eq('event_id', id).eq('user_id', req.user.id);

    const { data: event } = await supabaseAdmin
      .from('events').select('current_participants').eq('id', id).maybeSingle();

    if (event) {
      await supabaseAdmin
        .from('events')
        .update({ current_participants: Math.max(0, event.current_participants - 1) })
        .eq('id', id);
    }

    return res.status(200).json({ success: true, message: 'Left event' });
  } catch (err) {
    console.error('[leaveEvent]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// GET /api/events/:id/participants
// ──────────────────────────────────────────────────────────────────
async function getEventParticipants(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('event_participants')
      .select(`role, status, joined_at, user:user_id(id, username, full_name, avatar_url)`)
      .eq('event_id', id)
      .order('joined_at', { ascending: true });

    if (error) return res.status(500).json({ success: false, error: 'Failed to fetch participants' });
    return res.status(200).json({ success: true, participants: data, count: data.length });
  } catch (err) {
    console.error('[getEventParticipants]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// POST /api/events/:id/contributions   (requires auth)
// ──────────────────────────────────────────────────────────────────
async function addContribution(req, res) {
  try {
    const { id } = req.params;
    const { item_name, quantity } = req.body;

    if (!item_name) return res.status(400).json({ success: false, error: 'item_name is required' });

    const { data, error } = await supabaseAdmin
      .from('contributions')
      .insert({ event_id: id, user_id: req.user.id, item_name, quantity: quantity || null })
      .select()
      .single();

    if (error) return res.status(500).json({ success: false, error: 'Failed to add contribution' });
    return res.status(201).json({ success: true, contribution: data });
  } catch (err) {
    console.error('[addContribution]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// DELETE /api/events/:id/contributions/:contributionId   (requires auth)
// ──────────────────────────────────────────────────────────────────
async function removeContribution(req, res) {
  try {
    const { id, contributionId } = req.params;

    const { data: contrib } = await supabaseAdmin
      .from('contributions').select('user_id').eq('id', contributionId).maybeSingle();

    if (!contrib) return res.status(404).json({ success: false, error: 'Contribution not found' });
    if (contrib.user_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Can only remove your own contributions' });
    }

    await supabaseAdmin.from('contributions').delete().eq('id', contributionId);
    return res.status(200).json({ success: true, message: 'Contribution removed' });
  } catch (err) {
    console.error('[removeContribution]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

// ──────────────────────────────────────────────────────────────────
// GET /api/events/:id/contributions
// ──────────────────────────────────────────────────────────────────
async function getContributions(req, res) {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('contributions')
      .select(`*, user:user_id(id, username, full_name, avatar_url)`)
      .eq('event_id', id)
      .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ success: false, error: 'Failed to fetch contributions' });
    return res.status(200).json({ success: true, contributions: data, count: data.length });
  } catch (err) {
    console.error('[getContributions]', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

module.exports = {
  createEvent, getEvents, getEventById, updateEvent, deleteEvent,
  joinEvent, leaveEvent, getEventParticipants,
  addContribution, removeContribution, getContributions,
};
