import { defineStore } from "pinia";
export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [
      {
        name: "test",
        imageURL: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        quantity: 10,
        about: "testt",
        atatus: "open",
        price: 100,
        quantity: 1,
      },
    ],
  }),
  getters: {
    summaryQuantity (state) { // ใส่ใน UserLayout ในการปรับจำนวนในตะกร้าสินค้า
      return state.items.reduce((acc,item) => acc + item.quantity,0)
    },

    summaryPrice (state) { // ใส่ในหน้า Cart page
      return state.items.reduce((acc, item) => {
        // acc คือค่าที่แล้ว, item คือจำนวน item
        return acc + (item.price * item.quantity); // ทำการ return ค่าใหม่ ที่สะสมใน acc
      }, 0); // 0 คือค่าเริ่มต้นใน summaprice
    },
  },
  actions: {
    addToCart(productDatd) {
      this.items.push(productDatd);
    },
    updateQuantity(index, quantity) {
      this.items[index].quantity = quantity; // การปรับตัวเลขใหม่เมื่อเราเปลี่ยนจำนวนในตระกร้า
    },
    removeItemInCart(index) {
      this.items.splice(index, 1);
    },
  },
});
