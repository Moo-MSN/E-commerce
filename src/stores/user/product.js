import { defineStore } from "pinia";

//import คำสั่งใช้งาน firebase
import { collection, getDocs, query,where } from "firebase/firestore";
import { db } from "@/firebase";

export const useProductStore = defineStore("product", {
  state: () => ({
    list: [],
  }),
  actions: {
    // ทำการแก้จาก loadProduct() เป็น async loadProduct() เพื่อให้หน้า HomeView สามารถดึงข้อมูลจาก firebase Emulator จากหลังบ้านมาแสดงที่หน้าบ้านได้
    async loadProduct() {
      //ทำการห่อด้วย collection ด้วย query แล้วอนุญาตให้แค่ product ที่ open เท่านั้นแสดง 
      const productCol = query(collection(db, "products"),where("status","==","open"))
      //สำหรับดึงข้อมูล products ทั้งหมด จาก root firebase Emulator ที่ชื่อ products
      const productSnapshot = await getDocs(productCol);
      // ทำการ map ข้อมูลแต่ละตัวแล้ว return แต่ละตัวออกมา
      const products = productSnapshot.docs.map((doc) => {
        // ทำการ convert ข้อมูลเพื่อใช้ productId ในการไปตัดจำนวนของ remainQuantity
        const convertedData = doc.data()
        convertedData.productId = doc.id
        return convertedData
      });
      // ถ้า products.length > 0 ให้ products แทนค่าเป็น list ออกมา
      if (products.length > 0) {
        this.list = products;
        this.loaded = true; // ถ้ามีการ loaded ไปแล้วจะเป็น ture
      }
    },

    // เพิ่ม action searchText เพื่อใช้ในการค้นหา product
    filterProducts(searchText) {
      return this.list.filter((Product) => Product.name.includes(searchText));
    },
  },
});
