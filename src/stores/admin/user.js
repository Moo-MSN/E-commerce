import { defineStore } from "pinia";

// import firebase and firestore for user database
import { db } from "@/firebase";
import { collection, doc, getDocs, getDoc, setDoc } from "firebase/firestore";
import { useRoute } from "vue-router";

export const useAdminUserStore = defineStore("admin-user", {
  state: () => ({
    list: [],
  }),
  actions: {
    // concept คือ 1.จิ่มไปที่ไหน 2.คำสั่งที่ใช้จิ่ม
    async loadUser() {
      // จิ่มไปที่ db,"users"
      const userCol = collection(db, "users");
      // ทำการดึงโดยใช้ getDocs(userCol) จะได้มาเก็บไว้ที่ userSnapshot.docs ที่ firestore มีการเตรียมเอาไว้ให้สำหรับ loop ข้อมูลออกมาใช้งาน
      const userSnapshot = await getDocs(userCol);
      // ทำการ convert userSnapshot.docs ด้วย .map แล้ว retrun เป็น doc.data() ที่ใช้ใน javaScript ได้ แล้วเก็บไว้ที่ userList
      const userList = userSnapshot.docs.map((doc) => {
        let convertedUser = doc.data();
        // ทำกาดึง uid ด้วย doc.id
        convertedUser.uid = doc.id;
        // ทำการ convert time stamp ของ firestore ที่เป็น nanosec เป็นแบบธรรมดา ใน javaScript โดยการใช้ .toDate()
        convertedUser.updatedAt = convertedUser.updatedAt.toDate();
        return convertedUser;
      });
      // ทำการดึงข้อมูลมาแสดงในหน้า admin ListView
      this.list = userList;
    },
    async getUser(index) {
      return this.list[index];
    },
    async updateUser(index, userData) {
      const fields = ["adminName", "role", "status"];
      for (let field of fields) {
        // เป็นการ loop field ใน [] ออกมา
        this.list[index][field] = userData[field];
      }
      this.list[index].updatedAt = new Date().toISOString();
    }, // ตัวด้านบนสามารถเขียนอีกแบบได้เหมือนก้านล่าง
    // ด้านล่างคือการใช้แบบยาว เก็บ index และค่าของ userData
    //this.list[index].adminName = userData.adminName
    //this.list[index].role = userData.role
    //this.list[index].status = userData.status
    //this.list[index].updatedAt = userData.updatedAt
  },
});
