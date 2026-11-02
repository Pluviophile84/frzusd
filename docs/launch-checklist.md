# Launch checklist

- Verify actual network, token contract/mint and permissions independently. Syntax validation is not an on-chain audit.
- Edit `src/config/site.ts`: `token.status`, `networkLabel`, `contractAddress`, `tradeUrl`, `explorerUrl`; add verified `canonicalOrigin` and optional official social URLs.
- Confirm the Binance dated source is accessible and supports the supplied attribution. Network policy prevented independent source retrieval in this session. Keep the date and distinction between frozen and recovered assets; `features.datedNews=false` removes the note if required.
- Run `npm ci`, `npm run check`, `npm test` (includes production build).
- Review live UI with the real values: full address, Copy success/failure, Explorer, trading destinations, social links. Test fixtures are not launch values.
- Commit through GitHub; let Vercel Git integration rebuild. No secrets are required.
- Verify deployed mobile/desktop layouts, downloads, custom 404, title/social card and canonical origin.
- Confirm production is indexable only when live with a verified canonical; preview deployments must remain noindex.
- Recheck mobile performance against the real deployed URL. Local lab measurements are not field performance.
