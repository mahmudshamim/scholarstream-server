require('dotenv').config();
const axios = require('axios');

/**
 * Test Firebase Login
 * 
 * This script tests if Firebase authentication is working
 * by attempting to sign in with the provided credentials.
 * 
 * Usage: node testFirebaseLogin.js <email> <password>
 */

const FIREBASE_API_KEY = 'AIzaSyAcuRWJg6k5hB0eJ1kraYXXMyh5m085tTc';
const FIREBASE_AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;

async function testLogin(email, password) {
    console.log('\n🔐 Testing Firebase Login...\n');
    console.log(`Email: ${email}`);
    console.log(`Password: ${'*'.repeat(password.length)}\n`);

    try {
        const response = await axios.post(FIREBASE_AUTH_URL, {
            email: email,
            password: password,
            returnSecureToken: true
        });

        console.log('✅ LOGIN SUCCESSFUL!\n');
        console.log('User Details:');
        console.log(`  Email: ${response.data.email}`);
        console.log(`  User ID: ${response.data.localId}`);
        console.log(`  ID Token: ${response.data.idToken.substring(0, 50)}...`);
        console.log(`  Refresh Token: ${response.data.refreshToken.substring(0, 50)}...`);
        console.log(`  Expires In: ${response.data.expiresIn} seconds\n`);

        // Now test MongoDB integration
        console.log('🔍 Checking MongoDB for user role...\n');

        try {
            const backendResponse = await axios.get(`http://localhost:5000/api/users/${email}`, {
                headers: {
                    'Authorization': `Bearer ${response.data.idToken}`
                }
            });

            console.log('✅ MongoDB User Found!\n');
            console.log('User Info from MongoDB:');
            console.log(`  Name: ${backendResponse.data.name}`);
            console.log(`  Email: ${backendResponse.data.email}`);
            console.log(`  Role: ${backendResponse.data.role}`);
            console.log(`  Is Admin: ${backendResponse.data.admin}`);
            console.log(`  Is Moderator: ${backendResponse.data.moderator}\n`);

            console.log('🎉 COMPLETE LOGIN FLOW SUCCESSFUL!\n');
            console.log('✅ Firebase Authentication: Working');
            console.log('✅ MongoDB Integration: Working');
            console.log('✅ Role Assignment: Working\n');

        } catch (mongoError) {
            console.log('⚠️  MongoDB check failed (backend might not be running)');
            console.log('   Error:', mongoError.message);
            console.log('   Make sure backend server is running on port 5000\n');
        }

        return true;

    } catch (error) {
        console.log('❌ LOGIN FAILED!\n');

        if (error.response) {
            const errorData = error.response.data.error;
            console.log('Error Details:');
            console.log(`  Code: ${errorData.code}`);
            console.log(`  Message: ${errorData.message}\n`);

            if (errorData.message.includes('EMAIL_NOT_FOUND')) {
                console.log('💡 Solution: Create this user in Firebase Console');
                console.log('   1. Go to: https://console.firebase.google.com/project/scholarstream-29f72/authentication/users');
                console.log('   2. Click "Add user"');
                console.log(`   3. Email: ${email}`);
                console.log(`   4. Password: ${password}`);
                console.log('   5. Click "Add user"\n');
            } else if (errorData.message.includes('INVALID_PASSWORD')) {
                console.log('💡 Solution: Password is incorrect');
                console.log('   Check if you used the correct password\n');
            }
        } else {
            console.log('Error:', error.message);
        }

        return false;
    }
}

// Main execution
const args = process.argv.slice(2);

if (args.length < 2) {
    console.log('\n📖 Usage: node testFirebaseLogin.js <email> <password>\n');
    console.log('Examples:');
    console.log('  node testFirebaseLogin.js admin@scholarstream.com AdminPass@2024');
    console.log('  node testFirebaseLogin.js moderator@scholarstream.com ModeratorPass@2024\n');
    console.log('Quick Test All Users:');
    console.log('  node testFirebaseLogin.js admin@scholarstream.com AdminPass@2024 && node testFirebaseLogin.js moderator@scholarstream.com ModeratorPass@2024\n');
    process.exit(1);
}

const [email, password] = args;
testLogin(email, password);
