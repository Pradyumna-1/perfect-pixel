
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import 'dotenv/config';

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Pradyumna@123';
        const adminEmail = process.env.EMAIL_USER || 'admin@perfectpixel.com';
        const adminPhone = process.env.ADMIN_PHONE || '917205330733';

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Find by username OR email
        let admin = await User.findOne({
            $or: [
                { username: adminUsername },
                { email: adminEmail }
            ]
        });

        if (admin) {
            admin.username = adminUsername; // Ensure username matches env
            admin.password = hashedPassword;
            admin.email = adminEmail;
            admin.phone = adminPhone;
            await admin.save();
            console.log(`SUCCESS: Admin password reset for user "${adminUsername}"`);
        } else {
            console.log('Admin user not found, creating new one...');
            await User.create({
                username: adminUsername,
                password: hashedPassword,
                email: adminEmail,
                phone: adminPhone
            });
            console.log(`SUCCESS: Admin user created: ${adminUsername}`);
        }
        process.exit(0);
    } catch (err) {
        console.error('Error resetting admin:', err);
        process.exit(1);
    }
};

resetAdmin();
