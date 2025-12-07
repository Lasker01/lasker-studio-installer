# Lasker Studio Installer

Adobe Premiere Pro용 AI 영상 편집 어시스턴트 **Lasker Studio**의 설치 파일 빌드 시스템입니다.

## 목차

- [개요](#개요)
- [시스템 구조](#시스템-구조)
- [자동 업데이트 시스템](#자동-업데이트-시스템)
- [설치 파일 빌드](#설치-파일-빌드)
- [버전 관리](#버전-관리)
- [배포 워크플로우](#배포-워크플로우)
- [개발자 가이드](#개발자-가이드)

---

## 개요

Lasker Studio는 두 개의 레포지토리로 구성됩니다:

| 레포지토리 | 설명 | 역할 |
|-----------|------|------|
| `lasker-studio-cep` | 플러그인 소스 코드 | Vercel CDN에 배포 |
| `lasker-studio-installer` | 설치 파일 빌드 | macOS/Windows 인스톨러 생성 |

### 핵심 특징

- **자동 업데이트**: 설치 후 코드 변경 시 재설치 불필요
- **크로스 플랫폼**: macOS (.pkg) + Windows (.exe) 지원
- **중앙 집중식 버전 관리**: `config.json`에서 모든 설정 관리

---

## 시스템 구조

```
lasker-studio-installer/
├── config.json              # 버전, 이름, 설정 등 중앙 관리
├── package.json             # npm 스크립트
├── panel/                   # CEP 패널 파일 (빌드된 결과물)
│   ├── CSXS/manifest.xml    # Adobe CEP 매니페스트
│   ├── main/index.html      # CDN 로더 포함
│   ├── assets/              # JS, CSS 파일
│   ├── jsx/                 # ExtendScript 파일
│   └── presets/             # 인코딩 프리셋
├── installer/
│   ├── macos/
│   │   ├── build-pkg.sh     # macOS 빌드 스크립트
│   │   └── resources/       # welcome, license, conclusion
│   └── windows/
│       └── installer.iss    # Inno Setup 스크립트 (자동 생성)
├── scripts/
│   ├── build-windows.js     # Windows 빌드 스크립트
│   └── bump-version.js      # 버전 관리 스크립트
└── .github/workflows/
    └── build.yml            # GitHub Actions CI/CD
```

---

## 자동 업데이트 시스템

### 작동 원리

```
[사용자 PC]                    [Vercel CDN]
    │                              │
    │  1. 플러그인 실행             │
    │  ──────────────────────────> │
    │                              │
    │  2. manifest.json 요청        │
    │  <────────────────────────── │
    │                              │
    │  3. 최신 JS/CSS 로드          │
    │  <────────────────────────── │
    │                              │
```

1. **플러그인 시작**: `index.html`의 CDN 로더가 실행됨
2. **매니페스트 확인**: Vercel에서 `manifest.json` 다운로드
3. **동적 로딩**: 최신 JS/CSS 파일을 CDN에서 직접 로드
4. **Fallback**: CDN 실패 시 로컬 파일 사용

### CDN 로더 코드 (index.html)

```javascript
fetch(CDN + '/manifest.json')
  .then(res => res.json())
  .then(manifest => {
    // CSS 로드
    var link = document.createElement('link');
    link.href = CDN + '/' + manifest.files.main.css;
    document.head.appendChild(link);

    // JS 로드
    var script = document.createElement('script');
    script.src = CDN + '/' + manifest.files.main.js;
    document.body.appendChild(script);
  });
```

### 새 인스톨러가 필요한 경우

| 변경 사항 | 새 인스톨러 필요? |
|----------|------------------|
| UI/기능 변경 (React, JS) | ❌ 자동 업데이트 |
| CSS 스타일 변경 | ❌ 자동 업데이트 |
| JSX (ExtendScript) 변경 | ❌ 자동 업데이트 |
| presets 변경 | ❌ 자동 업데이트 |
| `manifest.xml` 변경 | ✅ 필요 |
| 패널 ID 변경 | ✅ 필요 |
| CDN URL 변경 | ✅ 필요 |

---

## 설치 파일 빌드

### 사전 요구사항

**macOS:**
- Node.js 18+
- jq (`brew install jq`)

**Windows:**
- Node.js 18+
- Inno Setup 6 ([다운로드](https://jrsoftware.org/isinfo.php))

### 로컬 빌드

```bash
# macOS 인스톨러 빌드
npm run build:macos

# Windows 인스톨러 빌드 (Windows에서만)
npm run build:windows

# 둘 다 빌드
npm run build:all
```

### 빌드 결과물

```
dist/
├── macos/
│   └── Lasker-Studio-1.0.0-Installer.pkg
└── windows/
    └── LaskerStudio-1.0.0-Setup.exe
```

### GitHub Actions 자동 빌드

`main` 브랜치에 push하면 자동으로 빌드됩니다:

1. GitHub Actions 페이지에서 빌드 확인
2. Artifacts에서 `macos-installer-x.x.x` 또는 `windows-installer-x.x.x` 다운로드

---

## 버전 관리

### config.json

모든 버전 정보는 `config.json`에서 관리합니다:

```json
{
  "panelName": "com.lasker.studio.cep",
  "displayName": "Lasker Studio",
  "version": "1.0.0",
  "publisher": "Lasker Studio",
  ...
}
```

### 버전 변경

```bash
# 현재 버전 확인
npm run version

# 버전 올리기
npm run version patch   # 1.0.0 → 1.0.1
npm run version minor   # 1.0.0 → 1.1.0
npm run version major   # 1.0.0 → 2.0.0

# 특정 버전 지정
npm run version 2.0.0
```

### 릴리스 생성

```bash
# 1. 버전 올리기
npm run version patch

# 2. 커밋 및 태그
git add .
git commit -m "chore: bump version to 1.0.1"
git tag v1.0.1
git push && git push --tags
```

태그를 push하면 GitHub Actions가 자동으로:
1. Windows/macOS 인스톨러 빌드
2. GitHub Releases에 자동 업로드

---

## 배포 워크플로우

### 일반 코드 업데이트 (재설치 불필요)

```bash
# 1. lasker-studio-cep에서 코드 수정

# 2. 빌드 및 push
cd lasker-studio-cep
npm run build
git add . && git commit -m "feat: 새로운 기능"
git push

# 3. Vercel 자동 배포 (약 1분)
# 4. 사용자는 Premiere Pro 재시작하면 자동 업데이트
```

### manifest.xml 변경 시 (재설치 필요)

```bash
# 1. lasker-studio-cep에서 cep.config.ts 수정
# 2. 빌드
npm run build

# 3. installer로 panel 동기화
cp -r dist/cep/* ../lasker-studio-installer/panel/

# 4. 양쪽 레포 push
cd ../lasker-studio-cep
git add . && git commit -m "chore: update manifest" && git push

cd ../lasker-studio-installer
git add . && git commit -m "chore: sync panel" && git push

# 5. GitHub Actions에서 새 인스톨러 다운로드
# 6. 사용자에게 새 인스톨러 배포
```

---

## 개발자 가이드

### 프로젝트 설정

```bash
# 1. 두 레포지토리 클론
git clone https://github.com/Lasker01/lasker-studio-cep.git
git clone https://github.com/Lasker01/lasker-studio-installer.git

# 2. CEP 프로젝트 설정
cd lasker-studio-cep
npm install
npm run dev  # 개발 서버 시작

# 3. Premiere Pro에서 테스트
# Window > Extensions > Lasker Studio
```

### 디버깅

CEP 디버그 모드 활성화:
```bash
# macOS
defaults write com.adobe.CSXS.11 PlayerDebugMode 1

# Windows (레지스트리)
# HKEY_CURRENT_USER\Software\Adobe\CSXS.11\PlayerDebugMode = 1
```

Chrome DevTools 접속:
- http://localhost:8860 (main 패널)

### 코드 서명 (선택사항)

**macOS:**
```bash
# Apple Developer ID Installer 인증서 필요
export INSTALLER_CERT_NAME="Developer ID Installer: Your Name (TEAM_ID)"
npm run build:macos
```

**Windows:**
```bash
# 코드 서명 인증서 필요 (EV 또는 Standard)
# build-windows.js에서 signtool 설정 추가
```

---

## 문제 해결

### 플러그인이 보이지 않음

1. Premiere Pro 완전 종료 후 재시작
2. CEP 디버그 모드 활성화 확인
3. 설치 경로 확인: `/Library/Application Support/Adobe/CEP/extensions/com.lasker.studio.cep`

### 검은 화면

1. 콘솔 확인 (localhost:8860)
2. CDN 연결 상태 확인
3. manifest.json 접근 가능 여부 확인

### 자동 업데이트 안됨

1. 인터넷 연결 확인
2. Premiere Pro 재시작
3. CDN URL 확인: https://lasker-studio-cep.vercel.app/manifest.json

---

## 라이선스

MIT License - Lasker Studio

## 문의

- Email: support@lasker-studio.com
- GitHub Issues: [lasker-studio-installer/issues](https://github.com/Lasker01/lasker-studio-installer/issues)
