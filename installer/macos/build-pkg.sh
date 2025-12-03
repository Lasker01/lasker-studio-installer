#!/bin/bash

# Lasker Studio Panel - macOS Installer Build Script
# Creates a .pkg installer for Adobe CEP extension

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 스크립트 디렉토리
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

# config.json 읽기
CONFIG_FILE="$PROJECT_ROOT/config.json"
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}Error: config.json not found!${NC}"
    exit 1
fi

# JSON 파싱 (jq가 없으면 기본값 사용)
if command -v jq &> /dev/null; then
    PANEL_NAME=$(jq -r '.panelName' "$CONFIG_FILE")
    DISPLAY_NAME=$(jq -r '.displayName' "$CONFIG_FILE")
    VERSION=$(jq -r '.version' "$CONFIG_FILE")
    PUBLISHER=$(jq -r '.publisher' "$CONFIG_FILE")
else
    echo -e "${YELLOW}Warning: jq not found, using default values${NC}"
    PANEL_NAME="com.lasker.studio.panel"
    DISPLAY_NAME="Lasker Studio Panel"
    VERSION="1.0.0"
    PUBLISHER="Lasker Studio"
fi

echo "Building macOS installer for $DISPLAY_NAME v$VERSION"

# 디렉토리 설정
PANEL_DIR="$PROJECT_ROOT/panel"
BUILD_DIR="$PROJECT_ROOT/build/macos"
DIST_DIR="$PROJECT_ROOT/dist/macos"
PAYLOAD_DIR="$BUILD_DIR/payload"
SCRIPTS_DIR="$BUILD_DIR/scripts"
INSTALL_LOCATION="/Library/Application Support/Adobe/CEP/extensions/$PANEL_NAME"

# panel 디렉토리 확인
if [ ! -d "$PANEL_DIR" ] || [ -z "$(ls -A "$PANEL_DIR")" ]; then
    echo -e "${RED}Error: panel directory is empty!${NC}"
    echo "Please copy your CEP panel files to the 'panel' directory."
    exit 1
fi

# manifest.xml 확인
if [ ! -f "$PANEL_DIR/CSXS/manifest.xml" ]; then
    echo -e "${RED}Error: manifest.xml not found!${NC}"
    echo "Please ensure panel/CSXS/manifest.xml exists."
    exit 1
fi

# 이전 빌드 정리
echo "Cleaning previous build..."
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"
mkdir -p "$PAYLOAD_DIR"
mkdir -p "$SCRIPTS_DIR"
mkdir -p "$DIST_DIR"

# 페이로드 디렉토리 구조 생성
PAYLOAD_INSTALL_DIR="$PAYLOAD_DIR/Library/Application Support/Adobe/CEP/extensions/$PANEL_NAME"
mkdir -p "$PAYLOAD_INSTALL_DIR"

# 패널 파일 복사
echo "Copying panel files..."
cp -R "$PANEL_DIR/"* "$PAYLOAD_INSTALL_DIR/"

# postinstall 스크립트 생성
cat > "$SCRIPTS_DIR/postinstall" << 'EOF'
#!/bin/bash

# 설치 후 실행되는 스크립트
INSTALL_DIR="$2/Library/Application Support/Adobe/CEP/extensions"

# 권한 설정
if [ -d "$INSTALL_DIR" ]; then
    chmod -R 755 "$INSTALL_DIR"
fi

# 사용자에게 알림
echo "Installation complete. Please restart Adobe applications to use the panel."

exit 0
EOF

chmod +x "$SCRIPTS_DIR/postinstall"

# preinstall 스크립트 생성 (Adobe 앱 실행 확인)
cat > "$SCRIPTS_DIR/preinstall" << 'EOF'
#!/bin/bash

# Adobe 애플리케이션 확인
ADOBE_APPS=("Adobe Photoshop" "Adobe Illustrator" "Adobe InDesign" "Adobe Premiere Pro" "Adobe After Effects")
RUNNING_APPS=""

for app in "${ADOBE_APPS[@]}"; do
    if pgrep -x "$app" > /dev/null; then
        RUNNING_APPS="$RUNNING_APPS\n- $app"
    fi
done

if [ ! -z "$RUNNING_APPS" ]; then
    echo "Warning: The following Adobe applications are running:$RUNNING_APPS"
    echo "Please close them before continuing."
