# Panel 디렉토리

이 디렉토리에는 Adobe CEP 패널의 소스 파일들이 포함되어 있습니다.

## 현재 구조

```
panel/
├── CSXS/
│   └── manifest.xml      # CEP 익스텐션 매니페스트
├── main/
│   └── index.html        # 메인 패널 UI
├── debug/
│   └── index.html        # 디버그 패널 UI
└── jsx/
    ├── ppro.jsx          # Premiere Pro 호스트 스크립트
    ├── json2.js
    └── index.js
```

## manifest.xml

현재 설정:
- **Bundle ID**: `com.lasker.studio.cep`
- **Version**: `0.0.1`
- **지원 앱**: Adobe Premiere Pro
- **두 개의 패널**:
  1. `com.lasker.studio.cep.main` - 메인 패널
  2. `com.lasker.studio.cep.debug` - 디버그 패널

## 개발 모드

개발 중에는 이 폴더를 직접 CEP extensions 경로로 심볼릭 링크하여 사용할 수 있습니다:

### Windows
```bash
mklink /D "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\com.lasker.studio.cep" "%CD%\panel"
```

### macOS
```bash
sudo ln -s "$(pwd)/panel" "/Library/Application Support/Adobe/CEP/extensions/com.lasker.studio.cep"
```

디버그 모드를 활성화하려면:

### Windows (레지스트리)
```
HKEY_CURRENT_USER\Software\Adobe\CSXS.9
PlayerDebugMode = "1"
```

### macOS (Terminal)
```bash
defaults write com.adobe.CSXS.9 PlayerDebugMode 1
```

## 빌드 전 확인사항

인스톨러를 빌드하기 전에:

1. ✓ `CSXS/manifest.xml` 파일이 존재함
2. ✓ 메인 HTML 파일들이 존재함
3. ✓ 모든 리소스 파일이 포함됨
4. ✓ 버전 번호가 올바름

## 주의사항

- 이 디렉토리의 모든 파일이 인스톨러에 포함됩니다
- 민감한 정보나 개발 전용 파일은 제외하세요
- 큰 파일들은 인스톨러 크기를 증가시킵니다
