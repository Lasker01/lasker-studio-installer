const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// config.json 읽기
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));

console.log('Building Windows installer for', config.displayName);

// Inno Setup 경로 찾기
const innoSetupPaths = [
  'C:\\Program Files (x86)\\Inno Setup 6\\ISCC.exe',
  'C:\\Program Files\\Inno Setup 6\\ISCC.exe',
  'C:\\Program Files (x86)\\Inno Setup 5\\ISCC.exe',
];

let isccPath = null;
for (const p of innoSetupPaths) {
  if (fs.existsSync(p)) {
    isccPath = p;
    break;
  }
}

if (!isccPath) {
  console.error('Error: Inno Setup not found!');
  console.error('Please install Inno Setup from https://jrsoftware.org/isinfo.php');
  process.exit(1);
}

// panel 디렉토리 확인
const panelDir = path.join(__dirname, '../panel');
if (!fs.existsSync(panelDir) || fs.readdirSync(panelDir).length === 0) {
  console.error('Error: panel directory is empty!');
  console.error('Please copy your CEP panel files to the "panel" directory.');
  process.exit(1);
}

// manifest.xml 확인
const manifestPath = path.join(panelDir, 'CSXS', 'manifest.xml');
if (!fs.existsSync(manifestPath)) {
  console.error('Error: manifest.xml not found!');
  console.error('Please ensure panel/CSXS/manifest.xml exists.');
  process.exit(1);
}

// dist 디렉토리 생성
const distDir = path.join(__dirname, '../dist/windows');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Inno Setup 실행
const issFile = path.join(__dirname, '../installer/windows/installer.iss');
try {
  console.log('Compiling installer...');
  execSync(`"${isccPath}" "${issFile}"`, { stdio: 'inherit' });
  console.log('✓ Windows installer built successfully!');
  console.log('Output:', distDir);
} catch (error) {
  console.error('Error building installer:', error.message);
  process.exit(1);
}
