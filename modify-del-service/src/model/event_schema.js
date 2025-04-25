import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({

    title: { 
        type: String, 
        required: true,
        unique: true
    },
    description: {
        type: String, 
        required: true 
    },
    location: {
        type: String, 
        required: true 
    },
    date: {
        type: Date, 
        required: true 
    },
    totalTickets: {
        type: Number,
        required: true,
        min: 0
    },
    availableTickets: {
        type: Number,
        min: 0
    },
    price: {
        type: Number, 
        required: true 
    },
    createdAt: {
        type: Date, 
        default: Date.now 
    }
});

const Event = mongoose.model('Event', eventSchema);

export default Event;