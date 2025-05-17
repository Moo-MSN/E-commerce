import { defineStore } from "pinia";

//import มาจาก UserLayoutเพื่อนำมาแยกให้ใช้ร่วมกันกับหน้าอื่นได้
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

const provider = new GoogleAuthProvider();

export const useAccountStore = defineStore("account", {
  state: () => ({
    isLoggedIn: false, // สร้างมาเช็คว่า login แล้วหรือยัง
    user: {}, // เอาไว้เก็บ user information เอาไว้
  }),
  actions: {
    async checkAuth() { // เพิ่มการ onAuthStateChanged เพื่อให้ login ค้างไว้ได้
      onAuthStateChanged(auth, (user) => {
        console.log("user", user);
        if (user) {
          // User is signed in, see docs for a list of available properties
          this.user = user;
          this.isLoggedIn = true;
          const uid = user.uid;
          // ...
        }
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
    async logout() {
      this.isLoggedIn = false;
      await signOut(auth);
    },
  },
});
