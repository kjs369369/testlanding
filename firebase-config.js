// ============================================
// Firebase 설정 및 초기화
// ============================================

// Firebase SDK (CDN 버전용 전역 변수)
// 프로덕션에서는 환경변수 사용 권장
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Firebase 앱 초기화
let app, auth, db;

function initializeFirebase() {
  if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
  } else {
    app = firebase.app();
  }
  auth = firebase.auth();
  db = firebase.firestore();

  // 한국어 설정
  auth.languageCode = 'ko';

  console.log('Firebase 초기화 완료');
  return { app, auth, db };
}

// ============================================
// 인증 관련 함수
// ============================================

// Google 로그인
async function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('email');
  provider.addScope('profile');

  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;

    // Firestore에 사용자 정보 저장
    await saveUserToFirestore(user);

    return {
      success: true,
      user: {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        picture: user.photoURL,
        isNewUser: result.additionalUserInfo?.isNewUser
      }
    };
  } catch (error) {
    console.error('Google 로그인 실패:', error);
    return { success: false, error: error.message };
  }
}

// 이메일/비밀번호 회원가입
async function signUpWithEmail(email, password, name) {
  try {
    const result = await auth.createUserWithEmailAndPassword(email, password);
    const user = result.user;

    // 프로필 업데이트
    await user.updateProfile({ displayName: name });

    // Firestore에 사용자 정보 저장
    await saveUserToFirestore(user, name);

    return {
      success: true,
      user: {
        uid: user.uid,
        name: name,
        email: user.email,
        picture: null
      }
    };
  } catch (error) {
    console.error('회원가입 실패:', error);
    let message = error.message;
    if (error.code === 'auth/email-already-in-use') {
      message = '이미 사용 중인 이메일입니다.';
    } else if (error.code === 'auth/weak-password') {
      message = '비밀번호는 6자 이상이어야 합니다.';
    } else if (error.code === 'auth/invalid-email') {
      message = '올바른 이메일 형식이 아닙니다.';
    }
    return { success: false, error: message };
  }
}

