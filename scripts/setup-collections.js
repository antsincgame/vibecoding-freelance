#!/usr/bin/env node
/**
 * Setup Appwrite collections for VibeCoder Freelance
 * Run: node scripts/setup-collections.js
 * 
 * Requires env vars or edit constants below:
 */
const sdk = require('node-appwrite');

const ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://appwrite.vibecoding.by/v1';
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || '69aa2114000211b48e63';
const API_KEY = process.env.APPWRITE_API_KEY || 'standard_06b8634032f75c7d02d49e7a4add952c4183146ce5def3dc0f4a9df7e18307b29193788a0aa7694e6146ac3339a99eae5de4c3ce24b6a284e41f84dad5683cbc9a60ab5b18084171ad9b9a60d470bbce068b4ee21c8231467bd92bec43c9ed9dcfbe6e23f784c4c77e0c88beeacb60f4a7873f2baa936246a7aa4bacbd3c0d57';
const DB_ID = 'vibecoding';

const client = new sdk.Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new sdk.Databases(client);

// ============================================
// Collection Definitions
// ============================================
const collections = {
  fl_categories: {
    name: 'FL Categories',
    attributes: [
      { type: 'string', key: 'slug', size: 100, required: true },
      { type: 'string', key: 'name', size: 200, required: true },
      { type: 'string', key: 'icon', size: 50, required: false, default: 'Globe' },
      { type: 'integer', key: 'gig_count', required: false, default: 0 },
      { type: 'string', key: 'description', size: 500, required: false },
      { type: 'integer', key: 'sort_order', required: false, default: 0 },
    ],
    indexes: [
      { key: 'idx_slug', type: 'unique', attributes: ['slug'] },
      { key: 'idx_sort', type: 'key', attributes: ['sort_order'] },
    ],
  },

  fl_gigs: {
    name: 'FL Gigs',
    attributes: [
      { type: 'string', key: 'title', size: 300, required: true },
      { type: 'string', key: 'description', size: 5000, required: false },
      { type: 'string', key: 'short_description', size: 500, required: false },
      { type: 'string', key: 'image', size: 500, required: false },
      { type: 'string', key: 'images', size: 2000, required: false }, // JSON array
      { type: 'string', key: 'freelancer_id', size: 100, required: true },
      { type: 'string', key: 'freelancer_name', size: 200, required: false },
      { type: 'string', key: 'freelancer_avatar', size: 500, required: false },
      { type: 'string', key: 'freelancer_username', size: 100, required: false },
      { type: 'float', key: 'rating', required: false, default: 0 },
      { type: 'integer', key: 'review_count', required: false, default: 0 },
      { type: 'integer', key: 'orders_count', required: false, default: 0 },
      { type: 'string', key: 'tags', size: 1000, required: false }, // JSON array
      { type: 'string', key: 'category', size: 200, required: false },
      { type: 'string', key: 'category_slug', size: 100, required: false },
      { type: 'boolean', key: 'is_featured', required: false, default: false },
      { type: 'string', key: 'status', size: 20, required: false, default: 'active' },
      // Packages embedded as JSON (simpler than separate collection for MVP)
      { type: 'string', key: 'package_economy', size: 1000, required: false }, // JSON
      { type: 'string', key: 'package_standard', size: 1000, required: false },
      { type: 'string', key: 'package_premium', size: 1000, required: false },
    ],
    indexes: [
      { key: 'idx_freelancer', type: 'key', attributes: ['freelancer_id'] },
      { key: 'idx_category', type: 'key', attributes: ['category_slug'] },
      { key: 'idx_featured', type: 'key', attributes: ['is_featured'] },
      { key: 'idx_status', type: 'key', attributes: ['status'] },
      { key: 'idx_rating', type: 'key', attributes: ['rating'] },
      { key: 'idx_title_search', type: 'fulltext', attributes: ['title'] },
    ],
  },

  fl_orders: {
    name: 'FL Orders',
    attributes: [
      { type: 'string', key: 'gig_id', size: 100, required: true },
      { type: 'string', key: 'gig_title', size: 300, required: false },
      { type: 'string', key: 'buyer_id', size: 100, required: true },
      { type: 'string', key: 'seller_id', size: 100, required: true },
      { type: 'string', key: 'seller_name', size: 200, required: false },
      { type: 'string', key: 'seller_avatar', size: 500, required: false },
      { type: 'string', key: 'package_type', size: 20, required: false },
      { type: 'integer', key: 'price', required: true },
      { type: 'string', key: 'status', size: 30, required: false, default: 'new' },
      { type: 'string', key: 'requirements', size: 2000, required: false },
      { type: 'integer', key: 'delivery_days', required: false },
      { type: 'string', key: 'delivered_at', size: 50, required: false },
      { type: 'string', key: 'completed_at', size: 50, required: false },
    ],
    indexes: [
      { key: 'idx_buyer', type: 'key', attributes: ['buyer_id'] },
      { key: 'idx_seller', type: 'key', attributes: ['seller_id'] },
      { key: 'idx_status', type: 'key', attributes: ['status'] },
      { key: 'idx_gig', type: 'key', attributes: ['gig_id'] },
    ],
  },

  fl_reviews: {
    name: 'FL Reviews',
    attributes: [
      { type: 'string', key: 'gig_id', size: 100, required: true },
      { type: 'string', key: 'order_id', size: 100, required: false },
      { type: 'string', key: 'author_id', size: 100, required: true },
      { type: 'string', key: 'author_name', size: 200, required: false },
      { type: 'string', key: 'author_avatar', size: 500, required: false },
      { type: 'integer', key: 'rating', required: true },
      { type: 'string', key: 'text', size: 2000, required: false },
      { type: 'string', key: 'reply', size: 2000, required: false },
    ],
    indexes: [
      { key: 'idx_gig', type: 'key', attributes: ['gig_id'] },
      { key: 'idx_author', type: 'key', attributes: ['author_id'] },
    ],
  },

  fl_favorites: {
    name: 'FL Favorites',
    attributes: [
      { type: 'string', key: 'user_id', size: 100, required: true },
      { type: 'string', key: 'gig_id', size: 100, required: true },
    ],
    indexes: [
      { key: 'idx_user', type: 'key', attributes: ['user_id'] },
      { key: 'idx_gig', type: 'key', attributes: ['gig_id'] },
    ],
  },

  fl_conversations: {
    name: 'FL Conversations',
    attributes: [
      { type: 'string', key: 'participant_ids', size: 500, required: true }, // JSON array
      { type: 'string', key: 'order_id', size: 100, required: false },
      { type: 'string', key: 'last_message', size: 500, required: false },
      { type: 'string', key: 'last_message_at', size: 50, required: false },
      { type: 'string', key: 'participant_names', size: 500, required: false }, // JSON
      { type: 'string', key: 'participant_avatars', size: 1000, required: false }, // JSON
    ],
    indexes: [],
  },

  fl_messages: {
    name: 'FL Messages',
    attributes: [
      { type: 'string', key: 'conversation_id', size: 100, required: true },
      { type: 'string', key: 'sender_id', size: 100, required: true },
      { type: 'string', key: 'content', size: 5000, required: true },
      { type: 'string', key: 'type', size: 20, required: false, default: 'text' },
      { type: 'boolean', key: 'read', required: false, default: false },
    ],
    indexes: [
      { key: 'idx_conversation', type: 'key', attributes: ['conversation_id'] },
      { key: 'idx_sender', type: 'key', attributes: ['sender_id'] },
    ],
  },

  fl_profiles: {
    name: 'FL Profiles',
    attributes: [
      { type: 'string', key: 'user_id', size: 100, required: true },
      { type: 'string', key: 'username', size: 100, required: true },
      { type: 'string', key: 'name', size: 200, required: true },
      { type: 'string', key: 'avatar', size: 500, required: false },
      { type: 'string', key: 'title', size: 300, required: false },
      { type: 'float', key: 'rating', required: false, default: 0 },
      { type: 'integer', key: 'review_count', required: false, default: 0 },
      { type: 'integer', key: 'orders_completed', required: false, default: 0 },
      { type: 'string', key: 'response_time', size: 50, required: false },
      { type: 'boolean', key: 'is_online', required: false, default: false },
      { type: 'string', key: 'location', size: 200, required: false },
      { type: 'string', key: 'member_since', size: 50, required: false },
      { type: 'string', key: 'bio', size: 2000, required: false },
      { type: 'string', key: 'skills', size: 1000, required: false }, // JSON array
      { type: 'integer', key: 'success_rate', required: false, default: 0 },
      { type: 'string', key: 'level', size: 20, required: false, default: 'new' },
      { type: 'string', key: 'role', size: 20, required: false, default: 'freelancer' },
      { type: 'integer', key: 'balance', required: false, default: 0 },
    ],
    indexes: [
      { key: 'idx_user_id', type: 'unique', attributes: ['user_id'] },
      { key: 'idx_username', type: 'unique', attributes: ['username'] },
      { key: 'idx_level', type: 'key', attributes: ['level'] },
    ],
  },
};

