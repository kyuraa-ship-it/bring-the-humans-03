// Entry program for make.fun "Bring the humans with a TikTok ad"
// (bring-the-humans-03). Node 22, standard library only.
//
// The entry is the video itself: an original short vertical ad for
// make.fun, posted publicly on TikTok from a public account with the
// bounty's line and the play code in its caption. This program does one
// thing: it copies VIDEO.json from the repository root to the output
// directory, where the gate reads the video's address and reads the
// video's views from TikTok. Nothing this program writes is scored.
//
// Before copying, it checks VIDEO.json parses and names a TikTok video
// address, so a typo fails loudly here instead of silently at the gate.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const VIDEO_URL =
  /^https:\/\/(www\.|m\.)?tiktok\.com\/@[^/]+\/video\/[0-9]+\/?$/;
const VIDEO_URL_MOBILE =
  /^https:\/\/m\.tiktok\.com\/v\/[0-9]+\.html$/;

const videoPath = join(BOT_DIR, 'VIDEO.json');
let parsed: unknown;
try {
  parsed = JSON.parse(readFileSync(videoPath, 'utf8'));
} catch (err) {
  console.error(`VIDEO.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

if (
  typeof parsed !== 'object' ||
  parsed === null ||
  typeof (parsed as { url?: unknown }).url !== 'string' ||
  (!VIDEO_URL.test((parsed as { url: string }).url) &&
    !VIDEO_URL_MOBILE.test((parsed as { url: string }).url))
) {
  console.error('VIDEO.json must hold {"url": "https://www.tiktok.com/@<handle>/video/<id>"}');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });

try {
  copyFileSync(videoPath, join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

console.log(`VIDEO.json copied: ${(parsed as { url: string }).url}`);
