# Lasker Studio CEP Panel 설치 가이드

## 목차
1. [사전 요구사항](#사전-요구사항)
2. [빌드 방법](#빌드-방법)
3. [설치 방법](#설치-방법)
4. [문제 해결](#문제-해결)

---

## 사전 요구사항

### 모든 플랫폼
- Adobe Premiere Pro (또는 다른 Adobe Creative Cloud 애플리케이션)
- Node.js (빌드 스크립트 실행용, 선택사항)

### Windows
- Windows 10 이상
- [Inno Setup 6](https://jrsoftware.org/isinfo.php) (인스톨러 빌드용)
- 관리자 권한

### macOS
- macOS 10.12 이상
- Xcode Command Line Tools
  ```bash
  xcode-select --install
  ```
- 관리자 권한

---

## 빌드 방법

### 1. 프로젝트 설정 확인

`config.json` 파일에서 패널 정보를 확인하세요:

```json
{
  "panelName": "com.lasker.studio.cep",
  "displayName": "Lasker Studio",
  "version": "0.0.1",
  "publisher": "Lasker Studio"
}
```

### 2. Windows 인스톨러 빌드

**방법 1: npm 스크립트 사용 (권장)**
```bash
npm run build:windows
```

**방법 2: 직접 빌드**
```bash
"C:\Program Files (x86)\Inno Setup 6\ISCC.exe" installer\windows\installer.iss
```

빌드된 인스톨러 위치: `dist/windows/LaskerStudio-0.0.1-Setup.exe`

### 3. macOS 인스톨러 빌드

**방법 1: npm 스크립트 사용 (권장)**
```bash
npm run build:macos
```

**방법 2: 직접 빌드**
```bash
bash installer/macos/build-pkg.sh
```

빌드된 인스톨러 위치: `dist/macos/Lasker-Studio-0.0.1.pkg`

### 4. 양쪽 플랫폼 모두 빌드
```bash
npm run build:all
```

---

## 설치 방법

### Windows

1. **인스톨러 실행**
   - `LaskerStudio-0.0.1-Setup.exe` 파일을 더블클릭
   - 관리자 권한이 필요합니다

2. **설치 마법사 따라가기**
   - 설치 전 Adobe 애플리케이션을 모두 종료하세요
   - 설치 경로: `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\com.lasker.studio.cep`

3. **설치 확인**
   - Adobe Premiere Pro 실행
   - Window > Extensions > Lasker Studio 메뉴 확인

### macOS

**방법 1: GUI 설치 (권장)**
1. `Lasker-Studio-0.0.1.pkg` 파일을 더블클릭
2. 설치 마법사의 지시를 따릅니다
3. 관리자 비밀번호 입력

**방법 2: 터미널에서 설치**
```bash
sudo installer -pkg "dist/macos/Lasker-Studio-0.0.1.pkg" -target /
```

**설치 확인**
- Adobe Premiere Pro 실행
- Window > Extensions > Lasker Studio 메뉴 확인
- 설치 경로: `/Library/Application Support/Adobe/CEP/extensions/com.lasker.studio.cep`

---

## 수동 설치 (개발용)

인스톨러를 사용하지 않고 수동으로 설치하려면:

### Windows
```bash
# panel 폴더를 CEP extensions 경로로 복사
xcopy /E /I panel "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\com.lasker.studio.cep"
```

### macOS
```bash
# panel 폴더를 CEP extensions 경로로 복사
sudo cp -R panel "/Library/Application Support/Adobe/CEP/extensions/com.lasker.studio.cep"

# 권한 설정
sudo chmod -R 755 "/Library/Application Support/Adobe/CEP/extensions/com.lasker.studio.cep"
```

---

## 제거 방법

### Windows

**방법 1: 제어판에서 제거**
1. 제어판 > 프로그램 및 기능
2. "Lasker Studio" 찾아서 제거

**방법 2: 수동 제거**
```bash
rmdir /S "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\com.lasker.studio.cep"
```

### macOS

**수동 제거**
```bash
sudo rm -rf "/Library/Application Support/Adobe/CEP/extensions/com.lasker.studio.cep"
```

---

## 문제 해결

### 패널이 보이지 않아요

1. **Adobe 앱 재시작**
   - 완전히 종료하고 다시 실행하세요

2. **설치 경로 확인**
   - Windows: `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\com.lasker.studio.cep`
   - macOS: `/Library/Application Support/Adobe/CEP/extensions/com.lasker.studio.cep`

3. **디버그 모드 활성화** (개발 중인 경우)

   **Windows:**
   ```
   레지스트리 편집기 열기
   HKEY_CURRENT_USER\Software\Adobe\CSXS.10
   PlayerDebugMode = "1" (문자열 값)
   ```

   **macOS:**
   ```bash
   defaults write com.adobe.CSXS.10 PlayerDebugMode 1
   ```

4. **로그 확인**
   - Windows: `%USERPROFILE%\AppData\Local\Temp`
   - macOS: `~/Library/Logs/CSXS`

### 권한 오류

- Windows: 관리자 권한으로 실행하세요
- macOS: `sudo`를 사용하여 설치하세요

### 빌드 오류

**Windows**
- Inno Setup이 설치되어 있는지 확인
- `panel/` 디렉토리에 파일이 있는지 확인
- `panel/CSXS/manifest.xml`이 존재하는지 확인

**macOS**
- Xcode Command Line Tools 설치 확인: `xcode-select -p`
- `panel/` 디렉토리에 파일이 있는지 확인
- 빌드 스크립트에 실행 권한 확인: `chmod +x installer/macos/build-pkg.sh`

---

## 지원되는 Adobe 애플리케이션

현재 설정에서 지원하는 애플리케이션 (manifest.xml 기준):
- Adobe Premiere Pro

다른 애플리케이션을 지원하려면 `panel/CSXS/manifest.xml`의 HostList를 수정하세요.

---

## 추가 정보

- [Adobe CEP 공식 문서](https://github.com/Adobe-CEP/CEP-Resources)
- [CEP Cookbook](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_10.x/Documentation/CEP%2010.0%20HTML%20Extension%20Cookbook.md)

---

## 라이선스

[여기에 라이선스 정보 추가]

## 문의

문제가 발생하면 [이메일/이슈 트래커]로 연락주세요.
