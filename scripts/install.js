const fs = require('fs');
const path = require('path');
const { spawnSync, spawn } = require('child_process');

const ROOT_DIR = path.join(__dirname, '..');
const WORKSPACE_DIR = path.join(ROOT_DIR, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');
const MONACO_SOURCE = path.join(ROOT_DIR, 'node_modules', 'monaco-editor', 'min', 'vs');
const MONACO_TARGET = path.join(PUBLIC_DIR, 'monaco', 'vs');
const INIT_SCRIPT = path.join(ROOT_DIR, 'src', 'backend', 'database', 'init.js');
const MORPHO_DOC_SOURCE = path.join(WORKSPACE_DIR, 'morpho.txt');
const DOC_PLACEHOLDER = path.join(DOCS_DIR, 'README.md');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyDir(source, target) {
  if (!fs.existsSync(source)) {
    console.warn(`Monaco source not found at ${source}`);
    return;
  }

  ensureDir(target);
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      copyDir(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

function main() {
  ensureDir(DOCS_DIR);
  if (!fs.existsSync(DOC_PLACEHOLDER)) {
    fs.writeFileSync(
      DOC_PLACEHOLDER,
      [
        '# Morpho Training Docs',
        '',
        'Place additional docs such as `llms-full.txt` here for future curriculum enrichment.',
        'Initial seeding reads from the workspace-level `morpho.txt` file.'
      ].join('\n')
    );
  }

  if (fs.existsSync(MORPHO_DOC_SOURCE)) {
    const copyTarget = path.join(DOCS_DIR, 'morpho-source.txt');
    fs.copyFileSync(MORPHO_DOC_SOURCE, copyTarget);
  }

  copyDir(MONACO_SOURCE, MONACO_TARGET);

  const initResult = spawnSync(process.execPath, [INIT_SCRIPT], {
    cwd: ROOT_DIR,
    stdio: 'inherit'
  });

  if (initResult.status !== 0) {
    process.exit(initResult.status || 1);
  }

  if (process.argv.includes('--start')) {
    const child = spawn(process.execPath, ['src/backend/server.js'], {
      cwd: ROOT_DIR,
      detached: true,
      stdio: 'ignore'
    });
    child.unref();
  }

  if (process.argv.includes('--open')) {
    try {
      const open = require('open');
      open('http://localhost:3000');
    } catch (error) {
      console.warn('Install the optional "open" package or launch http://localhost:3000 manually.');
    }
  }
}

main();
