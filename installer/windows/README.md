# Windows Installer

## 필요한 파일

### icon.ico
- 인스톨러 및 패널 아이콘 파일입니다
- 256x256 픽셀 이상의 .ico 파일을 이 디렉토리에 추가해주세요
- 없을 경우 기본 아이콘이 사용됩니다

## 빌드 방법

1. [Inno Setup](https://jrsoftware.org/isinfo.php)을 설치합니다
2. `panel/` 디렉토리에 CEP 패널 파일을 복사합니다
3. 프로젝트 루트에서 다음 명령어를 실행합니다:
   ```bash
   npm run build:windows
   ```

## 주의사항

- 관리자 권한이 필요합니다 (Program Files 경로에 설치하기 때문)
- Adobe Creative Cloud 애플리케이션이 설치되어 있어야 합니다
- 빌드는 Windows에서만 가능합니다
