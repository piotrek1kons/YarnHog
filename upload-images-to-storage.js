const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'yarnhog-5feac.firebasestorage.app'
});

const bucket = admin.storage().bucket();

// Path to local images
const localImagesPath = path.join(__dirname, 'assets', 'img');

// List of images to upload
const images = [
  'community.png',
  'home.png',
  'logo.png',
  'materials.png',
  'nav-arrow.png',
  'other.png',
  'profile.png',
  'projects.png',
  'row-counter.png',
  'tutorials.png'
];

async function uploadImages() {
  console.log('Starting image upload to Firebase Storage...\n');

  for (const imageName of images) {
    try {
      const localPath = path.join(localImagesPath, imageName);
      
      // Check if file exists
      if (!fs.existsSync(localPath)) {
        console.log(`❌ File not found: ${imageName}`);
        continue;
      }

      // Upload to Firebase Storage
      const destination = `img/${imageName}`;
      await bucket.upload(localPath, {
        destination: destination,
        metadata: {
          contentType: 'image/png',
          cacheControl: 'public, max-age=31536000',
        },
      });

      // Make the file publicly accessible
      await bucket.file(destination).makePublic();

      console.log(`✅ Uploaded: ${imageName} -> ${destination}`);
    } catch (error) {
      console.error(`❌ Error uploading ${imageName}:`, error.message);
    }
  }

  console.log('\n✨ Upload complete!');
  process.exit(0);
}

uploadImages().catch(console.error);
