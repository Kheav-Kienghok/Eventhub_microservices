import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    eventId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Event', 
      required: true 
    },
    tickets: { 
      type: Number, 
      required: true, 
      min: 1 
    },
  }, 
    { 
      timestamps: true 
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;