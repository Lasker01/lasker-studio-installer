# AME Preset: lowres-360p.epr

이 폴더에 `lowres-360p.epr` 프리셋 파일을 배치해야 합니다.

## 프리셋 설정 (ffmpeg.txt 기반)

| 설정 | 값 |
|------|-----|
| 해상도 | 640 x 360 (360p) |
| 코덱 | H.264 |
| 프로파일 | Main |
| 레벨 | 3.1 |
| 비트레이트 | 600 kbps (CBR) |
| 프레임레이트 | 30 fps |
| 오디오 코덱 | AAC |
| 오디오 비트레이트 | 128 kbps |
| 오디오 샘플레이트 | 48000 Hz |
| 오디오 채널 | 스테레오 (2ch) |

## 프리셋 생성 방법

### 1. Adobe Media Encoder 실행

### 2. 새 프리셋 생성
1. 메뉴: **Preset** → **Create Encoding Preset**
2. 또는 Preset Browser에서 **+** 버튼 클릭

### 3. 설정 입력

#### Format
- Format: **H.264**

#### Video 탭
- Width: **640**
- Height: **360**
- Frame Rate: **30**
- Field Order: **Progressive**
- Aspect: **Square Pixels (1.0)**
- Profile: **Main**
- Level: **3.1**
- Bitrate Encoding: **CBR**
- Target Bitrate [Mbps]: **0.6** (= 600 kbps)

#### Audio 탭
- Audio Format: **AAC**
- Sample Rate: **48000 Hz**
- Channels: **Stereo**
- Audio Quality: **High**
- Bitrate [kbps]: **128**

### 4. 프리셋 저장
1. Preset Name: `lowres-360p`
2. **OK** 클릭

### 5. 프리셋 파일 내보내기
1. Preset Browser에서 생성한 프리셋 우클릭
2. **Export Preset** 선택
3. 이 폴더에 `lowres-360p.epr`로 저장

## 프리셋 파일 위치

빌드 시 이 파일은 다음 경로에 복사되어야 합니다:
```
dist/cep/presets/lowres-360p.epr
```

## 참고

- 이 프리셋은 업로드 시간 단축을 위한 저해상도 압축용입니다
- 원본 4K 영상 대비 약 95% 파일 크기 감소 효과
- AI 분석용으로 충분한 품질을 유지합니다
