import express from 'express';
import Event from './model/event_schema.js';
import bodyParser from 'body-parser';
import db_connect from './db_connect.js';

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(bodyParser.json());

app.put('/manage/edit/:eventId', async (req, res) => {

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.eventId,
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
app.delete('/manage/delete/:eventId', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.eventId);

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
