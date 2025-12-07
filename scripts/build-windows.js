const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// config.json 읽기
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));

console.log('========================================');
console.log('  Lasker Studio Installer Builder');
console.log('========================================');
console.log('');
console.log(`Product: ${config.displayName}`);
console.log(`Version: ${config.version}`);
console.log('');

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
  process.exit(1);
}

// manifest.xml 확인
const manifestPath = path.join(panelDir, 'CSXS', 'manifest.xml');
if (!fs.existsSync(manifestPath)) {
  console.error('Error: manifest.xml not found!');
  process.exit(1);
}

// dist 디렉토리 생성
const distDir = path.join(__dirname, '../dist/windows');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// ISS 파일 동적 생성 (UTF-8 BOM)
const issTemplate = `; Lasker Studio - Adobe CEP Extension Installer
; Auto-generated - DO NOT EDIT MANUALLY

#define MyAppName "${config.displayName}"
#define MyAppVersion "${config.version}"
#define MyAppPublisher "${config.publisher}"
#define MyAppURL "https://lasker-studio.com"
#define PanelID "${config.panelName}"

[Setup]
AppId=${config.appId}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={commonpf32}\\Common Files\\Adobe\\CEP\\extensions\\{#PanelID}
DisableDirPage=yes
DisableProgramGroupPage=yes
OutputDir=..\\..\\dist\\windows
OutputBaseFilename=LaskerStudio-{#MyAppVersion}-Setup
Compression=lzma2/max
SolidCompression=yes
PrivilegesRequired=admin
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
WizardStyle=modern
WizardResizable=no
UninstallDisplayName={#MyAppName}
VersionInfoVersion={#MyAppVersion}
VersionInfoCompany={#MyAppPublisher}
VersionInfoProductName={#MyAppName}
VersionInfoProductVersion={#MyAppVersion}

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "korean"; MessagesFile: "compiler:Languages\\Korean.isl"

[CustomMessages]
korean.WelcomeLabel2=Lasker Studio v{#MyAppVersion}을(를) 설치합니다.%n%nAdobe Premiere Pro를 위한 AI 기반 영상 편집 도구입니다.%n%n계속하기 전에 모든 Adobe 애플리케이션을 종료해 주세요.
english.WelcomeLabel2=This will install Lasker Studio v{#MyAppVersion}.%n%nAI-powered video editing tools for Adobe Premiere Pro.%n%nPlease close all Adobe applications before continuing.

[Files]
Source: "..\\..\\panel\\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Registry]
; CEP Debug Mode 활성화
Root: HKCU; Subkey: "Software\\Adobe\\CSXS.10"; ValueType: string; ValueName: "PlayerDebugMode"; ValueData: "1"; Flags: uninsdeletevalue
Root: HKCU; Subkey: "Software\\Adobe\\CSXS.11"; ValueType: string; ValueName: "PlayerDebugMode"; ValueData: "1"; Flags: uninsdeletevalue
Root: HKCU; Subkey: "Software\\Adobe\\CSXS.12"; ValueType: string; ValueName: "PlayerDebugMode"; ValueData: "1"; Flags: uninsdeletevalue

[Code]
function InitializeSetup(): Boolean;
begin
  Result := True;

  if not DirExists(ExpandConstant('{commonpf32}\\Common Files\\Adobe\\CEP')) then
  begin
    if MsgBox('Adobe CEP가 설치되어 있지 않습니다.' + #13#10 +
              'Adobe Creative Cloud 애플리케이션을 먼저 설치해 주세요.' + #13#10 + #13#10 +
              '계속 진행하시겠습니까?',
              mbConfirmation, MB_YESNO) = IDNO then
    begin
      Result := False;
    end;
  end;
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssPostInstall then
  begin
    MsgBox('설치가 완료되었습니다!' + #13#10 + #13#10 +
           'Adobe Premiere Pro를 실행하고' + #13#10 +
           'Window > Extensions > Lasker Studio를' + #13#10 +
           '선택하여 사용하세요.',
           mbInformation, MB_OK);
  end;
end;

[UninstallDelete]
Type: filesandordirs; Name: "{app}"

[Messages]
WelcomeLabel2=%cm:WelcomeLabel2
`;

// UTF-8 BOM으로 ISS 파일 작성
const issPath = path.join(__dirname, '../installer/windows/installer.iss');
const BOM = '\uFEFF';
fs.writeFileSync(issPath, BOM + issTemplate, 'utf8');
console.log('Generated installer.iss with UTF-8 BOM');

// Inno Setup 실행
try {
  console.log('Compiling installer...');
  execSync(`"${isccPath}" "${issPath}"`, { stdio: 'inherit' });
  console.log('');
  console.log('========================================');
  console.log('  Build Complete!');
  console.log('========================================');
  console.log('');
  console.log(`Output: ${distDir}\\LaskerStudio-${config.version}-Setup.exe`);
} catch (error) {
  console.error('Error building installer:', error.message);
  process.exit(1);
}
