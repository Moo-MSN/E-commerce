import { defineStore } from "pinia";
export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
    checkout:{} //สร้าง {} เพื่อเก็บตัวแปลจาก getItem 
  }),
  getters: {
    summaryQuantity(state) {
      // ใส่ใน UserLayout ในการปรับจำนวนในตะกร้าสินค้า
      return state.items.reduce((acc, item) => acc + item.quantity, 0);
    },

    summaryPrice(state) {
      // ใส่ในหน้า Cart page
      return state.items.reduce((acc, item) => {
        // acc คือค่าที่แล้ว, item คือจำนวน item
        return acc + item.price * item.quantity; // ทำการ return ค่าใหม่ ที่สะสมใน acc
      }, 0); // 0 คือค่าเริ่มต้นใน summaprice
    },
  },
  actions: {
    loadCart() {
      // ถ้าเราทำการ เพิ่ม ของในตะกร้าหรือแก้ไ้หน้่่าตะกร้า จะทำการอัพเดตใหม่ใน localstorage
      const previousCart = localStorage.getItem("cart-data");
      if (previousCart) {
        this.items = JSON.parse(previousCart);
      }
    },
    addToCart(productDatd) {
      const findProductIndex = this.items.findIndex((item) => {
        // หา index ว่ามี product เดิมอยู่ในตะกร้าหรือไม่
        return item.name === productDatd.name;
      });
      if (findProductIndex < 0) {
        // ถ้าไม่มี
        productDatd.quantity = 1; // ใส่ จำนวนเป็น 1
        this.items.push(productDatd);
      } else {
        const cerrentItem = this.items[findProductIndex]; // แต่ถ้ามีเอา findeProductIndex ออกมาแล้วบวก quantity เดิมแล้วไป update ตะกร้าสินค้า
        this.updateQuantity(findProductIndex, cerrentItem.quantity + 1);
      }

      localStorage.setItem("cart-data", JSON.stringify(this.items)); // เป็นการ save item เป็น string ไว้ใน localstorage
    },
    updateQuantity(index, quantity) {
      this.items[index].quantity = quantity; // การปรับตัวเลขใหม่เมื่อเราเปลี่ยนจำนวนในตระกร้า
      localStorage.setItem("cart-data", JSON.stringify(this.items)); // เป็นการ save item เป็น string ไว้ใน localstorage
    },
    removeItemInCart(index) {
      this.items.splice(index, 1);
      localStorage.setItem("cart-data", JSON.stringify(this.items)); // เป็นการ save item เป็น string ไว้ใน localstorage
    },
    checkout(userData) {
      const orderData = {
        ...userData, // เป็นการต่อข้อมูลใน object โดยการเพิ่มข้อมูลด้านล่าง
        totalPrice: this.summaryPrice,
        paymentMethod: "Credit Card",
        createdData: new Date().toLocaleTimeString(),
        orderNumber: `AA${Math.floor(Math.random() * 90000 + 10000)}`,
      };
      localStorage.setItem("order-data", JSON.stringify(orderData)); // เป็น set ข้อมูลลงไปใน localstorage
    },
    loadCheckout (){ // เป็นการสร้างขึ้นมาเพิ่อรับ order-data จาก localstorage ถ้ามีข้อให้แสดง order แต่ถ้าไม่มีให้ไปยังหน้าอื่น
      const orderData = localStorage.getItem("order-data")
      if (orderData) {
        this.checkout = JSON.parse(orderData)
      }
    }
  },
});
