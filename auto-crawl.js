/**
 * 자동 뉴스 크롤링 스크립트
 * 1시간마다 자동으로 뉴스를 크롤링합니다.
 *
 * 실행 방법:
 * node auto-crawl.js
 *
 * 백그라운드 실행 (Windows):
 * start /b node auto-crawl.js > crawl-log.txt 2>&1
 *
 * PM2 사용 (권장):
 * npm install -g pm2
 * pm2 start auto-crawl.js --name "news-crawler"
 * pm2 save
 * pm2 startup
 */

const { spawn } = require('child_process');
const path = require('path');

const CRAWL_INTERVAL = 60 * 60 * 1000; // 1시간 (밀리초)
const CRAWLER_SCRIPT = path.join(__dirname, 'crawl-news.js');

function runCrawler() {
  const timestamp = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  console.log(`\n${'='.repeat(50)}`);
  console.log(`[${timestamp}] 크롤링 시작...`);
  console.log(`${'='.repeat(50)}`);

  const crawler = spawn('node', [CRAWLER_SCRIPT], {
    cwd: __dirname,
    stdio: 'inherit'
  });

  crawler.on('close', (code) => {
    const endTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    if (code === 0) {
      console.log(`[${endTime}] 크롤링 완료 (성공)`);
    } else {
      console.error(`[${endTime}] 크롤링 실패 (코드: ${code})`);
    }
    console.log(`다음 크롤링: ${new Date(Date.now() + CRAWL_INTERVAL).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`);
  });

  crawler.on('error', (err) => {
    console.error('크롤러 실행 오류:', err.message);
  });
}

// 시작 메시지
console.log(`
╔════════════════════════════════════════════════╗
║     식물 관리 뉴스 자동 크롤러                  ║
║     Auto News Crawler for Plant Care           ║
╠════════════════════════════════════════════════╣
║  크롤링 주기: 1시간                            ║
║  대상: 네이버 뉴스                             ║
║  키워드: 식물 관리                             ║
╚════════════════════════════════════════════════╝
`);

// 즉시 한 번 실행
runCrawler();

// 1시간마다 실행
setInterval(runCrawler, CRAWL_INTERVAL);

console.log('자동 크롤러가 시작되었습니다. Ctrl+C로 종료할 수 있습니다.');