fi

exit 0
EOF

chmod +x "$SCRIPTS_DIR/preinstall"

# 컴포넌트 패키지 빌드 (번들이 아닌 일반 파일 구조이므로 component.plist 없이 빌드)
echo "Building component package..."
pkgbuild \
    --root "$PAYLOAD_DIR" \
    --install-location "/" \
    --scripts "$SCRIPTS_DIR" \
    --identifier "$PANEL_NAME" \
    --version "$VERSION" \
    "$BUILD_DIR/component.pkg"

# Distribution XML 생성
cat > "$BUILD_DIR/distribution.xml" << EOF
<?xml version="1.0" encoding="utf-8"?>
<installer-gui-script minSpecVersion="1">
    <title>$DISPLAY_NAME</title>
    <organization>$PUBLISHER</organization>
    <domains enable_localSystem="true"/>
    <options customize="never" require-scripts="false" rootVolumeOnly="true"/>
    <welcome file="welcome.html" mime-type="text/html"/>
    <license file="license.txt" mime-type="text/plain"/>
    <conclusion file="conclusion.html" mime-type="text/html"/>

    <pkg-ref id="$PANEL_NAME"/>

    <options customize="never" require-scripts="false"/>

    <choices-outline>
        <line choice="default">
            <line choice="$PANEL_NAME"/>
        </line>
    </choices-outline>

    <choice id="default"/>

    <choice id="$PANEL_NAME" visible="false">
        <pkg-ref id="$PANEL_NAME"/>
    </choice>

    <pkg-ref id="$PANEL_NAME" version="$VERSION" onConclusion="none">component.pkg</pkg-ref>
</installer-gui-script>
EOF

# Resources 디렉토리 생성
RESOURCES_DIR="$BUILD_DIR/resources"
mkdir -p "$RESOURCES_DIR"

# welcome.html 생성
cat > "$RESOURCES_DIR/welcome.html" << EOF
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        h1 { color: #333; }
    </style>
</head>
<body>
    <h1>$DISPLAY_NAME 설치</h1>
    <p>$DISPLAY_NAME v$VERSION을(를) 설치합니다.</p>
    <p>이 설치 프로그램은 Adobe CEP 익스텐션을 시스템에 설치합니다.</p>
    <p><strong>설치하기 전에 모든 Adobe 애플리케이션을 종료해주세요.</strong></p>
</body>
</html>
EOF

# license.txt 생성
cat > "$RESOURCES_DIR/license.txt" << EOF
$DISPLAY_NAME
Copyright (c) $(date +%Y) $PUBLISHER

이 소프트웨어의 사용 조건은 다음과 같습니다:

[여기에 라이선스 내용을 추가하세요]

MIT License 또는 적절한 라이선스로 교체하세요.
EOF

# conclusion.html 생성
cat > "$RESOURCES_DIR/conclusion.html" << EOF
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        h1 { color: #28a745; }
    </style>
</head>
<body>
    <h1>설치 완료</h1>
    <p>$DISPLAY_NAME이(가) 성공적으로 설치되었습니다.</p>
    <p>Adobe 애플리케이션을 실행하고 Window > Extensions 메뉴에서 패널을 찾을 수 있습니다.</p>
    <p>설치 위치: <code>/Library/Application Support/Adobe/CEP/extensions/$PANEL_NAME</code></p>
</body>
</html>
EOF

# 최종 제품 패키지 빌드
echo "Building product package..."
OUTPUT_FILE="$DIST_DIR/${DISPLAY_NAME// /-}-${VERSION}.pkg"

productbuild \
    --distribution "$BUILD_DIR/distribution.xml" \
    --resources "$RESOURCES_DIR" \
    --package-path "$BUILD_DIR" \
    "$OUTPUT_FILE"

# 빌드 정리
echo "Cleaning up build files..."
rm -rf "$BUILD_DIR"

echo -e "${GREEN}✓ macOS installer built successfully!${NC}"
echo -e "Output: ${GREEN}$OUTPUT_FILE${NC}"
echo ""
echo "To install, run:"
echo "  sudo installer -pkg \"$OUTPUT_FILE\" -target /"
echo ""
echo "Or double-click the .pkg file to install."
