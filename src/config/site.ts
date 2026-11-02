export interface SiteConfig {
  brand: { name: string; ticker: string; slogan: string };
  canonicalOrigin: string | null;
  token: {
    status: 'prelaunch' | 'live';
    networkLabel: 'Solana' | 'Ethereum' | 'Base' | null;
    contractAddress: string | null;
    tradeUrl: string | null;
    explorerUrl: string | null;
  };
  social: { xUrl: string | null; communityUrl: string | null };
  features: { datedNews: boolean };
}
export function validateSite(config: SiteConfig): SiteConfig {
  const urls = {
    canonicalOrigin: config.canonicalOrigin,
    tradeUrl: config.token.tradeUrl,
    explorerUrl: config.token.explorerUrl,
    ...config.social,
  };
  for (const [key, value] of Object.entries(urls)) {
    if (value === null) continue;
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      throw new Error(`${key} must be a valid HTTPS URL.`);
    }
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      /(^|\.)(example\.(com|org|net)|localhost)$/.test(url.hostname) ||
      /[{}<>]|undefined|null/.test(value) ||
      !url.hostname.includes('.')
    )
      throw new Error(
        `${key} must be a real public HTTPS URL without placeholders.`,
      );
    if (
      key === 'canonicalOrigin' &&
      (url.pathname !== '/' || url.search || url.hash)
    )
      throw new Error('canonicalOrigin must contain only the HTTPS origin.');
  }
  if (config.token.status === 'live') {
    const { networkLabel, contractAddress: address, tradeUrl } = config.token;
    if (!networkLabel || !address || !tradeUrl)
      throw new Error(
        'Live launch requires networkLabel, contractAddress and tradeUrl.',
      );
    let valid = false;
    if (networkLabel === 'Solana') {
      const alphabet =
        '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
        let n = 0n;
        for (const c of address) n = n * 58n + BigInt(alphabet.indexOf(c));
        let bytes = 0;
        while (n > 0n) {
          bytes++;
          n >>= 8n;
        }
        valid = bytes + (address.match(/^1*/)?.[0].length ?? 0) === 32;
      }
    } else if (networkLabel === 'Ethereum' || networkLabel === 'Base')
      valid = /^0x[0-9a-fA-F]{40}$/.test(address) && !/^0x0{40}$/.test(address);
    if (!valid || /^(.)\1+$/.test(address))
      throw new Error(
        `Invalid contractAddress syntax for ${networkLabel}. Verify the actual token separately.`,
      );
  }
  return config;
}
export const site = validateSite({
  brand: {
    name: 'FROZEN USD',
    ticker: '$FRZUSD',
    slogan: 'Frozen. Still moving.',
  },
  canonicalOrigin: null,
  token: {
    status: 'prelaunch',
    networkLabel: null,
    contractAddress: null,
    tradeUrl: null,
    explorerUrl: null,
  },
  social: { xUrl: null, communityUrl: null },
  features: { datedNews: true },
});
export function isIndexable(
  config: SiteConfig,
  environment: string | undefined,
) {
  return (
    config.token.status === 'live' &&
    !!config.canonicalOrigin &&
    environment === 'production'
  );
}
export const indexable = isIndexable(site, process.env.VERCEL_ENV);
