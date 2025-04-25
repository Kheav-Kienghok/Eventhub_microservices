import express from 'express';
import Event from './model/event_schema.js';
import bodyParser from 'body-parser';
import db_connect from './db_connect.js';

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(bodyParser.json());

app.put('/event/:id', async (req, res) => {
  console.log("Updating event with ID:", req.params.id);
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - Delete event by ID
app.delete('/event/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Event Service is running on port ${PORT}`);
});
