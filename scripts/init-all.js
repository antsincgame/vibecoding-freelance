#!/usr/bin/env node
/**
 * Full init for Freelance project on new Appwrite database.
 * Run: node scripts/init-all.js
 * 
 * Creates: database, collections, indexes, bucket, seed data
 */
const sdk = require('node-appwrite');

const ENDPOINT = 'https://appwrite.vibecoding.by/v1';
const PROJECT_ID = '69ab4e9d00342b2b9f9f';
const API_KEY = 'standard_ac07ab782ca017c0c46c029aa448ff921576b4b5decf8fd166ebdbb1c111351c635a03055648c2b69c234ec4e778f7ebff9d2495b1d230e2fb4c1b5e16b515669efef6b820b1382b746cacf6e2984a7650095d22e6fa3b3730b5153257650b0cd5ed192466b7ec79686e4ed0cac9ebff1136ff038c9db9489d32f7a3136182ed';
const DB_ID = 'freelance';

const client = new sdk.Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new sdk.Databases(client);
const storage = new sdk.Storage(client);

async function createDB() {
  console.log('📦 Creating database...');
  try {
    await databases.create(DB_ID, 'Freelance');
    console.log('  ✅ Database created');
  } catch (e) {
    if (e.code === 409) console.log('  ⏭️ Database exists');
    else console.log('  ❌', e.message);
  }
}

async function createBucket() {
  console.log('\n📦 Creating storage bucket...');
  try {
    await storage.createBucket('images', 'Images', [
      sdk.Permission.read(sdk.Role.any()),
      sdk.Permission.create(sdk.Role.users()),
      sdk.Permission.update(sdk.Role.users()),
      sdk.Permission.delete(sdk.Role.users()),
    ], false, true, 10 * 1024 * 1024, ['image/jpeg','image/png','image/webp','image/gif','image/svg+xml']);
    console.log('  ✅ Bucket created');
  } catch (e) {
    if (e.code === 409) console.log('  ⏭️ Bucket exists');
    else console.log('  ❌', e.message);
  }
}

