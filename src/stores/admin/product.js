import { defineStore } from "pinia";

export const useAdminProductStore = defineStore("product-data", {
  state: () => ({
    list: [],
    loaded: false,
  }),
  actions: {
    loadProduct() {
      //สำหรับดึงข้อมูล product ทั้งหมด จาก localstorage และ save ใส่ state list
      const productList = localStorage.getItem("product-data");
      if (productList) {
        this.list = JSON.parse(productList);
        this.loaded = true; // ถ้ามีการ loaded ไปแล้วจะเป็น ture
      }
    },
    getProduct(index) {
      //ดึงข้อมูล product จาก list
      if (!this.loaded) {
        // ถ้าไม่มีการ loaded
        this.loadProduct(); // ให้ loadProduct ใหม่
      }
      return this.list[index];
    },
    addProduct(productdata) {
      //สำหรับ add ข้อมูล product เข้า list และ save ลง localstorage
      productdata.remainQuantity = productdata.quantity; //remainQuantity กับ Quantity ตอนนี้เราจะให้เท่ากัน
      productdata.updatedAt = new Date().toISOString();
      this.list.push(productdata);
      //save to localstorage
      localStorage.setItem("product-data", JSON.stringify(this.list));
    },
    updateProduct(index, productdata) {
      //สำหรับ update ข้อมูล product เข้า list และ save ลง localstorage
      this.list[index].name = productdata.name;
      this.list[index].imageUrl = productdata.imageUrl;
      this.list[index].price = productdata.price;
      this.list[index].quantity = productdata.quantity;
      this.list[index].remainQuantity = productdata.remainQuantity;
      this.list[index].status = productdata.status;
      this.list[index].updatedAt = new Date().toISOString();
      //save to localstorage
      localStorage.setItem("product-data", JSON.stringify(this.list));
    },
    removeProduct(index) {
      //สำหรับลบข้อมูล product จาก list และ save กลับ localstorage
      this.list.splice(index, 1);
      //save to localstorage
      localStorage.setItem("product-data", JSON.stringify(this.list));
    },
  },
});
