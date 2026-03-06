#!/usr/bin/env node
const sdk = require('node-appwrite');
const client = new sdk.Client()
  .setEndpoint('https://appwrite.vibecoding.by/v1')
  .setProject('69ab4e9d00342b2b9f9f')
  .setKey('standard_ac07ab782ca017c0c46c029aa448ff921576b4b5decf8fd166ebdbb1c111351c635a03055648c2b69c234ec4e778f7ebff9d2495b1d230e2fb4c1b5e16b515669efef6b820b1382b746cacf6e2984a7650095d22e6fa3b3730b5153257650b0cd5ed192466b7ec79686e4ed0cac9ebff1136ff038c9db9489d32f7a3136182ed');
const db = new sdk.Databases(client);
const DB = 'freelance';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log('📦 Creating fl_projects + fixing fl_gigs...\n');

  // 1. Fix fl_gigs: remove freelancer_avatar to free space for moderation
  console.log('1. fl_gigs: freeing space...');
  try { await db.deleteAttribute(DB, 'fl_gigs', 'freelancer_avatar'); console.log('   Deleted freelancer_avatar'); } catch(e) { console.log('   ⏭️', e.message?.slice(0,60)); }
  await sleep(5000);

  for (const attr of [
    { key: 'rejection_reason', size: 300 },
    { key: 'moderated_by', size: 50 },
    { key: 'moderated_at', size: 30 },
  ]) {
    try { await db.createStringAttribute(DB, 'fl_gigs', attr.key, attr.size, false); console.log(`   ✅ ${attr.key}`); }
    catch(e) { console.log(`   ⏭️ ${attr.key}: ${e.message?.slice(0,60)}`); }
    await sleep(2000);
  }

  // 2. Create fl_projects
  console.log('\n2. fl_projects...');
  try {
    await db.createCollection(DB, 'fl_projects', 'FL Projects', [
      sdk.Permission.read(sdk.Role.any()),
      sdk.Permission.create(sdk.Role.users()),
      sdk.Permission.update(sdk.Role.users()),
      sdk.Permission.delete(sdk.Role.users()),
    ], false);
    console.log('   ✨ Created');
  } catch(e) { console.log('   ⏭️', e.code === 409 ? 'exists' : e.message); }
  await sleep(2000);

  const attrs = [
    { key: 'user_id', size: 100, required: true },
    { key: 'user_name', size: 200 },
    { key: 'user_avatar', size: 300 },
    { key: 'title', size: 300, required: true },
    { key: 'description', size: 3000 },
    { key: 'category', size: 100 },
    { key: 'status', size: 20, default: 'open' },
    { key: 'responses_count', type: 'integer', default: 0 },
    { key: 'budget_from', type: 'integer', default: 0 },
    { key: 'budget_to', type: 'integer', default: 0 },
    { key: 'deadline_days', type: 'integer', default: 7 },
  ];

  for (const attr of attrs) {
    try {
      if (attr.type === 'integer') {
        await db.createIntegerAttribute(DB, 'fl_projects', attr.key, attr.required || false, undefined, undefined, attr.default ?? null);
      } else {
        await db.createStringAttribute(DB, 'fl_projects', attr.key, attr.size || 255, attr.required || false, attr.default || null);
      }
      console.log(`   ✅ ${attr.key}`);
    } catch(e) { console.log(`   ⏭️ ${attr.key}: ${e.message?.includes('exist') ? 'exists' : e.message?.slice(0,50)}`); }
    await sleep(1500);
  }

  await sleep(3000);
  try { await db.createIndex(DB, 'fl_projects', 'idx_status', 'key', ['status']); console.log('   📇 idx_status'); } catch(e) { console.log('   ⏭️ idx_status'); }
  await sleep(1500);
  try { await db.createIndex(DB, 'fl_projects', 'idx_user', 'key', ['user_id']); console.log('   📇 idx_user'); } catch(e) { console.log('   ⏭️ idx_user'); }

  console.log('\n✅ Done!');
}
main().catch(console.error);
