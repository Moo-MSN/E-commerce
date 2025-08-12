import { defineStore } from "pinia";
// import realtimeDB เพื่อในเรียกหน้าตะกร้า
import { db, realtimeDB } from "@/firebase";

import { doc, getDoc } from "firebase/firestore"; // ใช้ในการดึงข้อมูลจาก firestore ดึงข้อมูลสินค้า

import axios from "axios";

// import "firebase/database" เพื่อใช้ในการสร้างหรือดึงข้อมูลตะกร้าออกมาเวลาที่ user logged in
import { ref, onValue, set } from "firebase/database";

// import useAccountstore เพื่อ ทำการเช็คว่ามีการ login เข้ามาก่อนหรือไม่
import { useAccountStore } from "../account";

// ตั้งค่า public key ของ Omise
Omise.setPublicKey(import.meta.env.VITE_OMISE_PUBLIC_KEY); // ไม่ต้อง import Omise.js เพราะเราได้ทำการ import ใน index.html แล้ว

// เพิ่ม function createSource เพื่อรับการสร้าง source token สำหรับการชำระเงิน
const createSource = (amount) => {
  return new Promise((resolve, reject) => {
    // ทำการส่ง source ที่ต้องการจ่ายไป omise เพื่อนำ source token กลับมา
    Omise.createSource('rabbit_linepay', {
      amount: (amount * 100),
      currency: 'THB'
    }, (statusCode, response) => {
      if (statusCode !== 200) {
        return reject(response)
      }
      resolve(response)
    })
  })
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
    checkout: {}, //สร้าง {} เพื่อเก็บตัวแปลจาก getItem
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
    // ประกาศตรง getter เพื่อเป็นการดึงข้อมูลของ user ออกมาก่อน
    user(state) {
      const accountStore = useAccountStore();
      return accountStore.user;
    },
    // สร้าง ref ที่เราจะไปยังตะกร้าสินค้า
    // ทำการสร้างที่ getter เพื่อที่เราจะเรียกใช้ cartRef ในการ ดึง,สร้าง,อัพเดต,ลบ
    cartRef(state) {
      return ref(realtimeDB, `carts/${this.user.uid}`);
    },
  },
  actions: {
    async loadCart() {
      // ทำการดัก login ว่าถ้ามี this.user.uid มี uid แสดงว่า logged in
      console.log("user cart", this.user);
      if (this.user.uid) {
        onValue(
          this.cartRef,
          (snapshot) => {
            const data = snapshot.val();
            // ถ้ามี data คือมี item ค่อยแสดงออกไป
            if (data) {
              this.items = data;
            }
            //console.log("data", data);
          },
          (err) => {
            console.log("error", err);
          }
        );
        // แต่ถ้าไม่ได้ login ให้ดึงข้อมูลตะกร้ามาจาก localstorage
      } else {
        // ถ้าเราทำการ เพิ่ม ของในตะกร้าหรือแก้ไ้หน้่่าตะกร้า จะทำการอัพเดตใหม่ใน localstorage
        const previousCart = localStorage.getItem("cart-data");
        if (previousCart) {
          this.items = JSON.parse(previousCart);
        }
      }
    },
    async addToCart(productDatd) {
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
      // ทำการ set ข้อมูลไปยัง database
      await set(this.cartRef, this.items);
      localStorage.setItem("cart-data", JSON.stringify(this.items)); // เป็นการ save item เป็น string ไว้ใน localstorage
    },
    async updateQuantity(index, quantity) {
      this.items[index].quantity = quantity; // การปรับตัวเลขใหม่เมื่อเราเปลี่ยนจำนวนในตระกร้า
      // ทำการ set ข้อมูลไปยัง database
      await set(this.cartRef, this.items);
      localStorage.setItem("cart-data", JSON.stringify(this.items)); // เป็นการ save item เป็น string ไว้ใน localstorage
    },
    async removeItemInCart(index) {
      this.items.splice(index, 1);
      // ทำการ set ข้อมูลไปยัง database
      await set(this.cartRef, this.items);
      localStorage.setItem("cart-data", JSON.stringify(this.items)); // เป็นการ save item เป็น string ไว้ใน localstorage
    },
    async placeorder(userData) {
      try {
        const checkoutData = {
          ...userData, // เป็นการต่อข้อมูลใน object โดยการเพิ่มข้อมูลด้านล่าง

          products: this.items.map((product) => ({
            productId: product.productId, // ใช้ id แทน name เพื่อให้เป็นการอ้างอิงที่ไม่ซ้ำกัน
            quantity: product.quantity,
            // **Mock data ตอนทำที่ localstorage**
            //totalPrice: this.summaryPrice,
            //paymentMethod: "Credit Card",
            //createdData: new Date().toLocaleString(),
            //orderNumber: `AA${Math.floor(Math.random() * 90000 + 10000)}`,
          })),
        };
        //console.log("orderData", checkoutData);
        
        // ทำการสร้าง source token โดยใช้ summaryPrice ที่ได้จาก getter summaryPrice
        const omiseRespone = await createSource(this.summaryPrice); 
        // ทำการ log omiseRespone เพื่อดูข้อมูลที่ได้จาก Omise
        console.log("omiseRespone", omiseRespone);

        //throw new Error("Mock payment success"); // ใช้เพื่อจำลองการชำระเงินสำเร็จ

        // ทำการยิง axios ไปยัง API เพื่อบันทึกข้อมูลการสั่งซื้อ
        const response = await axios.post("/api/placeorder", {
          source: omiseRespone.id, // จะเปลี่ยนจาก test_src เป็น omise source token ที่แท้จริงในการเชื่อมต่อกับ omise
          checkout: checkoutData, // ประกอบ checkout จาก checkoutData ที่เราสร้างขึ้นด้านบน
        });
        console.log("response", response.data);
        return response.data; // ส่งข้อมูลกลับไปยัง component ที่เรียกใช้ action นี้ คือ payment ที่อยู่ ใน CheckoutView.vue

        // สร้าง batch เพื่อเรียกใช้ writeBatch
        //const batch = writeBatch(db);
        // ทำการ loop product ทุกตัวภายใน Array ของ orderData.product
        //for (const product of orderData.products) {
        // สร้าง productRef เพื่อเลือกไป (db, "products", product.productId)
        //const productRef = doc(db, "products", product.productId);
        // แล้วทำการ updateDoc ไปที่ productRef แล้วเลือก field ที่ต้องการอัพเดตคือ remainQuantity โดยใช้ increment(-1) เพื่อทำการลดจำนวนที่ละ 1
        // เปลี่ยนจาก updateDoc เป็น batch.update เพราะ
        //batch.update(productRef, {
        //remainQuantity: increment(-1),
        //});
        //} 
        //await batch.commit();
        //localStorage.setItem("order-data", JSON.stringify(orderData)); // เป็น set ข้อมูลลงไปใน localstorage
      } catch (error) {
        console.log("error", error);
      }
    },

    async loadCheckout(orderId) {
      try {
      // ทำการดึงข้อมูล orderId จาก db,"ordeers"
      const orderRef = doc(db,"orders",orderId); // ดึงข้อมูลจาก firestore โดยใช้ orderId
      const orderSnapshot = await getDoc(orderRef); // ทำการดึงข้อมูลจาก firestore
      let orderData = orderSnapshot.data(); // ดึงข้อมูลออกมาเป็น object
      orderData.createdAt, //= orderData.createdAt.toDate()// แปลง createdAt จาก timestamp เป็น string
      orderData.orderNumber = orderSnapshot.id; // ดึง id ของ order ออกมาเป็น orderNumber
      return orderData; // ส่งข้อมูลกลับไปยัง component ที่เรียกใช้ action นี้ คือ CheckoutView.vue
      } catch (error) {
        throw new Error(error.message); // ถ้ามี error ให้ throw error ออกไป
        // console.log("error", error);
      }
      // เป็นการสร้างขึ้นมาเพิ่อรับ order-data จาก localstorage ถ้ามีข้อมูลให้แสดง order แต่ถ้าไม่มีให้ไปยังหน้าอื่น
      //const orderData = localStorage.getItem("order-data");
      //if (orderData) {
        //this.checkout = JSON.parse(orderData);
      //}
    },
  },
});
