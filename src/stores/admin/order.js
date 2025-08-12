import { defineStore } from "pinia";

// import firebase and firestore for order database
import { db } from "@/firebase";
import { collection, doc, getDocs, getDoc } from "firebase/firestore";

export const useAdminOrderStore = defineStore("admin-oder", {
  state: () => ({
    list: [],
  }),
  actions: {
    async loadOrder() {
      const orderRef = collection(db, "orders"); // จิ้มไปที่ db,"orders"
      const orderSnapshot = await getDocs(orderRef); // ทำการดึงข้อมูลทั้งหมดใน orders
      this.list = orderSnapshot.docs.map(doc => { // ใช้ map เพื่อแปลงข้อมูลที่ได้
        let convertedOrder = doc.data(); // แปลงข้อมูลที่ได้จาก firestore
        convertedOrder.orderId = doc.id; // ดึง id ของ order
        convertedOrder.createdAt; // แปลง timestamp เป็น date
        return convertedOrder; // คืนค่าข้อมูลที่แปลงแล้ว
      });
    },

    async getOrder(orderId) {
      const orderRef = doc(db, "orders", orderId); // จิ้มไปยัง doc(db, "orders", orderId)
      const orderSnapshot = await getDoc(orderRef); // ทำการดึงข้อมูล order ตาม orderId
      let orderData = orderSnapshot.data(); // ดึงข้อมูลที่ได้
      orderData.orderId = orderSnapshot.id; // ดึง id ของ order
      orderData.createdAt // แปลง timestamp เป็น date
      return orderData; // คืนค่าข้อมูลที่ได้
    },
  },
});
