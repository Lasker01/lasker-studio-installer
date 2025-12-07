#!/usr/bin/env node

/**
 * Version Bump Script
 * Usage: node bump-version.js [major|minor|patch|<version>]
 *
 * Examples:
 *   node bump-version.js patch     # 1.0.0 -> 1.0.1
 *   node bump-version.js minor     # 1.0.0 -> 1.1.0
 *   node bump-version.js major     # 1.0.0 -> 2.0.0
 *   node bump-version.js 1.2.3     # Set specific version
 */

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const currentVersion = config.version;
const arg = process.argv[2];

if (!arg) {
  console.log('Current version:', currentVersion);
  console.log('');
  console.log('Usage: npm run version [major|minor|patch|<version>]');
  console.log('');
  console.log('Examples:');
  console.log('  npm run version patch    # Bump patch version');
  console.log('  npm run version minor    # Bump minor version');
  console.log('  npm run version major    # Bump major version');
  console.log('  npm run version 1.2.3    # Set specific version');
  process.exit(0);
}

function bumpVersion(version, type) {
  const parts = version.split('.').map(Number);

  switch (type) {
    case 'major':
      return `${parts[0] + 1}.0.0`;
    case 'minor':
      return `${parts[0]}.${parts[1] + 1}.0`;
    case 'patch':
      return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
    default:
      // Check if it's a valid semver
      if (/^\d+\.\d+\.\d+$/.test(type)) {
        return type;
      }
      console.error('Invalid version format. Use major, minor, patch, or x.y.z');
      process.exit(1);
  }
}

const newVersion = bumpVersion(currentVersion, arg);

// Update config.json
config.version = newVersion;
fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');

console.log('========================================');
console.log('  Version Updated');
console.log('========================================');
console.log('');
console.log(`  ${currentVersion} -> ${newVersion}`);
console.log('');
console.log('Updated files:');
console.log('  - config.json');
console.log('');
console.log('Next steps:');
console.log('  1. Commit changes: git add . && git commit -m "chore: bump version to ' + newVersion + '"');
console.log('  2. Create tag: git tag v' + newVersion);
console.log('  3. Push: git push && git push --tags');
console.log('');
