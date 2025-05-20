import { defineStore } from "pinia";

//import มาจาก UserLayoutเพื่อนำมาแยกให้ใช้ร่วมกันกับหน้าอื่นได้
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";

const provider = new GoogleAuthProvider();

export const useAccountStore = defineStore("account", {
  state: () => ({
    isLoggedIn: false, // สร้างมาเช็คว่า login แล้วหรือยัง
    user: {}, // เอาไว้เก็บ user information เอาไว้
    isAdmin: false, // เพิ่มมาสำหรับการ login แบบ Admin
  }),
  actions: {
    async checkAuth() {
      // สร้าง new Promise เมื่อ user มีค่าให้ resolve เป็น true ถ้าไม่มีเป็น false
      return new Promise((resolve) => {
        // เพิ่มการ onAuthStateChanged เพื่อให้ login ค้างไว้ได้
        onAuthStateChanged(auth, (user) => {
          if (user) {
            // User is signed in, see docs for a list of available properties
            this.user = user;
            // ถ้า user.email เป็น admin@test.com ให้ Login ค้างไว้ได้ แม้จะทำการ refresh page
            if (user.email === "admin@test.com") {
              this.isAdmin = true;
            }
            this.isLoggedIn = true;
            // ถ้ามี user resolve เป็น true
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    },
    async signInWithGoogle() {
      // try,catch เพื่อป้องกัน error
      try {
        const result = await signInWithPopup(auth, provider);
        this.isLoggedIn = true; //ถ้า login แล้วไม่มี error จะ login สำเร็จ
        this.user = result.user; // ก็จะได้ user ที่ทำการ login ออกมา
        console.log(this.user);
      } catch (error) {
        console.log("error", error);
      }
    },
    // เพิ่มมาสำหรับ Admin Login เราสามารถสร้าง Admin user ได้ใน firebase authentication
    async signInAdmin(email, password) {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        this.isLoggedIn = true;
        this.isAdmin = true;
        this.user = result.user;
      } catch (error) {
        console.log("error store = ", error.code);
        //การโยน error ไปแสดงใน console
        switch (error.code) {
          case "auth/invalid-email":
            throw new Error("Invalid-Email");
          case "auth/wrong-password":
            throw new Error("Password incorrect");
          default: // ถ้่าไม่เข้าเคส Invalid-Email จะแสดงด้านล่าง
            throw new Error("Something wrong in Login!!!");
        }
      }
    },
    async logout() {
      this.isLoggedIn = false;
      this.isAdmin = false;
      await signOut(auth);
    },
  },
});