// ============================================
// Setup Logic
// ============================================
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function getExistingCollections() {
  try {
    const res = await databases.listCollections(DB_ID, undefined, 100);
    return res.collections.reduce((acc, c) => { acc[c.$id] = c; return acc; }, {});
  } catch { return {}; }
}

async function getExistingAttributes(collectionId) {
  try {
    const res = await databases.listAttributes(DB_ID, collectionId, undefined, 100);
    return res.attributes.map(a => a.key);
  } catch { return []; }
}

async function createAttribute(collId, attr) {
  try {
    switch (attr.type) {
      case 'string':
        await databases.createStringAttribute(DB_ID, collId, attr.key, attr.size || 255, attr.required || false, attr.default || null);
        break;
      case 'integer':
        await databases.createIntegerAttribute(DB_ID, collId, attr.key, attr.required || false, undefined, undefined, attr.default ?? null);
        break;
      case 'float':
        await databases.createFloatAttribute(DB_ID, collId, attr.key, attr.required || false, undefined, undefined, attr.default ?? null);
        break;
      case 'boolean':
        await databases.createBooleanAttribute(DB_ID, collId, attr.key, attr.required || false, attr.default ?? null);
        break;
    }
    console.log(`  ✅ ${attr.key} (${attr.type})`);
  } catch (e) {
    if (e.code === 409) {
      console.log(`  ⏭️  ${attr.key} already exists`);
    } else {
      console.log(`  ❌ ${attr.key}: ${e.message}`);
    }
  }
}

