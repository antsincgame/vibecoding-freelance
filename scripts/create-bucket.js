#!/usr/bin/env node
const sdk = require('node-appwrite');
const client = new sdk.Client()
  .setEndpoint('https://appwrite.vibecoding.by/v1')
  .setProject('69aa2114000211b48e63')
  .setKey('standard_06b8634032f75c7d02d49e7a4add952c4183146ce5def3dc0f4a9df7e18307b29193788a0aa7694e6146ac3339a99eae5de4c3ce24b6a284e41f84dad5683cbc9a60ab5b18084171ad9b9a60d470bbce068b4ee21c8231467bd92bec43c9ed9dcfbe6e23f784c4c77e0c88beeacb60f4a7873f2baa936246a7aa4bacbd3c0d57');
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
