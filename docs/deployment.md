# GitHub-to-Vercel handoff

This repository was initially empty. The implementation uses its assigned `work` branch; there was no existing base branch for a pull request. The delivery report identifies the actual pushed commit. No force push or unrelated repository changes are part of this workflow.

1. In Vercel, select the intended account/team. Check whether a project already imports `Pluviophile84/frzusd`; reuse it if present.
2. Otherwise use **Add New → Project**, authorize the Vercel GitHub integration for this exact repository, and import it.
3. Choose Astro, repository root, Node.js 24.x, install `npm ci`, build `npm run build`, output `dist`. No secrets or custom environment variables are needed.
4. Set the Git production branch to `work` for this initial delivery. If your policy requires `main`, first merge the checked source through GitHub and select that branch. Do not run a separate CLI deployment pipeline.
5. Deploy through the Git integration. Verify build logs and the actual generated deployment URL.
6. Check homepage, poster downloads, navigation, mobile menu, social image at `/media/social.png`, and an unknown route returning the designed 404. Confirm pre-launch is noindex and contains no trade/copy controls.
7. Attach the verified domain in Vercel. Set `canonicalOrigin` in the source when known; the site remains noindex until live. Use the launch checklist before activating token links.

No connected Vercel tool was available in this task. Account/team selection, project linking, remote build status, DNS and deployed-URL testing remain external steps. This document supplies exact import settings; it does not claim deployment occurred. No personal terminal is required for the owner: import, repository edits and subsequent Git-triggered deployment can all be handled in GitHub/Vercel's browser interfaces.
