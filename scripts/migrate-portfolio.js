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
