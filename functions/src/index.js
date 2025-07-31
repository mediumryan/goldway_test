import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const setRole = functions.https.onCall(async (data, context) => {
  // 1. 인증 확인
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  const { uid, role } = data;

  if (!uid || typeof role !== 'string') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with a uid and a role (string).'
    );
  }

  try {
    // 2. Custom Claims 설정
    await admin.auth().setCustomUserClaims(uid, { role });

    // 3. 토큰 강제 갱신
    await admin.auth().revokeRefreshTokens(uid);

    return {
      success: true,
      message: `Custom claim 'role:${role}' set for user ${uid}`,
    };
  } catch (error) {
    let errorMessage = 'Failed to set custom claim.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new functions.https.HttpsError('internal', errorMessage);
  }
});
