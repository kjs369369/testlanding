// ============================================
// Firebase 설정 및 초기화
// ============================================

// Firebase SDK (CDN 버전용 전역 변수)
// 프로덕션에서는 환경변수 사용 권장
const firebaseConfig = {
  apiKey: "AIzaSyAwBB98Vvqd6BzDtRXf504Sm-qDHUN64HY",
  authDomain: "aimayplant-care.firebaseapp.com",
  projectId: "aimayplant-care",
  storageBucket: "aimayplant-care.firebasestorage.app",
  messagingSenderId: "615981143989",
  appId: "1:615981143989:web:639a7deab97c4d3f01abfc",
  measurementId: "G-H4E7MP3PGK"
};

// Firebase 앱 초기화
let app, auth, db, storage;

function initializeFirebase() {
  if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
  } else {
    app = firebase.app();
  }
  auth = firebase.auth();
  db = firebase.firestore();
  storage = firebase.storage();

  // 한국어 설정
  auth.languageCode = 'ko';

  console.log('Firebase 초기화 완료');
  return { app, auth, db, storage };
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

// ============================================
// 리뷰 관련 함수
// ============================================

// 이미지를 Firebase Storage에 업로드
async function uploadReviewImage(file, reviewId) {
  if (!file) return null;

  try {
    const user = getCurrentUser();
    if (!user) throw new Error('로그인이 필요합니다.');

    // 파일 확장자 추출
    const ext = file.name.split('.').pop().toLowerCase();
    const allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!allowedExts.includes(ext)) {
      throw new Error('지원하지 않는 이미지 형식입니다.');
    }

    // 파일명 생성: reviews/{userId}/{timestamp}.{ext}
    const timestamp = Date.now();
    const fileName = `reviews/${user.uid}/${timestamp}.${ext}`;
    const storageRef = storage.ref(fileName);

    // 이미지 압축 후 업로드
    const compressedBlob = await compressImage(file, 1200, 1200, 0.8);

    // 업로드 시작
    const uploadTask = storageRef.put(compressedBlob, {
      contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`
    });

    // 업로드 완료 대기
    await uploadTask;

    // 다운로드 URL 가져오기
    const downloadUrl = await storageRef.getDownloadURL();
    console.log('이미지 업로드 완료:', downloadUrl);

    return downloadUrl;
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    throw error;
  }
}

// 이미지 압축 (Blob 반환)
function compressImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // 비율 유지하며 리사이즈
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Blob으로 변환
        canvas.toBlob(
          (blob) => {
            if (blob) {
              console.log(`이미지 압축: ${Math.round(file.size / 1024)}KB → ${Math.round(blob.size / 1024)}KB`);
              resolve(blob);
            } else {
              reject(new Error('이미지 압축 실패'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('이미지 로드 실패'));
      img.src = event.target.result;
    };
    reader.onerror = (error) => reject(error);
  });
}

// 리뷰 추가 (텍스트만 먼저 저장, 이미지는 별도 처리)
async function addReview(reviewData) {
  const user = getCurrentUser();
  if (!user) return { success: false, error: '로그인이 필요합니다.' };

  try {
    const review = {
      uid: user.uid,
      userName: user.displayName || user.email.split('@')[0],
      userPhoto: user.photoURL || null,
      rating: reviewData.rating,
      content: reviewData.content || reviewData.text,
      imageUrl: null, // 이미지 URL은 나중에 업데이트
      productType: reviewData.productType || 'pro',
      isApproved: true,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('reviews').add(review);
    return { success: true, id: docRef.id, review: review };
  } catch (error) {
    console.error('리뷰 추가 실패:', error);
    return { success: false, error: error.message };
  }
}

// 리뷰에 이미지 URL 업데이트
async function updateReviewImage(reviewId, imageUrl) {
  try {
    await db.collection('reviews').doc(reviewId).update({
      imageUrl: imageUrl
    });
    return { success: true };
  } catch (error) {
    console.error('리뷰 이미지 업데이트 실패:', error);
    return { success: false, error: error.message };
  }
}

// 리뷰와 이미지를 함께 추가 (이미지는 Storage에 별도 저장)
async function addReviewWithImage(reviewData, imageFile) {
  const user = getCurrentUser();
  if (!user) return { success: false, error: '로그인이 필요합니다.' };

  try {
    // 1. 텍스트 리뷰 먼저 저장
    const review = {
      uid: user.uid,
      userName: user.displayName || user.email.split('@')[0],
      userPhoto: user.photoURL || null,
      rating: reviewData.rating,
      content: reviewData.content || reviewData.text,
      imageUrl: null,
      productType: reviewData.productType || 'pro',
      isApproved: true,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('reviews').add(review);
    const reviewId = docRef.id;

    // 2. 이미지가 있으면 Storage에 업로드 후 URL 업데이트
    if (imageFile) {
      try {
        const imageUrl = await uploadReviewImage(imageFile, reviewId);
        if (imageUrl) {
          await db.collection('reviews').doc(reviewId).update({ imageUrl });
          review.imageUrl = imageUrl;
        }
      } catch (imgError) {
        console.error('이미지 업로드 실패 (리뷰는 저장됨):', imgError);
        // 이미지 업로드 실패해도 리뷰는 유지
      }
    }

    return { success: true, id: reviewId, review: review };
  } catch (error) {
    console.error('리뷰 추가 실패:', error);
    return { success: false, error: error.message };
  }
}

// 리뷰 목록 가져오기
async function getReviews(productType = 'pro', limitCount = 20) {
  try {
    // 복합 인덱스 없이 작동하도록 단순 쿼리 사용
    const snapshot = await db.collection('reviews')
      .where('productType', '==', productType)
      .where('isApproved', '==', true)
      .get();

    // 클라이언트에서 정렬 및 제한
    const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // createdAt 기준 내림차순 정렬
    reviews.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return dateB - dateA;
    });

    return reviews.slice(0, limitCount);
  } catch (error) {
    console.error('리뷰 목록 가져오기 실패:', error);
    return [];
  }
}

// 평균 별점 계산
async function getAverageRating(productType = 'pro') {
  try {
    const snapshot = await db.collection('reviews')
      .where('productType', '==', productType)
      .where('isApproved', '==', true)
      .get();

    if (snapshot.size === 0) return { average: 0, count: 0 };

    let total = 0;
    snapshot.docs.forEach(doc => {
      total += doc.data().rating || 0;
    });

    return {
      average: (total / snapshot.size).toFixed(1),
      count: snapshot.size
    };
  } catch (error) {
    console.error('평균 별점 계산 실패:', error);
    return { average: 0, count: 0 };
  }
}

// 리뷰 삭제 (본인 리뷰만)
async function deleteReview(reviewId) {
  const user = getCurrentUser();
  if (!user) return { success: false, error: '로그인이 필요합니다.' };

  try {
    const doc = await db.collection('reviews').doc(reviewId).get();
    if (!doc.exists) return { success: false, error: '리뷰를 찾을 수 없습니다.' };
    if (doc.data().uid !== user.uid) return { success: false, error: '본인의 리뷰만 삭제할 수 있습니다.' };

    await db.collection('reviews').doc(reviewId).delete();
    return { success: true };
  } catch (error) {
    console.error('리뷰 삭제 실패:', error);
    return { success: false, error: error.message };
  }
}

