; Lasker Studio Panel - Adobe CEP Extension Installer
; Inno Setup Script for Windows

#define MyAppName "Lasker Studio"
#define MyAppVersion "0.0.1"
#define MyAppPublisher "Lasker Studio"
#define MyAppURL "https://www.lasker-studio.com"
#define PanelID "com.lasker.studio.cep"

[Setup]
; NOTE: The value of AppId uniquely identifies this application.
AppId={{8F0B3F1C-9A2D-4E5F-B6C7-3D8E9F0A1B2C}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={commonpf32}\Common Files\Adobe\CEP\extensions\{#PanelID}
DisableDirPage=yes
DisableProgramGroupPage=yes
OutputDir=..\..\dist\windows
OutputBaseFilename=LaskerStudio-{#MyAppVersion}-Setup
Compression=lzma2/max
SolidCompression=yes
PrivilegesRequired=admin
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
WizardStyle=modern
SetupIconFile=icon.ico
UninstallDisplayIcon={app}\icon.ico

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "korean"; MessagesFile: "compiler:Languages\Korean.isl"

[Files]
; 패널 파일들을 복사
Source: "..\..\panel\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
; NOTE: panel 디렉토리에 CEP 패널의 모든 파일을 넣어주세요

[Code]
function InitializeSetup(): Boolean;
var
  ResultCode: Integer;
begin
  Result := True;

  // Adobe CEP 폴더가 존재하는지 확인
  if not DirExists(ExpandConstant('{commonpf32}\Common Files\Adobe\CEP')) then
  begin
    MsgBox('Adobe CEP이 설치되어 있지 않습니다. Adobe Creative Cloud 애플리케이션을 먼저 설치해주세요.',
           mbError, MB_OK);
    Result := False;
  end;
end;

procedure CurStepChanged(CurStep: TSetupStep);
var
  PlayerDLLPath: string;
begin
  if CurStep = ssPostInstall then
  begin
    // PlayerDebugMode 설정 (개발 중일 경우)
    // RegWriteStringValue(HKEY_CURRENT_USER, 'Software\Adobe\CSXS.10', 'PlayerDebugMode', '1');

    MsgBox('설치가 완료되었습니다. Adobe 애플리케이션을 재시작하면 패널을 사용할 수 있습니다.',
           mbInformation, MB_OK);
  end;
end;

[UninstallDelete]
Type: filesandordirs; Name: "{app}"

[Messages]
WelcomeLabel2=컴퓨터에 [name/ver]을(를) 설치합니다.%n%n계속하기 전에 Adobe 애플리케이션을 모두 종료하는 것이 좋습니다.
