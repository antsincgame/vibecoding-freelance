#!/usr/bin/env node
/**
 * Add fl_tickets collection + moderation fields
 * Run: node scripts/migrate-moderation.js
 */
const sdk = require('node-appwrite');

const ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://appwrite.vibecoding.by/v1';
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || '69ab4e9d00342b2b9f9f';
const API_KEY = process.env.APPWRITE_API_KEY || 'standard_ac07ab782ca017c0c46c029aa448ff921576b4b5decf8fd166ebdbb1c111351c635a03055648c2b69c234ec4e778f7ebff9d2495b1d230e2fb4c1b5e16b515669efef6b820b1382b746cacf6e2984a7650095d22e6fa3b3730b5153257650b0cd5ed192466b7ec79686e4ed0cac9ebff1136ff038c9db9489d32f7a3136182ed';
const DB_ID = 'freelance';

const client = new sdk.Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new sdk.Databases(client);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log('🔧 Migration: moderation + tickets\n');

  // 1. Add rejection_reason to fl_gigs
  console.log('📦 fl_gigs — adding moderation fields...');
  try {
    await databases.createStringAttribute(DB_ID, 'fl_gigs', 'rejection_reason', 500, false);
    console.log('  ✅ rejection_reason');
  } catch (e) { console.log('  ⏭️  rejection_reason:', e.message?.includes('exists') ? 'exists' : e.message); }
  await sleep(1500);

  try {
    await databases.createStringAttribute(DB_ID, 'fl_gigs', 'moderated_by', 100, false);
    console.log('  ✅ moderated_by');
  } catch (e) { console.log('  ⏭️  moderated_by:', e.message?.includes('exists') ? 'exists' : e.message); }
  await sleep(1500);

  try {
    await databases.createStringAttribute(DB_ID, 'fl_gigs', 'moderated_at', 50, false);
    console.log('  ✅ moderated_at');
  } catch (e) { console.log('  ⏭️  moderated_at:', e.message?.includes('exists') ? 'exists' : e.message); }
  await sleep(1500);

  // 2. Create fl_tickets collection
  console.log('\n📦 fl_tickets — creating collection...');
  try {
    await databases.createCollection(DB_ID, 'fl_tickets', 'FL Tickets', [
      sdk.Permission.read(sdk.Role.any()),
      sdk.Permission.create(sdk.Role.users()),
      sdk.Permission.update(sdk.Role.users()),
      sdk.Permission.delete(sdk.Role.users()),
    ], false);
    console.log('  ✨ Created');
  } catch (e) {
    if (e.code === 409) console.log('  ⏭️  Collection exists');
    else { console.log('  ❌', e.message); return; }
  }

  await sleep(2000);

  const attrs = [
    { type: 'string', key: 'user_id', size: 100, required: true },
    { type: 'string', key: 'user_name', size: 200, required: false },
    { type: 'string', key: 'user_email', size: 200, required: false },
    { type: 'string', key: 'subject', size: 300, required: true },
    { type: 'string', key: 'category', size: 50, required: false, default: 'general' },
    { type: 'string', key: 'status', size: 20, required: false, default: 'open' },
    { type: 'string', key: 'priority', size: 20, required: false, default: 'normal' },
    { type: 'string', key: 'related_id', size: 100, required: false },
    { type: 'string', key: 'assigned_to', size: 100, required: false },
    { type: 'string', key: 'closed_at', size: 50, required: false },
  ];

  for (const attr of attrs) {
    try {
      await databases.createStringAttribute(DB_ID, 'fl_tickets', attr.key, attr.size || 255, attr.required || false, attr.default || null);
      console.log(`  ✅ ${attr.key}`);
    } catch (e) {
      console.log(`  ⏭️  ${attr.key}: ${e.message?.includes('exists') ? 'exists' : e.message}`);
    }
    await sleep(1500);
  }

  await sleep(3000);

  // Indexes
  const indexes = [
    { key: 'idx_user', type: 'key', attributes: ['user_id'] },
    { key: 'idx_status', type: 'key', attributes: ['status'] },
    { key: 'idx_category', type: 'key', attributes: ['category'] },
  ];

  for (const idx of indexes) {
    try {
      await databases.createIndex(DB_ID, 'fl_tickets', idx.key, idx.type, idx.attributes);
      console.log(`  📇 ${idx.key}`);
    } catch (e) {
      console.log(`  ⏭️  ${idx.key}: ${e.message?.includes('exists') ? 'exists' : e.message}`);
    }
    await sleep(2000);
  }

  // 3. Create fl_ticket_messages collection
  console.log('\n📦 fl_ticket_messages — creating collection...');
  try {
    await databases.createCollection(DB_ID, 'fl_ticket_messages', 'FL Ticket Messages', [
      sdk.Permission.read(sdk.Role.any()),
      sdk.Permission.create(sdk.Role.users()),
      sdk.Permission.update(sdk.Role.users()),
      sdk.Permission.delete(sdk.Role.users()),
    ], false);
    console.log('  ✨ Created');
  } catch (e) {
    if (e.code === 409) console.log('  ⏭️  Collection exists');
    else { console.log('  ❌', e.message); return; }
  }

  await sleep(2000);

  const msgAttrs = [
    { type: 'string', key: 'ticket_id', size: 100, required: true },
    { type: 'string', key: 'sender_id', size: 100, required: true },
    { type: 'string', key: 'sender_name', size: 200, required: false },
    { type: 'string', key: 'message', size: 5000, required: true },
    { type: 'boolean', key: 'is_admin', required: false, default: false },
  ];

  for (const attr of msgAttrs) {
    try {
      if (attr.type === 'boolean') {
        await databases.createBooleanAttribute(DB_ID, 'fl_ticket_messages', attr.key, attr.required || false, attr.default ?? null);
      } else {
        await databases.createStringAttribute(DB_ID, 'fl_ticket_messages', attr.key, attr.size || 255, attr.required || false, attr.default || null);
      }
      console.log(`  ✅ ${attr.key}`);
    } catch (e) {
      console.log(`  ⏭️  ${attr.key}: ${e.message?.includes('exists') ? 'exists' : e.message}`);
    }
    await sleep(1500);
  }

  await sleep(3000);

  try {
    await databases.createIndex(DB_ID, 'fl_ticket_messages', 'idx_ticket', 'key', ['ticket_id']);
    console.log('  📇 idx_ticket');
  } catch (e) { console.log(`  ⏭️  idx_ticket`); }

  console.log('\n✅ Migration complete!');
}

main().catch(console.error);
