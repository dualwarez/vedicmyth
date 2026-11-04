#!/usr/bin/env node
/**
 * Corpus guard.
 *
 * Enforces steering/sources.md at build time and on every save (Kiro hook).
 * A claim that cannot prove its provenance does not reach the site.
 *
 * Exit 0 = every non-draft claim is publishable.
 * Exit 1 = at least one violation, printed with file and field.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';

const ROOT = process.cwd();
const CLAIMS_DIR = join(ROOT, 'data', 'claims');
const SOURCES_FILE = join(ROOT, 'data', 'sources.json');

const ALLOWED_TIERS = new Set([1, 2]);
const TWELVE_MONTHS_MS = 365 * 24 * 60 * 60 * 1000;

/** Domains that can never be evidence, regardless of what the record claims. */
const BLOCKED_DOMAINS = [
  'medium.com', 'linkedin.com', 'facebook.com', 'instagram.com', 'x.com', 'twitter.com',
  'youtube.com', 'reddit.com', 'quora.com', 'blogspot.com', 'wordpress.com',
  'wikipedia.org', 'webmd.com', 'healthline.com', 'verywellhealth.com',
  'timesofindia.', 'hindustantimes.', 'ndtv.', 'indianexpress.', 'thehindu.',
  'prnewswire.', 'businesswire.', 'einpresswire.',
];

/** Domains that are acceptable only as Tier 1 or Tier 2 public-health sources. */
const TRUSTED_DOMAINS = [
  'who.int', 'icmr.gov.in', 'ayush.gov.in', 'nice.org.uk', 'uspreventiveservicestaskforce.org',
  'nhs.uk', 'cochrane.org', 'cochranelibrary.com', 'nih.gov', 'ncbi.nlm.nih.gov',
  'pubmed.ncbi.nlm.nih.gov', 'clinicaltrials.gov', 'ctri.nic.in', 'isrctn.com',
  'efsa.europa.eu', 'nhmrc.gov.au', 'nccih.nih.gov', 'ipc.gov.in',
];

const errors = [];
const warnings = [];

function fail(file, field, message) {
  errors.push(`${file} :: ${field} :: ${message}`);
}

function isTrusted(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return TRUSTED_DOMAINS.some((d) => host === d || host.endsWith('.' + d) || host.includes(d));
  } catch {
    return false;
  }
}

function isBlocked(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return BLOCKED_DOMAINS.some((d) => host.includes(d));
  } catch {
    return true; // unparseable url is not a source
  }
}

function checkCitation(file, path, cite) {
  if (!cite || typeof cite !== 'object') return fail(file, path, 'citation must be an object');
  if (!cite.source) fail(file, path + '.source', 'missing source name');
  if (!Number.isInteger(cite.tier)) fail(file, path + '.tier', 'missing integer tier');
  else if (!ALLOWED_TIERS.has(cite.tier)) fail(file, path + '.tier', `tier ${cite.tier} is not evidence (only 1 and 2 allowed)`);
  if (!cite.url) fail(file, path + '.url', 'missing url');
  else {
    if (isBlocked(cite.url)) fail(file, path + '.url', `blocked domain: ${cite.url}`);
    else if (!isTrusted(cite.url)) fail(file, path + '.url', `not on the allowlist: ${cite.url}`);
  }
  if (!cite.year) fail(file, path + '.year', 'missing year');
  if (!cite.locator) fail(file, path + '.locator', 'missing locator (verse id, section, or study id)');
}

function checkClaim(file, claim) {
  if (!claim.id) return fail(file, 'id', 'missing id');
  if (!claim.depth) fail(file, 'depth', 'missing depth (verse-level | curated)');
  if (typeof claim.draft !== 'boolean') fail(file, 'draft', 'draft must be true or false');
  if (!['myth', 'fact', 'mixed', 'unverified'].includes(claim.verdict)) {
    fail(file, 'verdict', 'must be myth | fact | mixed | unverified');
  }

  if (!claim.claim || !claim.claim.canonical) fail(file, 'claim.canonical', 'missing canonical claim text');
  if (!Array.isArray(claim.claim?.variants) || claim.claim.variants.length === 0) {
    fail(file, 'claim.variants', 'need at least one variant phrasing');
  }

  for (const layer of ['text', 'practice', 'evidence']) {
    if (!claim[layer]) fail(file, layer, 'missing layer');
  }
  if (claim.text && !['supports', 'contradicts', 'silent'].includes(claim.text.verdict)) {
    fail(file, 'text.verdict', 'must be supports | contradicts | silent');
  }
  if (claim.practice && !['recommended', 'conditional', 'not-recommended'].includes(claim.practice.verdict)) {
    fail(file, 'practice.verdict', 'must be recommended | conditional | not-recommended');
  }

  // A draft may be incomplete; a publishable claim may not.
  if (claim.draft === true) {
    warnings.push(`${file} :: draft, excluded from build`);
    return;
  }

  if (!claim.lastVerified || Number.isNaN(Date.parse(claim.lastVerified))) {
    fail(file, 'lastVerified', 'missing or invalid ISO date');
  } else if (Date.now() - Date.parse(claim.lastVerified) > TWELVE_MONTHS_MS) {
    warnings.push(`${file} :: source older than 12 months, will render an aging-source warning`);
  }

  const citations = claim.text?.citations ?? [];
  if (claim.text?.verdict !== 'silent' && citations.length === 0) {
    fail(file, 'text.citations', 'text verdict needs at least one citation');
  }
  citations.forEach((c, i) => checkCitation(file, `text.citations[${i}]`, c));

  if (claim.text?.verdict === 'supports' && claim.practice?.verdict === 'not-recommended') {
    if (!claim.practice.whyNot) {
      fail(file, 'practice.whyNot', 'supports + not-recommended must explain why not');
    }
  }

  (claim.evidence?.studies ?? []).forEach((s, i) => checkCitation(file, `evidence.studies[${i}]`, s));
  if (!claim.recommendation) fail(file, 'recommendation', 'missing one-line recommendation');
}

// --- run -------------------------------------------------------------------

if (!existsSync(CLAIMS_DIR)) {
  console.error(`No claims directory at ${CLAIMS_DIR}`);
  process.exit(1);
}

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));

if (existsSync(SOURCES_FILE)) {
  try {
    readJson(SOURCES_FILE);
  } catch (e) {
    errors.push(`data/sources.json :: ${e.message}`);
  }
} else {
  warnings.push('data/sources.json missing — allowlist comes from steering doc only');
}

const files = readdirSync(CLAIMS_DIR).filter((f) => f.endsWith('.json'));
for (const file of files) {
  const full = join(CLAIMS_DIR, file);
  let claim;
  try {
    claim = readJson(full);
  } catch (e) {
    fail(file, '-', `invalid JSON: ${e.message}`);
    continue;
  }
  checkClaim(basename(file), claim);
}

for (const w of warnings) console.warn('warn  ' + w);
for (const e of errors) console.error('ERROR ' + e);

console.log(`\n${files.length} claim file(s), ${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length > 0 ? 1 : 0);
