/**
 * Vercel project bootstrap script
 *
 * Creates/updates a Vercel Project via the REST API and sets environment variables.
 *
 * Requirements (env):
 * - VERCEL_TOKEN (required) — Personal token from Vercel (Account Settings → Tokens)
 * - VERCEL_TEAM_ID (required for team projects) — Team ID (Team → Settings → General)
 * - VERCEL_PROJECT_NAME (optional) — defaults to "extensions.serp.co"
 * - GITHUB_REPO (optional) — e.g. "serptemplates/extensions". If provided, links the GitHub repo.
 * - NEXT_PUBLIC_SITE_URL (optional) — defaults to "https://extensions.serp.co"
 * - PRODUCTION_DATABASE_URL (optional) — Neon prod Postgres URL (must include ?sslmode=require)
 * - STAGING_DATABASE_URL (optional) — Neon staging Postgres URL (must include ?sslmode=require)
 * - VERCEL_DOMAIN (optional) — e.g. "extensions.serp.co" to attach domain to the project
 *
 * Usage:
 *   VERCEL_TOKEN=... VERCEL_TEAM_ID=... GITHUB_REPO=serptemplates/extensions pnpm vercel:setup
 */

// Node 18+ has global fetch. Ensure Node >= 20 as per repo engines.

type VercelProject = {
  id: string;
  name: string;
};

type CreateProjectBody = {
  name: string;
  framework?: string;
  gitRepository?: { type: "github" | "gitlab" | "bitbucket"; repo: string };
  // Rely on vercel.json in repo for build/output config. Keeping minimal here.
};

const API_BASE = "https://api.vercel.com";

function env(name: string, fallback?: string): string | undefined {
  const v = process.env[name];
  if (v && v.trim().length > 0) return v;
  return fallback;
}

function required(name: string): string {
  const v = env(name);
  if (!v) {
    throw new Error(`Missing required env: ${name}`);
  }
  return v;
}

function q(params: Record<string, string | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) sp.append(k, v);
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

async function api<T>(path: string, init: RequestInit & { token: string; teamId?: string } ): Promise<T> {
  const { token, teamId, ...rest } = init;
  const url = `${API_BASE}${path}${q({ teamId })}`;
  const res = await fetch(url, {
    ...rest,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(rest.headers || {}),
    },
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Vercel API ${rest.method || 'GET'} ${path} failed: ${res.status} ${res.statusText}\n${txt}`);
  }
  // Some endpoints return 204 No Content
  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

async function getProjectByName(name: string, token: string, teamId?: string): Promise<VercelProject | null> {
  try {
    const proj = await api<VercelProject>(`/v10/projects/${encodeURIComponent(name)}`, { method: 'GET', token, teamId });
    return proj;
  } catch (err: any) {
    if (String(err.message || '').includes('404')) return null;
    throw err;
  }
}

async function createProject(body: CreateProjectBody, token: string, teamId?: string): Promise<VercelProject> {
  const proj = await api<VercelProject>(`/v10/projects`, {
    method: 'POST',
    token,
    teamId,
    body: JSON.stringify(body),
  });
  return proj;
}

type EnvTarget = Array<'production' | 'preview' | 'development'>;

async function setProjectEnv(
  projectId: string,
  token: string,
  teamId: string | undefined,
  key: string,
  value: string,
  target: EnvTarget,
) {
  // Try to create; if it already exists, ignore (keep idempotent).
  try {
    await api(`/v10/projects/${projectId}/env`, {
      method: 'POST',
      token,
      teamId,
      body: JSON.stringify({ key, value, type: 'plain', target }),
    });
    console.log(`✔ Set env ${key} for ${target.join(', ')}`);
  } catch (err: any) {
    const msg = String(err.message || '');
    if (msg.includes('409') || msg.includes('already exists')) {
      console.log(`ℹ Env ${key} already exists for ${target.join(', ')} — leaving as is.`);
      return;
    }
    throw err;
  }
}

async function addProjectDomain(projectId: string, token: string, teamId: string | undefined, domain: string) {
  try {
    await api(`/v10/projects/${projectId}/domains`, {
      method: 'POST',
      token,
      teamId,
      body: JSON.stringify({ name: domain }),
    });
    console.log(`✔ Attached domain ${domain} to project`);
  } catch (err: any) {
    const msg = String(err.message || '');
    if (msg.includes('409') || msg.includes('already exists')) {
      console.log(`ℹ Domain ${domain} already attached — skipping.`);
      return;
    }
    console.warn('⚠ Could not attach domain automatically. You may need to verify/assign the domain in Vercel UI.');
    console.warn(String(err));
  }
}

async function main() {
  const token = required('VERCEL_TOKEN');
  const teamId = env('VERCEL_TEAM_ID');
  const projectName = env('VERCEL_PROJECT_NAME', 'extensions.serp.co')!;
  const githubRepo = env('GITHUB_REPO'); // e.g. 'serptemplates/extensions'
  const siteUrl = env('NEXT_PUBLIC_SITE_URL', 'https://extensions.serp.co')!;
  const prodDb = env('PRODUCTION_DATABASE_URL');
  const stagingDb = env('STAGING_DATABASE_URL');
  const attachDomain = env('VERCEL_DOMAIN');

  console.log(`↳ Ensuring Vercel project '${projectName}'`);

  let project = await getProjectByName(projectName, token, teamId);
  if (!project) {
    const body: CreateProjectBody = {
      name: projectName,
      framework: 'nextjs',
      ...(githubRepo ? { gitRepository: { type: 'github', repo: githubRepo } } : {}),
    };
    project = await createProject(body, token, teamId);
    console.log(`✔ Created project '${project.name}' (${project.id})`);
  } else {
    console.log(`ℹ Project '${projectName}' already exists (${project.id})`);
  }

  // Set env vars
  await setProjectEnv(project.id, token, teamId, 'NEXT_PUBLIC_SITE_URL', siteUrl, ['production', 'preview']);

  if (prodDb) {
    await setProjectEnv(project.id, token, teamId, 'DATABASE_URL', prodDb, ['production']);
  } else {
    console.log('ℹ PRODUCTION_DATABASE_URL not provided — skipping production DATABASE_URL.');
  }

  if (stagingDb) {
    await setProjectEnv(project.id, token, teamId, 'DATABASE_URL', stagingDb, ['preview']);
  } else {
    console.log('ℹ STAGING_DATABASE_URL not provided — skipping preview DATABASE_URL.');
  }

  if (attachDomain) {
    await addProjectDomain(project.id, token, teamId, attachDomain);
  }

  console.log('\nDone. Next steps:');
  console.log(`- Verify GitHub linking for repo ${githubRepo ?? '(none)'} in Vercel UI`);
  console.log(`- Trigger a deploy (push to main or Deploy button)`);
  console.log(`- When Neon URLs are ready, re-run this script with PRODUCTION_DATABASE_URL/STAGING_DATABASE_URL to set them`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

