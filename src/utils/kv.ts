let fsModule: any = null;
let pathModule: any = null;

// node:fs and node:path are NOT available in Cloudflare Workers even with nodejsCompat.
// This local fallback is only used during local development with the Node adapter.
async function getLocalNodeModules() {
  if (!fsModule || !pathModule) {
    try {
      fsModule = await import('node:fs');
      pathModule = await import('node:path');
    } catch (e) {
      // Expected in Cloudflare Workers — KV binding should be used instead
    }
  }
  return { fs: fsModule, path: pathModule };
}

async function getLocalDbPath() {
  const { path } = await getLocalNodeModules();
  if (!path) return null;
  return path.resolve('.data/kv.json');
}

// Ensure local storage directory exists for fallback
async function ensureLocalDir() {
  const { fs, path } = await getLocalNodeModules();
  if (!fs || !path) return;
  const dbPath = await getLocalDbPath();
  if (!dbPath) return;
  
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({}));
  }
}

// Local fallback store
async function getLocal(key: string): Promise<string | null> {
  try {
    await ensureLocalDir();
    const { fs } = await getLocalNodeModules();
    const dbPath = await getLocalDbPath();
    if (!fs || !dbPath) return null;
    
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    return data[key] || null;
  } catch (e) {
    console.error('Error reading local KV:', e);
    return null;
  }
}

async function putLocal(key: string, value: string): Promise<void> {
  try {
    await ensureLocalDir();
    const { fs } = await getLocalNodeModules();
    const dbPath = await getLocalDbPath();
    if (!fs || !dbPath) return;
    
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    data[key] = value;
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error writing to local KV:', e);
  }
}

async function listLocal(prefix: string): Promise<string[]> {
  try {
    await ensureLocalDir();
    const { fs } = await getLocalNodeModules();
    const dbPath = await getLocalDbPath();
    if (!fs || !dbPath) return [];
    
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    return Object.keys(data).filter(k => k.startsWith(prefix));
  } catch (e) {
    console.error('Error listing local KV:', e);
    return [];
  }
}

export async function kvGet(context: any, key: string): Promise<string | null> {
  const KV = context.locals?.runtime?.env?.SESSION;
  if (KV) {
    return await KV.get(key);
  }
  return await getLocal(key);
}

export async function kvPut(context: any, key: string, value: string): Promise<void> {
  const KV = context.locals?.runtime?.env?.SESSION;
  if (KV) {
    await KV.put(key, value);
    return;
  }
  await putLocal(key, value);
}

export async function kvList(context: any, prefix: string): Promise<string[]> {
  const KV = context.locals?.runtime?.env?.SESSION;
  if (KV) {
    const listRes = await KV.list({ prefix });
    return listRes.keys.map((k: any) => k.name);
  }
  return await listLocal(prefix);
}
