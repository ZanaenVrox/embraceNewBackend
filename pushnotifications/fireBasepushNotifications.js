const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with your project credentials
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'embrace-f1d4a',
    clientEmail: 'firebase-adminsdk-wgoqm@embrace-f1d4a.iam.gserviceaccount.com',
    privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDDQyJb52Vje9Q5\ntJWPrGWifS3WVF44EGl0xn8aXvwwb+OB0Arn8Kd8/M6pxHsG7/NZRSjIWZ3hedXG\nnQ1csQPby373wXqaAVq+eSButmH8w6LgMHBUz9Wv9LVQfAGSsvDrlsQbHS0BYpGn\nusdue0KhkmXxEDYsqeaCubiuodMcPYu+xsnSJIW7LTsVhwgSw4Y2Sxr0c8jwq1zp\nGaS+Uy6Dhh17BQqLujUCapyLHy8fft3mIdRVNiOumF1X61zJiHv+nPKMP5RH7dcw\njNcU+hkAxtZyCo1QsfhhGvDNc7tJJFkXcRXqgDy83EzUqtIcO3sfqDQvPmteN4y5\nDnVvoaQbAgMBAAECggEASufVJXZ2QZy+REjPWydicdwdmmwRHObG3cJL/hzUF+zE\nVQcvN9ztE5iT2zKBk563Nta+F2WxmE65wJB9EMLjXQ0Krxas5qmAWzNySqZynpma\nQPC0FwUHz5FLgQ2hONqma2oR3ujpW++pOrP/T5W/cOYNb1WtwqKGyD1g6LUxnFIg\nNuIlVJCa+fO2e0ZaBb54tf9LfnXZH1ysXTjxCW0Z1Gc9r1Pa7fMlRG074iztgZrH\nQFJHDjvK9V84J5y+HGS/uxDKjpjjLE4guK6Q025aPdjUyyrj3m15LSzZSkLOwraJ\nfIYNzuGFzYV+KYKGVXJnPQfqtvYLdrZFiFg66mBfMQKBgQDplT6Np02KvMTPC8LK\nm0rKeU3APRdcwsa7BK1hDs7TCWp0C2h0Zu7KiWubWbbYIwi0QFeW8/cJ53AXMzZx\nM7Lyp3Gm2jQAa0fIBt2OoH/YyuuRSppH++zV/30he8T/K1S49pKaBvjrYSAOeN4R\nNsId15WEmVP+LoYCpyMKzKJu+QKBgQDWAGlJu8TZltq072+mhPAo+3WtQjed6KdY\npm2lhrQxQ91iZYaCENDM3wU2fp0eiezU8q7yVtyfg5/sjHU9xHYns6RUXfkwsSAT\noonoZyBaLISzmrqVNc0m6ofxcJNSuLcnnfd1WiwqqgQTHPn/CnhUNvG/c4gZarGr\nUetiI2VsswKBgQCSk0G2mCazibMijanFg99R4P7mRC+12M/mKZA22Jj2mvD/Mu1w\nJetwkv1AdfKj/JAItFuCcUMzJtUS6eMe9Cc119ccsc5x+OAJaC19w7+WJffeq2bX\nBwJeYz19VnKPAPzgOHJUT03CPqdkDXqkaK01FsRPefvYBA+5+HGn5DOF2QKBgDHJ\ncLVdwONabFFx7wjPnsv6DJudbzEGooBGX/YFi8B2aHfu5Mc3wEwZiq3t8QHc1sOI\nHll1Cej2h2tSFiijn1WHPrD+F+5TFwJaazktXOJ9vvXGBqiWFr96CtyJ80xoevv1\njU+5BdN7MG197U9/kRUOn1mKOFypbOJNsbRoRb1vAoGBAORuEJ+liYTcw4CtLuQM\nLJL+0CLqHTozC5uHP/UcUIoKCnH7xzBwJReLPRETTpvHqFrWYPGjWweTuAI+uAdV\niwsc9C06mPZkYKgaX2ICwxDB8LcLFR6YVBkRB4wmxJtzXqUGDt04RsZfxA8bAkJ/\nMUCBGBPZzvrx6BMr4XMjgWq9\n-----END PRIVATE KEY-----\n',
  }),
});

// Function to send a push notification
function sendPushNotification(token, title, body) {
  // Set the message payload
  const payload = {
    notification: {
      title,
      body,
    },
  };

  // Set the target device or topic
  const target = {
    token,
  };

  // Send the message
  admin.messaging().send({
    ...target,
    ...payload,
  })
    .then((response) => {
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });
}

module.exports = { sendPushNotification };