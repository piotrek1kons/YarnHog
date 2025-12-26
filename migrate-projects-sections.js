const admin = require('firebase-admin');

// Initialize Firebase Admin
// Ensure serviceAccountKey.json exists next to this file.
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function migrateProjectSections() {
  console.log('\n=== Migrating Project Sections (remove description, ensure sections) ===\n');

  const snapshot = await db.collection('projects').get();
  console.log(`Found ${snapshot.size} projects\n`);

  let updated = 0;
  let createdSections = 0;
  let deletedDescriptionOnly = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const id = doc.id;
    const title = data.title || '(no title)';
    console.log(`\nProcessing: ${id} (${title})`);

    const hasSections = Array.isArray(data.sections) && data.sections.length > 0;
    const hasDescription = typeof data.description === 'string' && data.description.trim().length > 0;

    const updates = {};

    if (!hasSections) {
      if (hasDescription) {
        updates.sections = [{ name: 'Overview', description: data.description.trim(), image: '' }];
        createdSections++;
        console.log('  ✓ Created sections from legacy description');
      } else {
        // Ensure at least one empty section exists per new schema
        updates.sections = [{ name: 'Overview', description: '', image: '' }];
        createdSections++;
        console.log('  ✓ Created placeholder empty section');
      }
    }

    if ('description' in data) {
      updates.description = admin.firestore.FieldValue.delete();
      deletedDescriptionOnly++;
      console.log('  ✓ Removed legacy description field');
    }

    if (Object.keys(updates).length > 0) {
      await doc.ref.update(updates);
      updated++;
      console.log('  ✓ Document updated');
    } else {
      console.log('  ⊘ No changes needed');
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Updated documents: ${updated}`);
  console.log(`Created sections: ${createdSections}`);
  console.log(`Removed description fields: ${deletedDescriptionOnly}`);
  console.log(`Total projects scanned: ${snapshot.size}`);
}

async function main() {
  try {
    await migrateProjectSections();
    console.log('\n✓ Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Migration failed:', error);
    process.exit(1);
  }
}

main();
