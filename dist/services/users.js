"use strict";
const db = require('./firebase.js');
async function getAllUsers() {
    const usersSnapshot = await db.collection('users').get();
    const users = [];
    usersSnapshot.forEach(doc => {
        users.push({ id: doc.id, ...doc.data() });
    });
    return users;
}
async function createUser(userData) {
    const { email, password, name } = userData;
    const userRef = await db.collection('users').add({
        email,
        name,
        updated_at: new Date().toISOString(),
    });
    return { id: userRef.id, email, name };
}
async function getUserById(id) {
    const userDoc = await db.collection('users').doc(id).get();
    if (!userDoc.exists) {
        return null;
    }
    return { id: userDoc.id, ...userDoc.data() };
}
async function updateUser(id, userData) {
    const userRef = db.collection('users').doc(id);
    await userRef.update({
        ...userData,
        updated_at: new Date().toISOString(),
    });
    const updatedDoc = await userRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
}
async function deleteUser(id) {
    await db.collection('users').doc(id).delete();
}
module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
};
