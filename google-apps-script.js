/**
 * Plant Care 랜딩페이지 - Google Apps Script
 *
 * 설정 방법:
 * 1. Google Sheets (1BVg3LXV-UOxK07Qomc4wzH_nNAVhRCTRvw0Wy4YhRqY) 열기
 * 2. 확장 프로그램 > Apps Script 클릭
 * 3. 아래 코드를 붙여넣기
 * 4. 저장 후 "배포" > "새 배포" 클릭
 * 5. 유형: "웹 앱" 선택
 * 6. 실행 주체: "나" / 액세스 권한: "모든 사용자" 선택
 * 7. 배포 후 생성된 웹 앱 URL을 index.html에 붙여넣기
 *
 * 중요: 코드 수정 후에는 반드시 "새 배포"를 해야 변경사항이 적용됩니다!
 */

// 스프레드시트 ID
const SPREADSHEET_ID = '1BVg3LXV-UOxK07Qomc4wzH_nNAVhRCTRvw0Wy4YhRqY';

/**
 * POST 요청 처리 - 폼 데이터 저장
 */
function doPost(e) {
  // 잠금을 사용하여 동시 쓰기 방지
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000); // 10초 대기

    // 요청 데이터 파싱
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error('데이터가 없습니다.');
    }

    // 필수 필드 확인
    if (!data.name || !data.email || !data.phone) {
      throw new Error('필수 항목이 누락되었습니다.');
    }

    // 스프레드시트 열기
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Sheet1') || ss.getActiveSheet();

    // 헤더가 없으면 추가
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['이름', '이메일', '연락처', '등록일시']);
    }

    // 현재 시간 (한국 시간)
    const now = Utilities.formatDate(
      new Date(),
      'Asia/Seoul',
      'yyyy-MM-dd HH:mm:ss'
    );

    // 데이터 추가
    sheet.appendRow([
      data.name,
      data.email,
      data.phone,
      now
    ]);

    // 성공 응답 (JSONP 형식도 지원)
    const result = JSON.stringify({
      success: true,
      message: '등록이 완료되었습니다.'
    });

    return ContentService
      .createTextOutput(result)
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // 에러 로그 출력
    Logger.log('doPost 에러: ' + error.toString());

    const errorResult = JSON.stringify({
      success: false,
      message: error.message || '알 수 없는 오류가 발생했습니다.'
    });

    return ContentService
      .createTextOutput(errorResult)
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

/**
 * GET 요청 처리 - 테스트 및 CORS preflight 대응
 */
function doGet(e) {
  // callback 파라미터가 있으면 JSONP로 응답
  const callback = e.parameter.callback;
  const result = {
    status: 'ok',
    message: 'Plant Care Registration API is running'
  };

  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + JSON.stringify(result) + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 테스트 함수 - Apps Script 에디터에서 실행하여 테스트
 * 실행 방법: 이 함수를 선택하고 "실행" 버튼 클릭
 */
function testAddRow() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        name: '테스트사용자',
        email: 'test@example.com',
        phone: '010-1234-5678'
      })
    }
  };

  const result = doPost(testData);
  Logger.log('테스트 결과: ' + result.getContent());
}

/**
 * 스프레드시트 연결 테스트
 */
function testConnection() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getActiveSheet();
    Logger.log('연결 성공! 시트 이름: ' + sheet.getName());
    Logger.log('현재 행 수: ' + sheet.getLastRow());
  } catch (error) {
    Logger.log('연결 실패: ' + error.toString());
  }
}
