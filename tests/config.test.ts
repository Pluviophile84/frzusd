import test from 'node:test';
import assert from 'node:assert/strict';
import { site, validateSite, isIndexable } from '../src/config/site.ts';
import type { SiteConfig } from '../src/config/site.ts';
const live = (): SiteConfig => ({
  ...structuredClone(site),
  canonicalOrigin: 'https://frozen.test',
  token: {
    status: 'live',
    networkLabel: 'Solana',
    contractAddress: 'So11111111111111111111111111111111111111112',
    tradeUrl:
      'https://pump.fun/coin/So11111111111111111111111111111111111111112',
    explorerUrl:
      'https://solscan.io/token/So11111111111111111111111111111111111111112',
  },
});
test('default configuration is truthful prelaunch with no destinations', () => {
  assert.equal(validateSite(site).token.status, 'prelaunch');
  assert.equal(site.token.contractAddress, null);
  assert.equal(site.token.tradeUrl, null);
  assert.equal(site.social.xUrl, null);
});
test('complete live Solana configuration validates', () =>
  assert.equal(validateSite(live()).token.status, 'live'));
test('incomplete live fields fail individually', () => {
  for (const key of ['networkLabel', 'contractAddress', 'tradeUrl'] as const) {
    const config = live();
    config.token[key] = null;
    assert.throws(() => validateSite(config), /requires/);
  }
});
test('invalid Solana alphabet, length and decoded length are rejected', () => {
  for (const address of [
    'placeholder',
    '0'.repeat(44),
    'z'.repeat(44),
    '1'.repeat(32),
    '12345',
  ]) {
    const config = live();
    config.token.contractAddress = address;
    assert.throws(() => validateSite(config), /Invalid/);
  }
});
test('EVM syntax is validated separately', () => {
  const config = live();
  config.token.networkLabel = 'Ethereum';
  assert.throws(() => validateSite(config), /Invalid/);
  config.token.contractAddress = '0x1234567890123456789012345678901234567890';
  assert.doesNotThrow(() => validateSite(config));
  config.token.contractAddress = '0x' + '0'.repeat(40);
  assert.throws(() => validateSite(config), /Invalid/);
});
test('unsafe, placeholder and malformed optional URLs fail', () => {
  for (const value of [
    'http://x.com/frozen',
    'javascript:alert(1)',
    '#',
    'https://example.com',
    'https://user:pass@x.com',
    'https://x.com/{handle}',
  ]) {
    const config = structuredClone(site);
    config.social.xUrl = value;
    assert.throws(() => validateSite(config), /HTTPS/);
  }
});
test('canonical must be an origin', () => {
  const config = live();
  config.canonicalOrigin = 'https://frozen.test/path';
  assert.throws(() => validateSite(config), /origin/);
});
test('only live production with canonical can be indexed', () => {
  assert.equal(isIndexable(site, 'production'), false);
  assert.equal(isIndexable(live(), 'preview'), false);
  assert.equal(isIndexable(live(), undefined), false);
  assert.equal(isIndexable(live(), 'production'), true);
});
