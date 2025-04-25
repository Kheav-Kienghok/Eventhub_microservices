import express from 'express';
import bodyParser from 'body-parser';
import db_connect from './db_connect.js';
import Booking from './model/booking_schema.js';
import Event from './model/event_schema.js'; 
import User from './model/user_schema.js';

const app = express();
const PORT = process.env.PORT || 3004;


// Middleware
app.use(bodyParser.json());

// GET /bookings — Admin-only route to get all bookings
app.get('/bookings', async (req, res) => {
  const role = req.headers['x-user-role'];

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: admins only.' });
  }

  try {
    const bookings = await Booking.find().populate('eventId userId');
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', err });
  }
});

/**
 * GET /bookings/me
 * Get bookings for the logged-in user
 */
app.get('/bookings/me', async (req, res) => {

    const userId = req.headers['x-user-id'];

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: user ID missing in headers.' });
    }

    try {
        const bookings = await Booking.find({ userId })
        .populate('eventId');

        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', err });
    }
});

// POST /bookings — Create a new booking or update an existing one
app.post('/bookings', async (req, res) => {

  const userId = req.headers['x-user-id'];

  const { eventId, tickets } = req.body;

  if (!userId || !eventId || !tickets || tickets <= 0) {
    return res.status(400).json({ message: 'User ID, Event ID, and a positive ticket count are required.' });
  }

  try {
    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Check available tickets
    if (event.availableTickets < tickets) {
      return res.status(400).json({ message: 'Not enough available tickets.' });
    }

    // Check if user has already booked
    let booking = await Booking.findOne({ userId, eventId });

    if (booking) {
      booking.tickets += tickets;
      await booking.save();
    } else {
      booking = new Booking({ userId, eventId, tickets });
      await booking.save();
    }

    // Deduct the number of tickets from event's availableTickets
    event.availableTickets -= tickets;
    await event.save();

    res.status(200).json(booking);

  } catch (err) {
    console.error('Error processing booking:', err);
    res.status(500).json({ message: 'Internal server error', err });
  }
});


app.listen(PORT, () => {
    console.log(`Booking Service is running on port ${PORT}`);
});
