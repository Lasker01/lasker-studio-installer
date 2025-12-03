# Adobe CEP Panel Installer

Adobe CEP(Common Extensibility Platform) 패널용 크로스 플랫폼 인스톨러입니다.

> Only VibeCoding 😇

## 프로젝트 구조

```
.
├── panel/                  # CEP 패널 소스 파일을 여기에 배치
│   ├── CSXS/
│   │   └── manifest.xml
│   └── (기타 패널 파일들)
├── installer/
│   ├── windows/           # Windows 인스톨러 스크립트
│   └── macos/             # macOS 인스톨러 스크립트
├── scripts/               # 빌드 스크립트
└── README.md
```

## 설치 경로

- **Windows**: `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions`
- **macOS**: `/Library/Application Support/Adobe/CEP/extensions`

## 사전 요구사항

### Windows

- [Inno Setup](https://jrsoftware.org/isinfo.php) 6.0 이상

### macOS

- Xcode Command Line Tools
- macOS 10.12 이상

## 빌드 방법

### Windows 인스톨러 빌드

1. Inno Setup을 설치합니다
2. `config.json`에서 패널 정보를 설정합니다
3. 빌드 스크립트를 실행합니다:
   ```bash
   npm run build:windows
   ```
   또는 수동으로:
   ```bash
   "C:\Program Files (x86)\Inno Setup 6\ISCC.exe" installer/windows/installer.iss
   ```

### macOS 인스톨러 빌드

1. macOS에서 빌드 스크립트를 실행합니다:
   ```bash
   npm run build:macos
   ```
   또는 수동으로:
   ```bash
   bash installer/macos/build-pkg.sh
   ```

## 설정

`config.json` 파일에서 다음 정보를 수정하세요:

- `panelName`: 패널의 고유 ID (예: "com.company.panel")
- `displayName`: 사용자에게 표시될 이름
- `version`: 버전 번호
- `publisher`: 개발자/회사 이름

## 패널 파일 준비

1. `panel/` 디렉토리에 CEP 패널의 모든 파일을 복사합니다
2. `panel/CSXS/manifest.xml` 파일이 존재하는지 확인합니다
3. 인스톨러를 빌드합니다

## 배포

빌드된 인스톨러는 다음 위치에 생성됩니다:

- Windows: `dist/windows/`
- macOS: `dist/macos/`
