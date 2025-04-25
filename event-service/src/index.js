import express from 'express';
import bodyParser from 'body-parser';
import db_connect from './db_connect.js';
import Event from './model/event_schema.js';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(bodyParser.json());

// Create Event Endpoint
app.post('/event', async (req, res) => {

  const role = req.headers['x-user-role'];
  if (role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: admins only.' });
  }

  const { title, description, location, date, totalTickets, price } = req.body;

  if (!title || !description || !location || !date || !totalTickets || !price) {
    return res.status(400).json({
      message: 'Title, description, location, date, totalTickets and price are required.'
    });
  }

  try {
    const newEvent = new Event({ title, description, location, date, totalTickets, price });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// Get All Events Endpoint
// This endpoint is accessible to both admin and regular users
// Admins can see all events, while regular users can only see events with available tickets
app.get('/events', async (req, res) => {

  const role = req.headers['x-user-role'];

  try {
    
    let events;

    if (role === 'admin') {
      events = await Event.find().select('-__v');
    } else {
      events = await Event.find({ availableTickets: { $gt: 0 } })
                          .select('-__v -totalTickets -createdAt -updatedAt')
                          .lean();
    }

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Event Server is running on port ${PORT}`);
});