// 이메일/비밀번호 로그인
async function signInWithEmail(email, password) {
  try {
    const result = await auth.signInWithEmailAndPassword(email, password);
    const user = result.user;

    // 마지막 로그인 시간 업데이트
    await db.collection('users').doc(user.uid).update({
      lastLoginAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    return {
      success: true,
      user: {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        picture: user.photoURL
      }
    };
  } catch (error) {
    console.error('로그인 실패:', error);
    let message = error.message;
    if (error.code === 'auth/user-not-found') {
      message = '등록되지 않은 이메일입니다.';
    } else if (error.code === 'auth/wrong-password') {
      message = '비밀번호가 올바르지 않습니다.';
    }
    return { success: false, error: message };
  }
}

// 로그아웃
async function signOut() {
  try {
    await auth.signOut();
    localStorage.removeItem('plantcare_user');
    return { success: true };
  } catch (error) {
    console.error('로그아웃 실패:', error);
    return { success: false, error: error.message };
  }
}

// 현재 사용자 가져오기
function getCurrentUser() {
  return auth.currentUser;
}

// 인증 상태 변경 리스너
function onAuthStateChanged(callback) {
  return auth.onAuthStateChanged(callback);
}

// ============================================
// Firestore 데이터 함수
// ============================================

// 사용자 정보 저장
async function saveUserToFirestore(user, displayName = null) {
  const userData = {
    uid: user.uid,
    email: user.email,
    name: displayName || user.displayName || user.email.split('@')[0],
    picture: user.photoURL || null,
    isPro: false,
    subscriptionType: null,
    subscriptionStartDate: null,
    subscriptionEndDate: null,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    lastLoginAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  // 기존 데이터가 있으면 병합
  await db.collection('users').doc(user.uid).set(userData, { merge: true });

  return userData;
}

// 사용자 정보 가져오기
async function getUserFromFirestore(uid) {
  const doc = await db.collection('users').doc(uid).get();
  if (doc.exists) {
    return doc.data();
  }
  return null;
}

// 사용자 정보 업데이트
async function updateUserInFirestore(uid, data) {
  await db.collection('users').doc(uid).update({
    ...data,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// ============================================
// 결제 관련 함수
// ============================================

// 결제 정보 저장
async function savePaymentToFirestore(paymentData) {
  const user = getCurrentUser();
  if (!user) return null;

  const payment = {
    uid: user.uid,
    userEmail: user.email,
    orderId: paymentData.orderId,
    orderName: paymentData.orderName,
    amount: paymentData.totalAmount,
    method: paymentData.method,
    paymentKey: paymentData.paymentKey,
    status: 'completed',
    approvedAt: paymentData.approvedAt,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  // 결제 내역 저장
  const docRef = await db.collection('payments').add(payment);

  // 사용자 구독 상태 업데이트
  const isYearly = paymentData.orderName.includes('연간');
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + (isYearly ? 12 : 1));

  await updateUserInFirestore(user.uid, {
    isPro: true,
    subscriptionType: isYearly ? 'yearly' : 'monthly',
    subscriptionStartDate: startDate.toISOString(),
    subscriptionEndDate: endDate.toISOString()
  });

  return docRef.id;
}

// 결제 내역 가져오기
async function getPaymentHistory(uid) {
  const snapshot = await db.collection('payments')
    .where('uid', '==', uid)
    .orderBy('createdAt', 'desc')
    .limit(10)
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// ============================================
// 식물 관련 함수
// ============================================

// 식물 추가
async function addPlant(plantData) {
  const user = getCurrentUser();
  if (!user) return null;

  const plant = {
    uid: user.uid,
    name: plantData.name,
    location: plantData.location || '',
    wateringInterval: plantData.wateringInterval || 7,
    lastWateredAt: plantData.lastWateredAt || new Date().toISOString(),
    nextWateringAt: plantData.nextWateringAt || null,
    imageUrl: plantData.imageUrl || null,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  const docRef = await db.collection('plants').add(plant);
  return { id: docRef.id, ...plant };
}

// 식물 목록 가져오기
async function getPlants(uid) {
  const snapshot = await db.collection('plants')
    .where('uid', '==', uid)
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// 식물 업데이트
async function updatePlant(plantId, data) {
  await db.collection('plants').doc(plantId).update({
    ...data,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// 식물 삭제
async function deletePlant(plantId) {
  await db.collection('plants').doc(plantId).delete();
}

// ============================================
// 챗봇 로그 저장
// ============================================

async function saveChatLog(sessionId, role, message) {
  const user = getCurrentUser();

  await db.collection('chatLogs').add({
    uid: user?.uid || 'anonymous',
    sessionId: sessionId,
    role: role,
    message: message,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// ============================================
// 관리자 함수
// ============================================

// 전체 사용자 수 가져오기
async function getTotalUsers() {
  const snapshot = await db.collection('users').get();
  return snapshot.size;
}

// 프로 사용자 수 가져오기
async function getProUsers() {
  const snapshot = await db.collection('users').where('isPro', '==', true).get();
  return snapshot.size;
}

// 최근 가입 사용자 가져오기
async function getRecentUsers(limit = 10) {
  const snapshot = await db.collection('users')
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// 최근 결제 내역 가져오기
async function getRecentPayments(limit = 10) {
  const snapshot = await db.collection('payments')
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// 총 매출 계산
async function getTotalRevenue() {
  const snapshot = await db.collection('payments')
    .where('status', '==', 'completed')
    .get();

  let total = 0;
  snapshot.docs.forEach(doc => {
    total += doc.data().amount || 0;
  });

  return total;
}

// 월별 매출 가져오기
async function getMonthlyRevenue() {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const snapshot = await db.collection('payments')
    .where('status', '==', 'completed')
    .where('createdAt', '>=', firstDayOfMonth)
    .get();

  let total = 0;
  snapshot.docs.forEach(doc => {
    total += doc.data().amount || 0;
  });

  return total;
}
