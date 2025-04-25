import bcrypt from 'bcryptjs';

const seedAdmin = async (User) => {

    try {
        const adminExists = await User.findOne({ role: 'admin' });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin', 10); // secure this in env
            await User.create({
                username: 'admin',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'admin',
            });
            
            console.log('✅  Admin user created.');

        } else {
            console.log('ℹ️  Admin user already exists.');
        }
        
    } catch (err) {
        console.error('❌ Error creating admin user:', err);
    }
};

export default seedAdmin;