async function createIndex(collId, idx) {
  try {
    await databases.createIndex(DB_ID, collId, idx.key, idx.type, idx.attributes);
    console.log(`  📇 Index ${idx.key}`);
  } catch (e) {
    if (e.code === 409) {
      console.log(`  ⏭️  Index ${idx.key} exists`);
    } else {
      console.log(`  ❌ Index ${idx.key}: ${e.message}`);
    }
  }
}

async function setupPermissions(collId) {
  try {
    await databases.updateCollection(DB_ID, collId, undefined, [
      sdk.Permission.read(sdk.Role.any()),
      sdk.Permission.create(sdk.Role.users()),
      sdk.Permission.update(sdk.Role.users()),
      sdk.Permission.delete(sdk.Role.users()),
    ], false);
    console.log(`  🔐 Permissions set`);
  } catch (e) {
    console.log(`  ❌ Permissions: ${e.message}`);
  }
}

async function main() {
  console.log('🚀 Setting up VibeCoder Freelance collections...\n');
  
  const existing = await getExistingCollections();

  for (const [collId, config] of Object.entries(collections)) {
    console.log(`\n📦 ${collId} (${config.name})`);

    // Create collection if doesn't exist
    if (!existing[collId]) {
      try {
        await databases.createCollection(DB_ID, collId, config.name, [
          sdk.Permission.read(sdk.Role.any()),
          sdk.Permission.create(sdk.Role.users()),
          sdk.Permission.update(sdk.Role.users()),
          sdk.Permission.delete(sdk.Role.users()),
        ], false);
        console.log(`  ✨ Created collection`);
      } catch (e) {
        if (e.code === 409) {
          console.log(`  Collection exists`);
        } else {
          console.log(`  ❌ ${e.message}`);
          continue;
        }
      }
    } else {
      console.log(`  Collection exists`);
      await setupPermissions(collId);
    }

    // Get existing attributes
    const existingAttrs = await getExistingAttributes(collId);

    // Create attributes
    for (const attr of config.attributes) {
      if (existingAttrs.includes(attr.key)) {
        console.log(`  ⏭️  ${attr.key} exists`);
        continue;
      }
      await createAttribute(collId, attr);
      await sleep(1500); // Appwrite needs time between attribute creation
    }

    // Wait for attributes to be ready
    await sleep(3000);

    // Create indexes
    for (const idx of config.indexes) {
      await createIndex(collId, idx);
      await sleep(2000);
    }
  }

  console.log('\n✅ Setup complete!');
}

main().catch(console.error);
