require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing MongoDB Atlas Connection...\n');
console.log('Database:', process.env.MONGODB_URI.split('@')[1]?.split('/')[1]?.split('?')[0]);
console.log('Cluster:', process.env.MONGODB_URI.match(/@([^/]+)/)?.[1]);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('\n✅ MongoDB Atlas Connected Successfully!');
        console.log('📊 Connection Details:');
        console.log('   - Database Name:', mongoose.connection.name);
        console.log('   - Host:', mongoose.connection.host);
        console.log('   - Ready State:', mongoose.connection.readyState);
        process.exit(0);
    })
    .catch(err => {
        console.error('\n❌ MongoDB Connection Failed!');
        console.error('Error:', err.message);
        console.error('\n💡 Troubleshooting Tips:');
        console.error('   1. Check username and password in MongoDB Atlas');
        console.error('   2. Verify IP whitelist (add 0.0.0.0/0 for all IPs)');
        console.error('   3. Ensure database user has proper permissions');
        console.error('   4. Check if cluster is active');
        process.exit(1);
    });
