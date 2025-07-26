const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore"); // เพ่ือใช้ข้อมูลใน database
const { getAuth } = require("firebase-admin/auth"); // ใช้เพื่ออ่าน token

initializeApp({
  projectId: "easy-commerce-by-moo-msn",
});

const db = getFirestore();
const auth = getAuth();

module.exports = {
  db,
  auth,
};
