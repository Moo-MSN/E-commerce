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
