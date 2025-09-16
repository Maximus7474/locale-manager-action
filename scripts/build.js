const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs/promises');

const rootDir = path.join(__dirname, '..');
const outDir = path.join(rootDir, 'dist');

const config = {
  entryPoints: [path.join(rootDir, 'src', 'index.ts')],
  bundle: true,
  outfile: path.join(rootDir, 'dist', 'index.js'),
  platform: 'node',
  target: 'es2020',
  minify: true,
};

async function build() {
  console.log('Building action...');
  
  try {
    await fs.rm(outDir, { recursive: true, force: true });

    await esbuild.build(config);

    console.log('Build successful');
  } catch (error) {
    console.error('Build failed:', error);

    process.exit(1);
  }
}

build();
