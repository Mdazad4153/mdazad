require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Delete existing admin
        await Admin.deleteMany({});
        console.log('🗑️  Cleared existing admins');

        // Create new admin
        const admin = new Admin({
            email: 'azad79900@gmail.com',
            password: 'Azad@4153',
            name: 'Md Azad Ansari'
        });

        await admin.save();
        console.log('✅ New admin created successfully!');
        console.log(`📧 Email: ${admin.email}`);
        console.log(`🔑 Password: Azad@4153`);
        console.log(`👤 Name: ${admin.name}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

createAdmin();
