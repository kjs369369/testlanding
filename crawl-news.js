/**
 * 네이버 뉴스 크롤러 - Playwright 사용
 * 2024년 네이버 뉴스 검색 결과 페이지 구조에 맞게 업데이트
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// 설정
const CONFIG = {
  searchKeyword: '식물 관리',
  maxArticles: 50,
  outputFile: path.join(__dirname, 'news-data.json'),
  displayCount: 9
};

async function crawlNaverNews() {
  console.log('🌱 네이버 뉴스 크롤링 시작...');
  console.log(`📰 검색어: ${CONFIG.searchKeyword}`);

  const browser = await chromium.launch({
    headless: true
  });

  const context = await browser.newContext({
    locale: 'ko-KR',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();
  const articles = [];

  try {
    // 네이버 뉴스 검색 (최신순)
    const searchUrl = `https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(CONFIG.searchKeyword)}&sm=tab_opt&sort=1`;

    console.log('🔍 검색 페이지 접속 중...');
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    let scrollCount = 0;
    const maxScrolls = 20;

    while (articles.length < CONFIG.maxArticles && scrollCount < maxScrolls) {
      // 페이지에서 뉴스 아이템 수집
      const newsItems = await page.evaluate(() => {
        const items = [];

        // 새로운 네이버 뉴스 구조 - sds-comps 기반
        // 뉴스 컨테이너 찾기
        const newsSection = document.querySelector('._fe_news_collection, .sp_nnews, .news_area');
        if (!newsSection) {
          console.log('뉴스 섹션 없음');
          return items;
        }

        // 모든 a 태그에서 뉴스 링크 찾기
        const allLinks = document.querySelectorAll('a');

        allLinks.forEach(link => {
          const href = link.href || '';
          const title = link.getAttribute('title') || link.textContent?.trim() || '';

          // 뉴스 링크 필터링 (실제 기사 링크만)
          const isNewsLink = (
            href.includes('news.naver.com/article') ||
            href.includes('n.news.naver.com') ||
            href.includes('articleView.html') ||
            href.includes('/news/') ||
            href.includes('view.html')
          ) && !href.includes('office=') && !href.includes('channelPromotion')
            && !href.includes('search.naver.com') && !href.includes('#');

          if (isNewsLink && title.length > 10) {
            // 이미 수집된 링크인지 확인
            const exists = items.some(item => item.link === href || item.title === title);
            if (!exists) {
              // 부모 요소에서 이미지 찾기
              let thumbnail = null;
              let parent = link.parentElement;
              for (let i = 0; i < 5 && parent; i++) {
                const img = parent.querySelector('img');
                if (img) {
                  thumbnail = img.src || img.getAttribute('data-lazysrc') || img.getAttribute('data-src');
                  if (thumbnail && thumbnail.includes('pstatic')) break;
                }
                parent = parent.parentElement;
              }

              // 언론사 정보 찾기
              let press = '';
              parent = link.parentElement;
              for (let i = 0; i < 5 && parent; i++) {
                const pressEl = parent.querySelector('.sds-comps-profile-info-title-text, .info.press, .press, [class*="source"]');
                if (pressEl) {
                  press = pressEl.textContent?.trim() || '';
                  break;
                }
                parent = parent.parentElement;
              }

              // 설명 찾기
              let description = '';
              parent = link.parentElement;
              for (let i = 0; i < 5 && parent; i++) {
                const descEl = parent.querySelector('.sds-comps-text-type-body2, .dsc_txt, .api_txt_lines, [class*="desc"]');
                if (descEl) {
                  description = descEl.textContent?.trim() || '';
                  break;
                }
                parent = parent.parentElement;
              }

              items.push({
                title: title.substring(0, 100),
                link: href,
                thumbnail: thumbnail,
                press: press,
                description: description.substring(0, 150)
              });
            }
          }
        });

        return items;
      });

      // 수집된 아이템 처리
      for (const item of newsItems) {
        if (articles.length >= CONFIG.maxArticles) break;

        const isDuplicate = articles.some(a => a.link === item.link || a.title === item.title);
        if (!isDuplicate && item.title) {
          articles.push({
            id: articles.length + 1,
            title: item.title,
            link: item.link,
            thumbnail: item.thumbnail || '/logo.png',
            press: item.press || '뉴스',
            date: new Date().toLocaleDateString('ko-KR'),
            description: item.description ? item.description + '...' : ''
          });
          console.log(`  ✓ [${articles.length}] ${item.title.substring(0, 40)}...`);
        }
      }

      console.log(`📜 스크롤 ${scrollCount + 1}회 - 현재 ${articles.length}개 수집`);

      // 스크롤
      await page.evaluate(() => window.scrollBy(0, 800));
      await page.waitForTimeout(1500);

      // 더보기 버튼 클릭 시도
      try {
        const moreButton = await page.$('a.btn_more, .more_btn, button[class*="more"]');
        if (moreButton) {
          await moreButton.click();
          await page.waitForTimeout(2000);
        }
      } catch (e) {}

      scrollCount++;
    }

    console.log(`\n📊 총 ${articles.length}개 기사 수집 완료`);

    // JSON 저장
    const outputData = {
      lastUpdated: new Date().toISOString(),
      lastUpdatedKST: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      keyword: CONFIG.searchKeyword,
      totalCount: articles.length,
      displayCount: CONFIG.displayCount,
      articles: articles
    };

    fs.writeFileSync(
      CONFIG.outputFile,
      JSON.stringify(outputData, null, 2),
      { encoding: 'utf8' }
    );

    console.log(`💾 저장 완료: ${CONFIG.outputFile}`);
    console.log(`🖥️ 메인 노출: ${Math.min(CONFIG.displayCount, articles.length)}개`);

  } catch (error) {
    console.error('❌ 크롤링 오류:', error.message);
  } finally {
    await browser.close();
  }

  return articles;
}

crawlNaverNews().then(() => {
  console.log('\n✅ 크롤링 작업 완료!');
}).catch(err => {
  console.error('❌ 오류 발생:', err);
  process.exit(1);
});
