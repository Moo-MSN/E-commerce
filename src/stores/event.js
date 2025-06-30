// สร้าง event ที่ใช้ pinia เพื่อควบคุมการทำงานของ Toast และเรียกใช้งาน
import { defineStore } from "pinia";

// import "firebase/database" เพื่อใช้ในการสร้างหรือดึงข้อมูลของ banner มาใข้งาน
import { ref,onValue } from "firebase/database";

// เพื่อใช้ realtimeDB ในการดึง banner ที่เราสร้างไว้
import { realtimeDB } from "@/firebase";


export const useEventStore = defineStore("event", {
  state: () => ({
    alert: false, // สร้างมาเพื่อให้เวลาโหลดมาหน้าแรก toast ไม่แสดงค้างออกมา
    data: {},
    banner:{},
  }),
  actions: {
    //  status คือเป็น status อะไร เช่น success, fail เป็นต้น message คืออยากให้ popup ข้อความอะไรออกมา
    popupMessage(status, message) {
      this.data = {
        status,
        message,
      };
      this.alert = true; //ถ้ามีค่าทั้ง 2 จะแสดงออกมา
      setTimeout(() => {
        this.clearMessage();
      }, 2500);
    },
    clearMessage() {
      this.alert = false, // Toast จะไม่แสดงออกมา
    this.data = {};
    },
    //
     loadBanner(){
      //
      const bannerRef = ref(realtimeDB,"banner")
      onValue(bannerRef, (snapshot)=>{
        this.banner = snapshot.val()
      })
    }
  },
});
