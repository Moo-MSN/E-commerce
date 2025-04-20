import { defineStore } from "pinia";

export const useProductStore = defineStore("product", {
  state: () => ({
    list: [
      {
        name: "test",
        imageURL: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        quantity: 10,
        about: "testt",
        atatus: "open",
        price: 100,
      },
      {
        // เพิ่มจำนวน product
        name: "moo test",
        imageURL: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        quantity: 10,
        about: "testt",
        atatus: "open",
        price: 120,
      },
    ],
  }),
  actions: { // เพิ่ม action searchText เพื่อใช้ในการค้นหา product
    filterProducts (searchText) {
      return this.list.filter(Product => Product.name.includes(searchText)) 
    }
  }
});
