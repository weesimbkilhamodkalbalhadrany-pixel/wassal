const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FCM_PROJECT_ID,
      clientEmail: process.env.FCM_CLIENT_EMAIL,
      privateKey: process.env.FCM_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

module.exports = async (req, res) => {
  const { token, title, body } = req.body;
  const message = {
    notification: { title, body },
    token: token,
  };

  try {
    await admin.messaging().send(message);
    res.status(200).send('تم إرسال الإشعار بنجاح!');
  } catch (error) {
    res.status(500).send('خطأ في الإرسال: ' + error.message);
  }
};
