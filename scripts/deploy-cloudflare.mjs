import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const token = process.env.CLOUDFLARE_API_TOKEN;
const account = process.env.CLOUDFLARE_ACCOUNT_ID;
const project = process.env.CLOUDFLARE_PAGES_PROJECT || 'cvonline';
if (!token || !account) throw new Error('Set CLOUDFLARE_API_TOKEN securely and CLOUDFLARE_ACCOUNT_ID before deploying.');
if (!/^[a-f\d]{32}$/i.test(account)) throw new Error('CLOUDFLARE_ACCOUNT_ID must be the 32-character Account ID, not an API token.');
if (!/^[a-z\d][a-z\d-]{0,57}[a-z\d]$/.test(project)) throw new Error('Use a valid lowercase Cloudflare Pages project name.');
const environment = {
  ...process.env,
  CI: 'true',
  NPM_CONFIG_CACHE: process.env.NPM_CONFIG_CACHE || '/tmp/cvonline-npm-cache',
  WRANGLER_LOG_PATH: process.env.WRANGLER_LOG_PATH || '/tmp/cvonline-wrangler.log',
  WRANGLER_SEND_METRICS: 'false',
};
function run(command, args, capture = false, extraEnv = {}) {
  const result = spawnSync(command, args, { cwd: root, env: { ...environment, ...extraEnv }, encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    if (capture) console.error(((result.stderr || '') + (result.stdout || '')).split(token).join('[redacted]'));
    throw new Error(`${command} failed with exit code ${result.status}.`);
  }
  return result.stdout?.trim() || '';
}
function wrangler(args, capture = false) {
  return run('npm', ['exec', '--yes', '--package=wrangler@4.149.0', '--', 'wrangler', ...args], capture);
}
function projects() {
  return JSON.parse(wrangler(['pages', 'project', 'list', '--json'], true));
}
let entry = projects().find(item => item['Project Name'] === project);
if (!entry) {
  console.log(`Creating Pages project ${project} using Direct Upload. GitHub keeps the source; future uploads use this command.`);
  wrangler(['pages', 'project', 'create', project, '--production-branch', 'main', '--force']);
  entry = projects().find(item => item['Project Name'] === project);
}
const domains = String(entry?.['Project Domains'] || '').split(',').map(value => value.trim());
const domain = domains.find(value => /^[a-z\d-]+\.pages\.dev$/.test(value));
if (!domain) throw new Error('Cloudflare did not report a valid pages.dev domain; no deployment was uploaded.');
const site = process.env.VITE_SITE_URL || `https://${domain}`;
run('npm', ['run', 'build'], false, { VITE_SITE_URL: site });
const commit = run('git', ['rev-parse', '--verify', 'HEAD^{commit}'], true);
const dirty = !!run('git', ['status', '--porcelain'], true);
wrangler(['pages', 'deploy', 'dist', '--project-name', project, '--branch', 'main', '--commit-hash', commit, `--commit-dirty=${dirty}`]);
console.log(`Production site: https://${domain}`);
