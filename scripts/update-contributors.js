#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Apache Airflow 기여자 정보를 GitHub API로부터 가져와서 업데이트하는 스크립트
 */

const AIRFLOW_REPO = 'apache/airflow';
const CONTRIBUTORS_FILE = path.join(
  __dirname,
  '../public/data/contributors.yaml'
);

/**
 * GitHub API를 사용해서 특정 사용자의 Apache Airflow 기여도를 가져옴
 */
async function fetchUserContributions(username, githubToken) {
  try {
    const headers = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'airflow-krug-contributor-updater',
    };

    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`;
    }

    // 1. 사용자의 Apache Airflow 머지된 PR 검색
    const searchUrl = `https://api.github.com/search/issues?q=repo:${AIRFLOW_REPO}+type:pr+author:${username}+is:merged&sort=created&order=desc&per_page=100`;

    console.log(`Fetching merged contributions for ${username}...`);
    const response = await fetch(searchUrl, { headers });

    if (!response.ok) {
      console.error(
        `Failed to fetch data for ${username}: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data = await response.json();
    const mergedPullRequests = data.items || [];

    // 2. 최근 3개 머지된 PR의 제목 추출
    const recentContributions = mergedPullRequests
      .slice(0, 3)
      .map(pr => `${pr.title} #${pr.number}`);

    // 3. 사용자 정보 가져오기 (아바타 URL 등)
    const userResponse = await fetch(
      `https://api.github.com/users/${username}`,
      { headers }
    );
    const userData = userResponse.ok ? await userResponse.json() : {};

    return {
      name: userData.name || username,
      githubUsername: username,
      contributions: recentContributions,
      prCount: mergedPullRequests.length,
      githubUrl: `https://github.com/${username}`,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching contributions for ${username}:`, error);
    return null;
  }
}

/**
 * contributors.yaml 파일을 읽고 승인된 기여자 목록을 가져옴
 */
function loadApprovedContributors() {
  try {
    const fileContent = fs.readFileSync(CONTRIBUTORS_FILE, 'utf8');
    const data = yaml.load(fileContent);
    return data.approvedContributors || [];
  } catch (error) {
    console.error('Error loading contributors file:', error);
    return [];
  }
}

/**
 * 업데이트된 기여자 정보를 YAML 파일에 저장
 */
function saveContributorsData(approvedContributors, contributorsData) {
  try {
    const data = {
      approvedContributors,
      contributors: contributorsData.filter(
        contributor => contributor !== null
      ),
    };

    const yamlContent = yaml.dump(data, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
    });

    // 파일 시작 부분에 주석 추가
    const header = `# Apache Airflow 한국인 기여자 정보
# - contribution_type: code, docs, community, translation 등
# - 본인 동의하에만 추가
# - 자동 업데이트: ${new Date().toISOString()}

`;

    fs.writeFileSync(CONTRIBUTORS_FILE, header + yamlContent);
    console.log('Contributors data updated successfully!');
  } catch (error) {
    console.error('Error saving contributors data:', error);
  }
}

/**
 * 메인 실행 함수
 */
async function main() {
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    console.warn('Warning: GITHUB_TOKEN not found. API rate limits may apply.');
  }

  console.log('Starting contributors update...');

  // 승인된 기여자 목록 로드
  const approvedContributors = loadApprovedContributors();
  console.log(`Found ${approvedContributors.length} approved contributors`);

  // 각 기여자의 정보를 병렬로 가져오기
  const contributorsData = await Promise.all(
    approvedContributors.map(contributor =>
      fetchUserContributions(contributor.githubUsername, githubToken)
    )
  );

  // 결과 저장
  saveContributorsData(approvedContributors, contributorsData);

  console.log('Contributors update completed!');
}

// 스크립트 직접 실행 시
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export {
  fetchUserContributions,
  loadApprovedContributors,
  saveContributorsData,
};
