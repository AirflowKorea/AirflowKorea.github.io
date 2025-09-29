# Apache Airflow Korea User Group 웹사이트

Apache Airflow 한국 사용자 모임의 공식 웹사이트입니다. React + TypeScript + Vite로 구축되었으며, 다국어 지원(한국어/영어)을 제공합니다.

## 빠른 시작

### 개발 환경 설정

```bash
git clone https://github.com/AirflowKorea/AirflowKorea.github.io.git
cd AirflowKorea.github.io

npm install
npm run dev
```

http://localhost:5173 에서 실행됩니다.

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
├── hooks/              # 커스텀 React 훅
├── i18n/               # 다국어 설정 및 번역 파일
├── pages/              # 페이지 컴포넌트
├── types/              # TypeScript 타입 정의
└── utils/              # 유틸리티 함수

public/
└── data/               # 사이트 데이터 (YAML 파일)
    ├── organizers.yaml     # 운영진 정보
    ├── contributors.yaml   # 기여자 정보
    ├── channels.yaml      # 커뮤니케이션 채널
    └── stats.yaml         # 커뮤니티 통계
```

## 데이터 관리 가이드

### 운영진 관리 (`public/data/organizers.yaml`)

새로운 운영진 추가 시:

```yaml
organizers:
  generation_2: # 기수별로 구성 예: generation_1, generation_2, generation_3, ...
    - id: '9' # 고유 ID
      name: '추영욱'
      role: '운영진' # 리더 또는 운영진
      generation: 2 # 기수 (숫자)
      email: 'yeonguk@airflow-kr.org'
      github: 'yeonguk' # GitHub 아이디 (깃허브 프로필로 아바타 자동 생성)
      linkedIn: 'yeonguk' # LinkedIn 아이디 (선택사항)
```

**주의사항:**

- `avatar_url` 필드는 사용하지 않습니다. `github` 아이디로 자동 생성됩니다.
- `generation` 숫자에 따라 자동으로 기수별 분류됩니다.
- `recruitment` 섹션에서 모집 상태를 관리할 수 있습니다. `true` 또는 `false`로 설정하세요. 모집중이라면 `application_url`도 업데이트하세요.

### 기여자 관리 (`public/data/contributors.yaml`)

**자동 업데이트**: 매일 GitHub Actions이 자동으로 Apache Airflow 기여도를 업데이트합니다.

수동으로 기여자 추가:

```yaml
approvedContributors:
  - githubUsername: '새로운기여자아이디' # 여기에만 추가하면 자동 업데이트됨
```

**업데이트 스크립트 실행:**

```bash
npm run update-contributors
```

### 커뮤니케이션 채널 관리 (`public/data/channels.yaml`)

```yaml
channels:
  - id: '새채널'
    name: '새로운 채널'
    platform: 'Discord'
    type: 'chat' # chat, forum, social, video
    url: 'https://discord.gg/example'
    description: '채널 설명'
    memberCount: 150 # 멤버 수
```

### 커뮤니티 통계 관리 (`public/data/stats.yaml`)

```yaml
stats:
  MeetupMembers: 500 # Meetup 멤버 수
  openChatMembers: 120 # 오픈채팅 멤버 수
  EventCounts: 15 # 총 이벤트 수
  contributors: 8 # 기여자 수
  studyGroups: 3 # 스터디 그룹 수
```

## 다국어 지원

번역 파일은 `src/i18n/locales/` 디렉토리에 있습니다:

- `ko/` - 한국어 번역
- `en/` - 영어 번역

새로운 텍스트 추가 시 두 언어 모두 번역을 추가해야 합니다.

### 번역 키 사용법

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('home');
  return <h1>{t('title')}</h1>;
}
```

## 자동화된 기능

### GitHub Actions

1. **기여자 자동 업데이트** (`.github/workflows/update-contributors.yml`)
   - 매일 한국 시간 오전 9시에 실행
   - Apache Airflow 기여자들의 최신 PR 정보 업데이트
   - 변경사항이 있을 때만 자동 커밋

2. **자동 배포** (GitHub Pages)
   - `main` 브랜치에 push 시 자동 배포
   - GitHub Pages를 통해 서비스

## 📋 운영진 체크리스트

### 새 운영진 온보딩 시

- [ ] `organizers.yaml`에 운영진 정보 추가
- [ ] GitHub 아이디가 올바른지 확인 (아바타 이미지 자동 생성)
- [ ] 이메일 주소 형식 확인 (`@airflow-kr.org`)
- [ ] 변경사항 테스트 (`npm run dev`)
- [ ] PR 생성 및 리뷰 후 병합

### 정기 관리 작업

- [ ] 커뮤니티 통계 업데이트 (`stats.yaml`)
- [ ] 채널 멤버 수 업데이트 (`channels.yaml`)
- [ ] 모집 상태 업데이트 (`organizers.yaml`의 `recruitment` 섹션)

## 🔍 트러블슈팅

### 개발 서버가 시작되지 않을 때

```bash
# 캐시 클리어 후 재설치
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 기여자 업데이트 실패 시

```bash
# 수동으로 실행해서 오류 확인
npm run update-contributors
```

---

**Apache Airflow Korea User Group**에서 관리하는 공식 웹사이트입니다.
