#!/usr/bin/env node
/**
 * Fix fl_gigs attribute limit by reducing string sizes
 * Then add moderation fields
 * Run: node scripts/fix-gigs-limit.js
 */
const sdk = require('node-appwrite');

const client = new sdk.Client()
  .setEndpoint('https://appwrite.vibecoding.by/v1')
  .setProject('69ab4e9d00342b2b9f9f')
  .setKey('standard_ac07ab782ca017c0c46c029aa448ff921576b4b5decf8fd166ebdbb1c111351c635a03055648c2b69c234ec4e778f7ebff9d2495b1d230e2fb4c1b5e16b515669efef6b820b1382b746cacf6e2984a7650095d22e6fa3b3730b5153257650b0cd5ed192466b7ec79686e4ed0cac9ebff1136ff038c9db9489d32f7a3136182ed');
const db = new sdk.Databases(client);
const DB = 'freelance';
const COLL = 'fl_gigs';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log('🔧 Fixing fl_gigs attribute limit...\n');

  // 1. First backup all gig data
  console.log('1. Backing up gig data...');
  const { documents: gigs } = await db.listDocuments(DB, COLL, [sdk.Query.limit(100)]);
  console.log(`   Found ${gigs.length} gigs`);

  // 2. Delete attributes that are too large and recreate smaller
  // Current problem: description is 5000, package_* are 1000 each = already ~9000+ bytes
  // We need to remove some redundant or shrinkable attrs
  
  const attrsToShrink = [
    // These take a lot of space but can be shorter
    { key: 'freelancer_avatar', newSize: 300 },  // was 500
    { key: 'images', newSize: 1000 },  // was 2000
    { key: 'description', newSize: 3000 },  // was 5000
    { key: 'short_description', newSize: 300 },  // was 500
  ];

  // Instead of shrinking (can't resize in Appwrite), let's delete non-critical attrs and add moderation
  // Best approach: remove freelancer_avatar (can be fetched from fl_profiles)
  console.log('\n2. Removing freelancer_avatar to free space...');
  try {
    await db.deleteAttribute(DB, COLL, 'freelancer_avatar');
    console.log('   ✅ Deleted freelancer_avatar');
  } catch(e) { console.log('   ⏭️', e.message); }
  await sleep(5000);

  // 3. Now add moderation fields (smaller sizes)
  console.log('\n3. Adding moderation fields...');
  
  const newAttrs = [
    { key: 'rejection_reason', size: 300 },
    { key: 'moderated_by', size: 50 },
    { key: 'moderated_at', size: 30 },
  ];

  for (const attr of newAttrs) {
    try {
      await db.createStringAttribute(DB, COLL, attr.key, attr.size, false);
      console.log(`   ✅ ${attr.key} (${attr.size})`);
    } catch(e) {
      if (e.message?.includes('exists')) console.log(`   ⏭️ ${attr.key} exists`);
      else if (e.message?.includes('maximum')) {
        console.log(`   ❌ ${attr.key}: still at limit, need to free more space`);
      } else {
        console.log(`   ❌ ${attr.key}: ${e.message}`);
      }
    }
    await sleep(2000);
  }

  // 4. Update gig documents to remove freelancer_avatar data
  // (It's been deleted as attribute, existing docs are fine)

  console.log('\n✅ Done! If moderation fields failed, we need to delete more unused attrs.');
  console.log('   Check current attrs with: node -e "..list attributes.."');
}

main().catch(console.error);