const COLLECTIONS = {
  fl_categories: {
    name: 'FL Categories',
    attrs: [
      ['string', 'slug', 100, true], ['string', 'name', 200, true], ['string', 'icon', 50, false],
      ['string', 'description', 500, false], ['integer', 'gig_count', null, false],
      ['integer', 'sort_order', null, false],
    ],
    indexes: [['idx_slug', 'key', ['slug']]],
  },
  fl_gigs: {
    name: 'FL Gigs',
    attrs: [
      ['string', 'title', 300, true], ['string', 'description', 5000, false],
      ['string', 'short_description', 500, false], ['string', 'image', 500, false],
      ['string', 'images', 2000, false], ['string', 'freelancer_id', 100, true],
      ['string', 'freelancer_name', 200, false], ['string', 'freelancer_username', 100, false],
      ['float', 'rating', null, false], ['integer', 'review_count', null, false],
      ['integer', 'orders_count', null, false], ['string', 'tags', 500, false],
      ['string', 'category', 100, false], ['string', 'category_slug', 100, false],
      ['boolean', 'is_featured', null, false], ['string', 'status', 20, false],
      ['string', 'package_economy', 1000, false], ['string', 'package_standard', 1000, false],
      ['string', 'package_premium', 1000, false], ['string', 'rejection_reason', 300, false],
      ['string', 'moderated_by', 50, false], ['string', 'moderated_at', 30, false],
    ],
    indexes: [
      ['idx_freelancer', 'key', ['freelancer_id']], ['idx_category', 'key', ['category_slug']],
      ['idx_status', 'key', ['status']], ['idx_featured', 'key', ['is_featured']],
      ['idx_rating', 'key', ['rating']], ['idx_title_search', 'fulltext', ['title']],
    ],
  },
  fl_orders: {
    name: 'FL Orders',
    attrs: [
      ['string', 'gig_id', 100, true], ['string', 'gig_title', 300, false],
      ['string', 'buyer_id', 100, true], ['string', 'client_id', 100, true],
      ['string', 'seller_id', 100, true], ['string', 'seller_name', 200, false],
      ['string', 'seller_avatar', 500, false], ['string', 'package_type', 20, false],
      ['integer', 'price', null, true], ['string', 'status', 30, false],
      ['string', 'requirements', 2000, false], ['integer', 'delivery_days', null, false],
      ['string', 'delivered_at', 50, false], ['string', 'completed_at', 50, false],
    ],
    indexes: [
      ['idx_buyer', 'key', ['buyer_id']], ['idx_seller', 'key', ['seller_id']],
      ['idx_status', 'key', ['status']], ['idx_gig', 'key', ['gig_id']],
    ],
  },
  fl_reviews: {
    name: 'FL Reviews',
    attrs: [
      ['string', 'gig_id', 100, true], ['string', 'order_id', 100, false],
      ['string', 'author_id', 100, true], ['string', 'author_name', 200, false],
      ['string', 'author_avatar', 500, false], ['integer', 'rating', null, true],
      ['string', 'text', 2000, false], ['string', 'reply', 2000, false],
    ],
    indexes: [['idx_gig', 'key', ['gig_id']]],
  },
  fl_favorites: {
    name: 'FL Favorites',
    attrs: [['string', 'user_id', 100, true], ['string', 'gig_id', 100, true]],
    indexes: [['idx_user', 'key', ['user_id']], ['idx_gig', 'key', ['gig_id']]],
  },
  fl_conversations: {
    name: 'FL Conversations',
    attrs: [
      ['string', 'participant_ids', 500, true], ['string', 'order_id', 100, false],
      ['string', 'last_message', 500, false], ['string', 'last_message_at', 50, false],
      ['string', 'participant_names', 500, false], ['string', 'participant_avatars', 1000, false],
    ],
    indexes: [],
  },
  fl_messages: {
    name: 'FL Messages',
    attrs: [
      ['string', 'conversation_id', 100, true], ['string', 'sender_id', 100, true],
      ['string', 'content', 5000, true], ['string', 'type', 20, false],
      ['boolean', 'read', null, false],
    ],
    indexes: [['idx_conv', 'key', ['conversation_id']]],
  },
  fl_profiles: {
    name: 'FL Profiles',
    attrs: [
      ['string', 'user_id', 100, true], ['string', 'username', 100, true],
      ['string', 'name', 200, true], ['string', 'avatar', 500, false],
      ['string', 'title', 200, false], ['string', 'bio', 2000, false],
      ['string', 'location', 100, false], ['string', 'skills', 1000, false],
      ['string', 'role', 20, false], ['string', 'level', 20, false],
      ['float', 'rating', null, false], ['integer', 'review_count', null, false],
      ['integer', 'orders_completed', null, false], ['string', 'response_time', 50, false],
      ['boolean', 'is_online', null, false], ['string', 'member_since', 50, false],
      ['integer', 'success_rate', null, false], ['integer', 'balance', null, false],
      ['boolean', 'is_verified', null, false],
    ],
    indexes: [['idx_user', 'key', ['user_id']], ['idx_username', 'key', ['username']]],
  },
  fl_tickets: {
    name: 'FL Tickets',
    attrs: [
      ['string', 'user_id', 100, true], ['string', 'user_name', 200, false],
      ['string', 'user_email', 200, false], ['string', 'subject', 300, false],
      ['string', 'category', 50, false], ['string', 'status', 20, false],
      ['string', 'priority', 20, false], ['string', 'related_id', 100, false],
      ['string', 'assigned_to', 100, false], ['string', 'closed_at', 50, false],
    ],
    indexes: [['idx_user', 'key', ['user_id']], ['idx_status', 'key', ['status']]],
  },
  fl_ticket_messages: {
    name: 'FL Ticket Messages',
    attrs: [
      ['string', 'ticket_id', 100, true], ['string', 'sender_id', 100, false],
      ['string', 'sender_name', 200, false], ['string', 'message', 5000, false],
      ['boolean', 'is_admin', null, false],
    ],
    indexes: [['idx_ticket', 'key', ['ticket_id']]],
  },
  fl_projects: {
    name: 'FL Projects',
    attrs: [
      ['string', 'user_id', 100, true], ['string', 'user_name', 200, false],
      ['string', 'user_avatar', 300, false], ['string', 'title', 300, true],
      ['string', 'description', 3000, false], ['string', 'category', 100, false],
      ['string', 'status', 20, false], ['integer', 'budget_from', null, false],
      ['integer', 'budget_to', null, false], ['integer', 'deadline_days', null, false],
      ['integer', 'responses_count', null, false],
    ],
    indexes: [['idx_user', 'key', ['user_id']], ['idx_status', 'key', ['status']]],
  },
  fl_portfolio: {
    name: 'FL Portfolio',
    attrs: [
      ['string', 'user_id', 100, true], ['string', 'image', 500, false],
      ['string', 'title', 200, true], ['string', 'description', 500, false],
      ['string', 'link', 300, false], ['string', 'tags', 500, false],
    ],
    indexes: [['idx_user', 'key', ['user_id']]],
  },
  fl_gig_extras: {
    name: 'FL Gig Extras',
    attrs: [
      ['string', 'gig_id', 100, true], ['string', 'title', 200, true],
      ['string', 'description', 500, false], ['integer', 'price', null, false],
      ['integer', 'delivery_days_add', null, false], ['integer', 'sort_order', null, false],
    ],
    indexes: [['idx_gig', 'key', ['gig_id']]],
  },
};

