import { defineStore } from "pinia";

export const useAdminProductStore = defineStore("product", {
  state: () => ({
    list: [],
  }), 
  actions: {
    loadProduct() {
      //สำหรับดึงข้อมูล product ทั้งหมด จาก localstorage และ save ใส่ state list
      const productList = localStorage.getItem("product-data");
      if (productList) {
        this.list = JSON.parse(productList);
      }
    },
    getProduct(index) {
      //ดึงข้อมูล product จาก list
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
    updateproduct(index, productdata) {
      //สำหรับ update ข้อมูล product เข้า list และ save ลง localstorage
      this.list[index].name = productdata.name;
      this.list[index].image = productdata.image;
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
      localStorage.setItem("product-data",JSON.stringify(this.list));
    },
  },
});
