# macOS Installer

## 필요 사항

- macOS 10.12 이상
- Xcode Command Line Tools
  ```bash
  xcode-select --install
  ```
- jq (선택사항, JSON 파싱용)
  ```bash
  brew install jq
  ```

## 빌드 방법

1. `panel/` 디렉토리에 CEP 패널 파일을 복사합니다
2. 프로젝트 루트에서 다음 명령어를 실행합니다:
   ```bash
   npm run build:macos
   ```
   또는 직접:
   ```bash
   bash installer/macos/build-pkg.sh
   ```

## 설치 방법

빌드된 .pkg 파일을 사용하여 설치:

```bash
sudo installer -pkg dist/macos/Lasker-Studio-Panel-1.0.0.pkg -target /
```

또는 .pkg 파일을 더블클릭하여 GUI로 설치할 수 있습니다.

## 설치 경로

패널은 다음 위치에 설치됩니다:
```
/Library/Application Support/Adobe/CEP/extensions/com.lasker.studio.panel
```

## 제거 방법

```bash
sudo rm -rf "/Library/Application Support/Adobe/CEP/extensions/com.lasker.studio.panel"
```

## 주의사항

- 관리자 권한이 필요합니다
- 설치 전 Adobe 애플리케이션을 종료하세요
- 설치 후 Adobe 앱을 재시작해야 패널이 표시됩니다

## 서명 (선택사항)

배포용 패키지에 서명하려면:

```bash
productsign --sign "Developer ID Installer: Your Name" \
    "unsigned.pkg" \
    "signed.pkg"
```

서명을 위해서는 Apple Developer 계정과 개발자 인증서가 필요합니다.
