import { defineStore } from "pinia";

export const useProductStore = defineStore("product", {
  state: () => ({
    list: [],
  }),
  actions: { // ทำการเพิ่ม loadProduct() เพื่อให้หน้า HomeView สามารถดึงข้อมูลจาก localStorage จากหลังบ้านมาแสดงที่หน้าบ้านได้
    loadProduct() {
      //สำหรับดึงข้อมูล product ทั้งหมด จาก localstorage และ save ใส่ state list
      const productList = localStorage.getItem("product-data");
      if (productList) {
        this.list = JSON.parse(productList);
        this.loaded = true; // ถ้ามีการ loaded ไปแล้วจะเป็น ture
      }
    },

    // เพิ่ม action searchText เพื่อใช้ในการค้นหา product
    filterProducts(searchText) {
      return this.list.filter((Product) => Product.name.includes(searchText));
    },
  },
});
