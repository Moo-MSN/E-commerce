const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore"); // เพ่ือใช้ข้อมูลใน database
const { getAuth } = require("firebase-admin/auth"); // ใช้เพื่ออ่าน token
const {getDatabase} = require("firebase-admin/database"); // ใช้เพื่ออ่านข้อมูล realtime database

initializeApp({
  projectId: "easy-commerce-by-moo-msn",
  databaseURL: "http://127.0.0.1:9004/?ns=easy-commerce-by-moo-msn-default-rtdb"
});

const db = getFirestore();
const auth = getAuth();
const realtimeDb = getDatabase(); // เรียกใช้ realtime database

module.exports = {
  db,
  auth,
  realtimeDb
};
