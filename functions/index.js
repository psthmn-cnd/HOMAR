const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

const createNotification = notification => {
  return admin
    .firestore()
    .collection("notifications")
    .add(notification)
    .then(doc => console.log("notification added", doc));
};

exports.blogPostCreated = functions.firestore
  .document("blogPosts/{postId}")
  .onCreate(blogPost => {
    const post = blogPost.data();

    const notification = {
      content: "Added a new post",
      time: post.createdAt
    };

    return createNotification(notification);
  });

exports.userJoined = functions.auth.user().onCreate(user => {
  return admin
    .firestore()
    .collection("users")
    .doc(user.uid)
    .get()
    .then(doc => {
      const newUser = doc.data();
      const notification = {
        content: `${newUser.nick} registered`,
        time: newUser.registeredAt
      };

      return createNotification(notification);
    });
});

exports.userEdited = functions.auth.user().onUpdate(user => {
  
  // return admin
  // .firestore()
  // .collection('users')
  // .doc(user.uid)
  // .update()
  console.log("user updated")
})

// GIVING USER MODERATOR PERMISSIONS

exports.grantModClaims = functions.https.onCall((data, context) => {
  // get user and add custom claims

  // We are returning this because it's gonna return a promise
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then(user => {
      return admin.auth().setCustomUserClaims(user.uid, {        
        isMod: true
      });
    })
    .then(() => {
      return {
        message: `Badum tss! ${data.email} has become a Moderator!`
      };
    })
    .catch(err => {
      return err;
    });
});

// Disabled because there is only need for one sudo
// ALL THE POWER TO ME
// xd

// exports.grantSudoClaims = functions.https.onCall((data) => {
//     // We are returning this because it's gonna return a promise
//     return admin
//       .auth()
//       .getUserByEmail(data.email)
//       .then(user => {
//         return admin.auth().setCustomUserClaims(user.uid, {
//           isMod: true,
//           isSudo: true
//         });
//       })
//       .then(() => {
//         return {
//           message: `Badum tss! ${data.email} has become a sudo!`
//         };
//       })
//       .catch(err => {
//         return err;
//       });
//   });
