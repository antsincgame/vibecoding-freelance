#!/usr/bin/env node
const sdk = require('node-appwrite');
const client = new sdk.Client()
  .setEndpoint('https://appwrite.vibecoding.by/v1')
  .setProject('69aa2114000211b48e63')
  .setKey('standard_06b8634032f75c7d02d49e7a4add952c4183146ce5def3dc0f4a9df7e18307b29193788a0aa7694e6146ac3339a99eae5de4c3ce24b6a284e41f84dad5683cbc9a60ab5b18084171ad9b9a60d470bbce068b4ee21c8231467bd92bec43c9ed9dcfbe6e23f784c4c77e0c88beeacb60f4a7873f2baa936246a7aa4bacbd3c0d57');
const db = new sdk.Databases(client);
const DB = 'vibecoding';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log('📦 Creating fl_portfolio + fl_gig_extras...\n');

  // 1. fl_portfolio
  console.log('1. fl_portfolio...');
  try {
    await db.createCollection(DB, 'fl_portfolio', 'FL Portfolio', [
      sdk.Permission.read(sdk.Role.any()),
      sdk.Permission.create(sdk.Role.users()),
      sdk.Permission.update(sdk.Role.users()),
      sdk.Permission.delete(sdk.Role.users()),
    ], false);
    console.log('   ✨ Created');
  } catch(e) { console.log('   ⏭️', e.code === 409 ? 'exists' : e.message); }
  await sleep(2000);

  for (const attr of [
    { key: 'user_id', size: 100, required: true },
    { key: 'image', size: 500 },
    { key: 'title', size: 200, required: true },
    { key: 'description', size: 500 },
    { key: 'link', size: 300 },
    { key: 'tags', size: 500 },
  ]) {
    try {
      await db.createStringAttribute(DB, 'fl_portfolio', attr.key, attr.size, attr.required || false);
      console.log(`   ✅ ${attr.key}`);
    } catch(e) { console.log(`   ⏭️ ${attr.key}`); }
    await sleep(1500);
  }
  await sleep(3000);
  try { await db.createIndex(DB, 'fl_portfolio', 'idx_user', 'key', ['user_id']); console.log('   📇 idx_user'); } catch(e) { console.log('   ⏭️ idx_user'); }

  // 2. fl_gig_extras (add-on options for gigs)
  console.log('\n2. fl_gig_extras...');
  try {
    await db.createCollection(DB, 'fl_gig_extras', 'FL Gig Extras', [
      sdk.Permission.read(sdk.Role.any()),
      sdk.Permission.create(sdk.Role.users()),
      sdk.Permission.update(sdk.Role.users()),
      sdk.Permission.delete(sdk.Role.users()),
    ], false);
    console.log('   ✨ Created');
  } catch(e) { console.log('   ⏭️', e.code === 409 ? 'exists' : e.message); }
  await sleep(2000);

  for (const attr of [
    { key: 'gig_id', size: 100, required: true },
    { key: 'title', size: 200, required: true },
    { key: 'description', size: 500 },
    { key: 'price', type: 'integer', default: 0 },
    { key: 'delivery_days_add', type: 'integer', default: 0 },
    { key: 'sort_order', type: 'integer', default: 0 },
  ]) {
    try {
      if (attr.type === 'integer') {
        await db.createIntegerAttribute(DB, 'fl_gig_extras', attr.key, attr.required || false, undefined, undefined, attr.default ?? null);
      } else {
        await db.createStringAttribute(DB, 'fl_gig_extras', attr.key, attr.size, attr.required || false);
      }
      console.log(`   ✅ ${attr.key}`);
    } catch(e) { console.log(`   ⏭️ ${attr.key}`); }
    await sleep(1500);
  }
  await sleep(3000);
  try { await db.createIndex(DB, 'fl_gig_extras', 'idx_gig', 'key', ['gig_id']); console.log('   📇 idx_gig'); } catch(e) { console.log('   ⏭️ idx_gig'); }

  console.log('\n✅ Done!');
}
main().catch(console.error);
