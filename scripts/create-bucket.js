#!/usr/bin/env node
const sdk = require('node-appwrite');
const client = new sdk.Client()
  .setEndpoint('https://appwrite.vibecoding.by/v1')
  .setProject('69ab4e9d00342b2b9f9f')
  .setKey('standard_ac07ab782ca017c0c46c029aa448ff921576b4b5decf8fd166ebdbb1c111351c635a03055648c2b69c234ec4e778f7ebff9d2495b1d230e2fb4c1b5e16b515669efef6b820b1382b746cacf6e2984a7650095d22e6fa3b3730b5153257650b0cd5ed192466b7ec79686e4ed0cac9ebff1136ff038c9db9489d32f7a3136182ed');
const storage = new sdk.Storage(client);

async function main() {
  console.log('📦 Creating storage bucket "images"...\n');
  try {
    await storage.createBucket(
      'images',
      'Images',
      [
        sdk.Permission.read(sdk.Role.any()),
        sdk.Permission.create(sdk.Role.users()),
        sdk.Permission.update(sdk.Role.users()),
        sdk.Permission.delete(sdk.Role.users()),
      ],
      false,           // fileSecurity
      true,            // enabled
      10 * 1024 * 1024, // 10MB max file size
      ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
      'none',          // compression
      false,           // encryption
      false            // antivirus
    );
    console.log('✅ Bucket "images" created!');
  } catch(e) {
    if (e.code === 409) console.log('⏭️  Bucket "images" already exists');
    else console.log('❌', e.message);
  }
}
main().catch(console.error);
