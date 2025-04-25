import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        }, 
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
            // Custom validator to prevent creating admin after initial setup
            validate: {
                validator: async function(value) {
                    // If role is 'admin', ensure that it's the first admin user being created
                    if (value === 'admin') {
                        // Check if there's already an admin in the database
                        const existingAdmin = await mongoose.model('User').findOne({ role: 'admin' });
                        // If there is an existing admin, reject new admin creation
                        return !existingAdmin;
                    }
                    return true; // Allow 'user' role
                },
                message: 'Hey there! What are you doing? Go back to being a user.',
            } 
        },
    },
    { 
        timestamps: true 
    }
);

const User = mongoose.model('User', userSchema);

export default User; 
