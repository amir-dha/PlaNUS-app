/**
 * Firebase Cloud Function to delete user data when the user is deleted.
 */
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * Deletes a collection in batches to avoid exceeding Firestore limits.
 *
 * @param {Firestore} db - Firestore database instance.
 * @param {string} collectionPath - Path to the collection to delete.
 * @param {number} batchSize - Number of documents to delete per batch.
 * @return {Promise} Promise that resolves when the collection is deleted.
 */
async function deleteCollection(db, collectionPath, batchSize) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve, reject);
  });
}

/**
 * Deletes a batch of documents from a Firestore query.
 *
 * @param {Firestore} db - Firestore database instance.
 * @param {Query} query - Firestore query to get documents to delete.
 * @param {Function} resolve - Function to call when deletion is complete.
 * @param {Function} reject - Function to call if an error occurs.
 */
function deleteQueryBatch(db, query, resolve, reject) {
  query
      .get()
      .then((snapshot) => {
        if (snapshot.size === 0) {
          return 0;
        }

        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        return batch.commit().then(() => {
          return snapshot.size;
        });
      })
      .then((numDeleted) => {
        if (numDeleted === 0) {
          resolve();
          return;
        }

        process.nextTick(() => {
          deleteQueryBatch(db, query, resolve, reject);
        });
      })
      .catch(reject);
}

exports.deleteUserData = functions.auth.user().onDelete(async (user) => {
  const uid = user.uid;

  // Firestore: Reference to the user's document
  const userDocRef = admin.firestore().collection("users").doc(uid);

  try {
    // Delete subcollections
    await deleteCollection(admin
        .firestore(), `users/${uid}/eisenhowerTasks`, 10);
    await deleteCollection(admin.firestore(), `users/${uid}/events`, 10);
    await deleteCollection(admin.firestore(), `users/${uid}/tasks`, 10);
    await deleteCollection(admin.firestore(), `users/${uid}/plans`, 10);

    // Delete user document
    await userDocRef.delete();

    console
        .log(`Successfully deleted user document 
          and subcollections for UID: ${uid}`);
  } catch (error) {
    console
        .error(`Error deleting user document 
          and subcollections for UID: ${uid}`, error);
  }
});
