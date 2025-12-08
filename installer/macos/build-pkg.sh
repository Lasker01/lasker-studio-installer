#!/bin/bash

# Lasker Studio Panel - macOS Installer Build Script
# Creates a .pkg installer for Adobe CEP extension

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# JSON 파싱
if command -v jq &> /dev/null; then
    PANEL_NAME=$(jq -r '.panelName' "$CONFIG_FILE")
    DISPLAY_NAME=$(jq -r '.displayName' "$CONFIG_FILE")
    VERSION=$(jq -r '.version' "$CONFIG_FILE")
    PUBLISHER=$(jq -r '.publisher' "$CONFIG_FILE")
    BUNDLE_ID=$(jq -r '.bundleId // .panelName' "$CONFIG_FILE")
else
    echo -e "${RED}Error: jq is required. Install with: brew install jq${NC}"
    exit 1
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Lasker Studio Installer Builder${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Product: ${GREEN}$DISPLAY_NAME${NC}"
echo -e "Version: ${GREEN}$VERSION${NC}"
echo -e "Bundle ID: ${GREEN}$BUNDLE_ID${NC}"
echo ""

# 디렉토리 설정
PANEL_DIR="$PROJECT_ROOT/panel"
BUILD_DIR="$PROJECT_ROOT/build/macos"
DIST_DIR="$PROJECT_ROOT/dist/macos"
PAYLOAD_DIR="$BUILD_DIR/payload"
SCRIPTS_DIR="$BUILD_DIR/scripts"
RESOURCES_SRC="$SCRIPT_DIR/resources"

# panel 디렉토리 확인
if [ ! -d "$PANEL_DIR" ] || [ -z "$(ls -A "$PANEL_DIR")" ]; then
    echo -e "${RED}Error: panel directory is empty!${NC}"
    exit 1
fi

# manifest.xml 확인
if [ ! -f "$PANEL_DIR/CSXS/manifest.xml" ]; then
    echo -e "${RED}Error: manifest.xml not found!${NC}"
    exit 1
fi

# 이전 빌드 정리
echo -e "${YELLOW}Cleaning previous build...${NC}"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"
mkdir -p "$PAYLOAD_DIR"
mkdir -p "$SCRIPTS_DIR"
mkdir -p "$DIST_DIR"

# 페이로드 디렉토리 구조 생성
PAYLOAD_INSTALL_DIR="$PAYLOAD_DIR/Library/Application Support/Adobe/CEP/extensions/$PANEL_NAME"
mkdir -p "$PAYLOAD_INSTALL_DIR"

# 패널 파일 복사
echo -e "${YELLOW}Copying panel files...${NC}"
cp -R "$PANEL_DIR/"* "$PAYLOAD_INSTALL_DIR/"

# postinstall 스크립트 생성
cat > "$SCRIPTS_DIR/postinstall" << 'POSTINSTALL'
#!/bin/bash

INSTALL_DIR="/Library/Application Support/Adobe/CEP/extensions"

# 권한 설정
if [ -d "$INSTALL_DIR" ]; then
    chmod -R 755 "$INSTALL_DIR"
fi

# CEP Debug Mode 활성화 (CSXS 9, 10, 11, 12 지원)
# postinstall은 root로 실행되므로 실제 로그인 사용자를 찾아서 설정해야 함
CURRENT_USER=$(stat -f "%Su" /dev/console)
if [ -n "$CURRENT_USER" ] && [ "$CURRENT_USER" != "root" ]; then
    for version in 9 10 11 12; do
        sudo -u "$CURRENT_USER" defaults write com.adobe.CSXS.${version} PlayerDebugMode 1 2>/dev/null || true
    done
fi

exit 0
POSTINSTALL
chmod +x "$SCRIPTS_DIR/postinstall"

# preinstall 스크립트 생성
cat > "$SCRIPTS_DIR/preinstall" << 'PREINSTALL'
#!/bin/bash

# 이전 설치 제거
OLD_INSTALL="/Library/Application Support/Adobe/CEP/extensions/com.lasker.studio.cep"
if [ -d "$OLD_INSTALL" ]; then
    rm -rf "$OLD_INSTALL"
fi

exit 0
PREINSTALL
chmod +x "$SCRIPTS_DIR/preinstall"

# 컴포넌트 패키지 빌드
echo -e "${YELLOW}Building component package...${NC}"
pkgbuild \
    --root "$PAYLOAD_DIR" \
    --install-location "/" \
    --scripts "$SCRIPTS_DIR" \
    --identifier "$BUNDLE_ID" \
    --version "$VERSION" \
    "$BUILD_DIR/component.pkg"

# Distribution XML 생성
cat > "$BUILD_DIR/distribution.xml" << EOF
<?xml version="1.0" encoding="utf-8"?>
<installer-gui-script minSpecVersion="2">
    <title>$DISPLAY_NAME</title>
    <organization>$PUBLISHER</organization>
    <domains enable_localSystem="true"/>
    <options customize="never" require-scripts="false" rootVolumeOnly="true" hostArchitectures="x86_64,arm64"/>

    <welcome file="welcome.html" mime-type="text/html"/>
    <license file="license.txt" mime-type="text/plain"/>
    <conclusion file="conclusion.html" mime-type="text/html"/>

    <pkg-ref id="$BUNDLE_ID"/>

    <choices-outline>
        <line choice="default">
            <line choice="$BUNDLE_ID"/>
        </line>
    </choices-outline>

    <choice id="default"/>
    <choice id="$BUNDLE_ID" visible="false">
        <pkg-ref id="$BUNDLE_ID"/>
    </choice>

    <pkg-ref id="$BUNDLE_ID" version="$VERSION" onConclusion="none">component.pkg</pkg-ref>
</installer-gui-script>
EOF

# Resources 디렉토리 준비
RESOURCES_DIR="$BUILD_DIR/resources"
mkdir -p "$RESOURCES_DIR"

# 리소스 파일 복사 및 버전 치환
if [ -d "$RESOURCES_SRC" ]; then
    for file in "$RESOURCES_SRC"/*; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            # 버전 변수 치환
            sed "s/\${VERSION}/$VERSION/g" "$file" > "$RESOURCES_DIR/$filename"
        fi
    done
else
    echo -e "${YELLOW}Warning: Resources directory not found, creating default resources${NC}"
    # 기본 리소스 생성 (fallback)
    echo "<html><body><h1>$DISPLAY_NAME $VERSION</h1></body></html>" > "$RESOURCES_DIR/welcome.html"
    echo "License Agreement" > "$RESOURCES_DIR/license.txt"
    echo "<html><body><h1>Installation Complete</h1></body></html>" > "$RESOURCES_DIR/conclusion.html"
fi

# 최종 제품 패키지 빌드
echo -e "${YELLOW}Building product package...${NC}"
OUTPUT_FILE="$DIST_DIR/${DISPLAY_NAME// /-}-${VERSION}-Installer.pkg"

productbuild \
    --distribution "$BUILD_DIR/distribution.xml" \
    --resources "$RESOURCES_DIR" \
    --package-path "$BUILD_DIR" \
    "$OUTPUT_FILE"

# 코드 서명 (인증서가 있는 경우)
if [ -n "$INSTALLER_CERT_NAME" ]; then
    echo -e "${YELLOW}Signing package...${NC}"
    productsign --sign "$INSTALLER_CERT_NAME" "$OUTPUT_FILE" "${OUTPUT_FILE%.pkg}-signed.pkg"
    mv "${OUTPUT_FILE%.pkg}-signed.pkg" "$OUTPUT_FILE"
    echo -e "${GREEN}Package signed successfully${NC}"
else
    echo -e "${YELLOW}Note: Package is not signed. Set INSTALLER_CERT_NAME to sign.${NC}"
fi

# 빌드 정리
echo -e "${YELLOW}Cleaning up...${NC}"
rm -rf "$BUILD_DIR"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Build Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Output: ${BLUE}$OUTPUT_FILE${NC}"
echo ""
echo "Install with:"
echo -e "  ${YELLOW}sudo installer -pkg \"$OUTPUT_FILE\" -target /${NC}"
echo ""