async function createCollections() {
  for (const [id, config] of Object.entries(COLLECTIONS)) {
    console.log(`\n📦 ${id} (${config.name})`);
    
    // Create collection
    try {
      await databases.createCollection(DB_ID, id, config.name, [
        sdk.Permission.read(sdk.Role.any()),
        sdk.Permission.create(sdk.Role.users()),
        sdk.Permission.update(sdk.Role.users()),
        sdk.Permission.delete(sdk.Role.users()),
      ], false);
      console.log('  ✅ Collection created');
    } catch (e) {
      if (e.code === 409) console.log('  ⏭️ Collection exists');
      else { console.log('  ❌', e.message); continue; }
    }

    // Create attributes
    for (const attr of config.attrs) {
      const [type, key, size, required] = attr;
      try {
        if (type === 'string') await databases.createStringAttribute(DB_ID, id, key, size, required || false);
        else if (type === 'integer') await databases.createIntegerAttribute(DB_ID, id, key, required || false);
        else if (type === 'float') await databases.createFloatAttribute(DB_ID, id, key, required || false);
        else if (type === 'boolean') await databases.createBooleanAttribute(DB_ID, id, key, required || false);
        console.log(`  ✅ ${key}`);
      } catch (e) {
        if (e.code === 409) console.log(`  ⏭️ ${key}`);
        else console.log(`  ❌ ${key}: ${e.message?.slice(0, 60)}`);
      }
    }

    // Wait for attributes to be ready
    await new Promise(r => setTimeout(r, 2000));

    // Create indexes
    for (const [idxKey, idxType, idxAttrs] of config.indexes) {
      try {
        await databases.createIndex(DB_ID, id, idxKey, idxType, idxAttrs);
        console.log(`  🔑 ${idxKey}`);
      } catch (e) {
        if (e.code === 409) console.log(`  ⏭️ ${idxKey}`);
        else console.log(`  ⚠️ ${idxKey}: ${e.message?.slice(0, 60)}`);
      }
    }
  }
}

async function main() {
  console.log('🚀 Initializing Freelance database\n');
  console.log(`  Endpoint: ${ENDPOINT}`);
  console.log(`  Project:  ${PROJECT_ID}`);
  console.log(`  Database: ${DB_ID}\n`);

  await createDB();
  await createBucket();
  await createCollections();

  console.log('\n\n✅ Init complete! Now run:');
  console.log('   node scripts/seed-rich.js   — to populate demo data');
}

main().catch(console.error);
