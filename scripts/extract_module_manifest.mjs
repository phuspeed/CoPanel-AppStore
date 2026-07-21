#!/usr/bin/env node
/**
 * Extract extension manifest fields from module config.ts (no TS execution).
 * Usage: node extract_module_manifest.mjs <config.ts> <module_id> [version]
 */
import fs from 'fs';

const [configPath, moduleId, version = '1.0.0'] = process.argv.slice(2);
if (!configPath || !moduleId) {
  console.error('Usage: node extract_module_manifest.mjs <config.ts> <module_id> [version]');
  process.exit(1);
}

const src = fs.readFileSync(configPath, 'utf8');

function strField(key) {
  const m = src.match(new RegExp(`${key}:\\s*['"\`]([^'"\`]+)['"\`]`));
  return m?.[1] ?? '';
}

function boolField(key) {
  const m = src.match(new RegExp(`${key}:\\s*(true|false)`));
  return m?.[1] === 'true';
}

function sizeField(key) {
  const m = src.match(new RegExp(`${key}:\\s*\\{\\s*width:\\s*(\\d+),\\s*height:\\s*(\\d+)\\s*\\}`));
  if (!m) return undefined;
  return { width: Number(m[1]), height: Number(m[2]) };
}

const manifest = {
  schema: 1,
  id: moduleId,
  name: strField('name') || moduleId,
  path: strField('path') || `/${moduleId}`,
  icon: strField('icon') || 'Grid',
  description: strField('description') || '',
  windowMode: boolField('windowMode'),
  keepMountedOnMinimize: boolField('keepMountedOnMinimize'),
  pinned: boolField('pinned'),
  core_ui: '1.1',
  version,
  component: 'default',
};

const windowSize = sizeField('defaultWindowSize');
if (windowSize) manifest.defaultWindowSize = windowSize;

process.stdout.write(JSON.stringify(manifest, null, 2) + '\n');
