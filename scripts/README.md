# Build Scripts

이 디렉토리에는 인스톨러 빌드를 위한 스크립트가 포함되어 있습니다.

## 파일 목록

### build-windows.js
Windows용 인스톨러를 빌드하는 Node.js 스크립트입니다.

**기능:**
- Inno Setup 설치 경로 자동 감지
- `config.json` 설정 읽기
- `panel/` 디렉토리 및 manifest.xml 검증
- Inno Setup 컴파일러 실행
- 오류 처리 및 사용자 피드백

**사용법:**
```bash
node scripts/build-windows.js
```

또는

```bash
npm run build:windows
```

## 요구사항

### Windows 빌드
- Node.js 14 이상 (스크립트 실행용)
- Inno Setup 6 이상

### macOS 빌드
- Bash
- Xcode Command Line Tools
- jq (선택사항)

## 빌드 출력

빌드된 인스톨러는 다음 위치에 생성됩니다:

- **Windows**: `dist/windows/`
- **macOS**: `dist/macos/`

## 커스터마이징

### Windows 빌드 스크립트 수정

Inno Setup의 추가 경로를 지원하려면 `build-windows.js`의 `innoSetupPaths` 배열에 경로를 추가하세요:

```javascript
const innoSetupPaths = [
  'C:\\Program Files (x86)\\Inno Setup 6\\ISCC.exe',
  'C:\\Program Files\\Inno Setup 6\\ISCC.exe',
  'C:\\Your\\Custom\\Path\\ISCC.exe',
];
```

### macOS 빌드 스크립트 수정

`installer/macos/build-pkg.sh`에서 패키지 설정을 수정할 수 있습니다.

## 문제 해결

### Windows

**오류: Inno Setup not found**
- [Inno Setup](https://jrsoftware.org/isinfo.php)을 설치하세요
- 또는 `build-windows.js`에 설치 경로를 추가하세요

**오류: panel directory is empty**
- `panel/` 디렉토리에 CEP 패널 파일을 복사하세요

**오류: manifest.xml not found**
- `panel/CSXS/manifest.xml` 파일이 존재하는지 확인하세요

### macOS

**오류: command not found: pkgbuild**
- Xcode Command Line Tools를 설치하세요: `xcode-select --install`

**빌드 권한 오류**
- 빌드 스크립트에 실행 권한을 부여하세요:
  ```bash
  chmod +x installer/macos/build-pkg.sh
  ```

## 자동화

CI/CD 파이프라인에 통합하려면:

```yaml
# GitHub Actions 예제
- name: Build Windows Installer
  run: npm run build:windows

- name: Build macOS Installer
  run: npm run build:macos
```
