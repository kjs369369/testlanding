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
 *
 * 시트 구조:
 * - Sheet1: 사전등록 폼 데이터 (이름, 이메일, 연락처, 등록일시)
 * - test2: 챗봇 대화 내용 (세션ID, 역할, 메시지, 시간)
 */

// 스프레드시트 ID
const SPREADSHEET_ID = '1BVg3LXV-UOxK07Qomc4wzH_nNAVhRCTRvw0Wy4YhRqY';

/**
 * POST 요청 처리 - 폼 데이터 또는 챗봇 대화 저장
 */
function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(10000);

    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error('데이터가 없습니다.');
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    // 챗봇 대화 저장 요청인 경우
    if (data.type === 'chatbot') {
      return saveChatbotMessage(ss, data);
    }

    // 기존 등록 폼 요청인 경우
    return saveRegistration(ss, data);

  } catch (error) {
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
 * 등록 폼 데이터 저장 (Sheet1)
 */
function saveRegistration(ss, data) {
  if (!data.name || !data.email || !data.phone) {
    throw new Error('필수 항목이 누락되었습니다.');
  }

  const sheet = ss.getSheetByName('Sheet1') || ss.getActiveSheet();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['이름', '이메일', '연락처', '등록일시']);
  }

  const now = Utilities.formatDate(
    new Date(),
    'Asia/Seoul',
    'yyyy-MM-dd HH:mm:ss'
  );

  sheet.appendRow([
    data.name,
    data.email,
    data.phone,
    now
  ]);

  const result = JSON.stringify({
    success: true,
    message: '등록이 완료되었습니다.'
  });

  return ContentService
    .createTextOutput(result)
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 챗봇 대화 내용 저장 (test2 시트)
 */
function saveChatbotMessage(ss, data) {
  // test2 시트 가져오기 (없으면 생성)
  let sheet = ss.getSheetByName('test2');
  if (!sheet) {
    sheet = ss.insertSheet('test2');
    // 헤더 추가
    sheet.appendRow(['세션ID', '역할', '메시지', '시간']);
    // 헤더 스타일링
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#4CAF50').setFontColor('white');
    sheet.setColumnWidth(1, 150);
    sheet.setColumnWidth(2, 80);
    sheet.setColumnWidth(3, 400);
    sheet.setColumnWidth(4, 150);
  }

  const now = Utilities.formatDate(
    new Date(),
    'Asia/Seoul',
    'yyyy-MM-dd HH:mm:ss'
  );

  // 대화 데이터 저장
  sheet.appendRow([
    data.sessionId || 'unknown',
    data.role || 'unknown',      // 'user' 또는 'assistant'
    data.message || '',
    now
  ]);

  const result = JSON.stringify({
    success: true,
    message: '대화가 저장되었습니다.'
  });

  return ContentService
    .createTextOutput(result)
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * GET 요청 처리 - 테스트 및 CORS preflight 대응
 */
function doGet(e) {
  const callback = e.parameter.callback;
  const result = {
    status: 'ok',
    message: 'Plant Care API is running'
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
 * 테스트 함수 - 등록 폼
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
 * 테스트 함수 - 챗봇 대화 저장
 */
function testChatbot() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        type: 'chatbot',
        sessionId: 'test-session-123',
        role: 'user',
        message: '몬스테라 물 주기는 어떻게 해야 하나요?'
      })
    }
  };

  const result = doPost(testData);
  Logger.log('챗봇 테스트 결과: ' + result.getContent());
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
