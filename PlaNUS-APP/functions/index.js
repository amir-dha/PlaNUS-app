const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.deleteUserData = functions.auth.user().onDelete(async (user) => {
  const uid = user.uid;

  // Firestore: Delete user document and related documents
  const userDocRef = admin.firestore().collection("users").doc(uid);
  const userPostsCollection = admin.firestore().collection("userPosts");
  const tasksCollection = admin.firestore().collection("tasks");
  const eisenhowerTasksCollection = admin.firestore()
      .collection("eisenhowerTasks");
  const eventsCollection = admin.firestore().collection("events");

  try {
    // Delete user document
    await userDocRef.delete();

    // Delete related documents in 'userPosts' collection
    const userPostsSnapshot = await userPostsCollection
        .where("userId", "==", uid)
        .get();
    userPostsSnapshot.forEach(async (doc) => {
      await doc.ref.delete();
    });

    // Delete related documents in 'tasks' collection
    const tasksSnapshot = await tasksCollection
        .where("userId", "==", uid)
        .get();
    tasksSnapshot.forEach(async (doc) => {
      await doc.ref.delete();
    });

    // Delete related documents in 'eisenhowerTasks' collection
    const eisenhowerTasksSnapshot = await eisenhowerTasksCollection
        .where("userId", "==", uid)
        .get();
    eisenhowerTasksSnapshot.forEach(async (doc) => {
      await doc.ref.delete();
    });

    const eventsSnapshot = await eventsCollection
        .where("userId", "==", uid)
        .get();
    eventsSnapshot.forEach(async (doc) => {
      await doc.ref.delete();
    });

    // Firebase Storage: Delete user-specific files
    const userProfilePicRef = admin
        .storage()
        .bucket()
        .file(`users/${uid}/profile.jpg`);
    await userProfilePicRef.delete();

    console.log(`Successfully deleted user data for UID: ${uid}`);
  } catch (error) {
    console.error(`Error deleting user data for UID: ${uid}`, error);
  }
});
