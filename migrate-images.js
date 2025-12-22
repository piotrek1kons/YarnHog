const admin = require('firebase-admin');

// Initialize Firebase Admin
// Download serviceAccountKey.json from Firebase Console:
// Project Settings -> Service Accounts -> Generate New Private Key
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'yarnhog-5feac.firebasestorage.app'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

async function downloadImageAsBase64(storagePath) {
  try {
    console.log(`  Downloading: ${storagePath}`);
    
    // Remove gs:// prefix if present
    let filePath = storagePath;
    if (filePath.startsWith('gs://')) {
      // Extract path after bucket name
      // gs://yarnhog-5feac.firebasestorage.app/Tutorials/dc/dc.png -> Tutorials/dc/dc.png
      const parts = filePath.replace('gs://', '').split('/');
      parts.shift(); // Remove bucket name
      filePath = parts.join('/');
    }
    
    console.log(`  Using path: ${filePath}`);
    
    // Get file from Storage
    const file = bucket.file(filePath);
    
    // Download file buffer
    const [buffer] = await file.download();
    
    // Convert to base64
    const base64 = buffer.toString('base64');
    const mimeType = 'image/png'; // Most tutorials use PNG
    const dataUrl = `data:${mimeType};base64,${base64}`;
    
    console.log(`  ✓ Converted to base64, length: ${dataUrl.length}`);
    return dataUrl;
  } catch (error) {
    console.error(`  ✗ Error downloading ${storagePath}:`, error.message);
    return null;
  }
}

async function migrateTutorials() {
  console.log('\n=== Migrating Tutorials ===\n');
  
  const snapshot = await db.collection('tutorials').get();
  console.log(`Found ${snapshot.size} tutorials\n`);
  
  let migrated = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    console.log(`\nProcessing: ${doc.id} (${data.name})`);
    
    // Check if already migrated
    if (data.image && typeof data.image === 'string' && data.image.startsWith('data:')) {
      console.log('  ⊘ Already migrated (has base64)');
      skipped++;
      continue;
    }
    
    // Get storage path
    const storagePath = data.image?.symbol;
    if (!storagePath) {
      console.log('  ⊘ No image path found');
      skipped++;
      continue;
    }
    
    // Download and convert
    const base64Image = await downloadImageAsBase64(storagePath);
    
    if (base64Image) {
      // Update document
      await doc.ref.update({
        image: base64Image,
        image_original_path: storagePath // Keep original path as backup
      });
      console.log('  ✓ Updated in Firestore');
      migrated++;
    } else {
      failed++;
    }
  }
  
  console.log(`\n=== Summary ===`);
  console.log(`Migrated: ${migrated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${snapshot.size}`);
}

async function migrateProjects() {
  console.log('\n=== Migrating Projects ===\n');
  
  const snapshot = await db.collection('projects').get();
  console.log(`Found ${snapshot.size} projects\n`);
  
  let migrated = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    console.log(`\nProcessing: ${doc.id} (${data.title})`);
    
    // Check if already migrated
    if (data.image && typeof data.image === 'string' && data.image.startsWith('data:')) {
      console.log('  ⊘ Already migrated (has base64)');
      skipped++;
      continue;
    }
    
    // Get storage path
    const storagePath = data.image;
    if (!storagePath || typeof storagePath !== 'string' || storagePath.startsWith('http')) {
      console.log('  ⊘ No valid storage path');
      skipped++;
      continue;
    }
    
    // Download and convert
    const base64Image = await downloadImageAsBase64(storagePath);
    
    if (base64Image) {
      // Update document
      await doc.ref.update({
        image: base64Image,
        image_original_path: storagePath
      });
      console.log('  ✓ Updated in Firestore');
      migrated++;
    } else {
      failed++;
    }
  }
  
  console.log(`\n=== Summary ===`);
  console.log(`Migrated: ${migrated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${snapshot.size}`);
}

async function main() {
  try {
    console.log('Starting migration...\n');
    
    await migrateTutorials();
    await migrateProjects();
    
    console.log('\n✓ Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Migration failed:', error);
    process.exit(1);
  }
}

main();
