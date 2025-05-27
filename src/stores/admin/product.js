import { defineStore } from "pinia";
// import firestore for use CRUD in product admin page
import { collection, doc, getDoc, getDocs, setDoc, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";

export const useAdminProductStore = defineStore("product-data", {
  state: () => ({
    list: [],
    loaded: false,
  }),
  actions: {
    async loadProduct() {
      // จิ้มไปที่ collection(db,"products")
      const productCol = collection(db, "products");
      // รับข้อมูลมาเก็บไว้ที่ productSnapshot
      const productSnapshot = await getDocs(productCol);
      // ทำการ convert productSnapshot.docs ด้วย .map แล้ว retrun เป็น doc.data() ที่ใช้ใน javaScript ได้ แล้วเก็บไว้ที่ products
      const products = productSnapshot.docs.map(doc => {
        const convertedProduct = doc.data();
        // ทำการแนบ id ของ product ไปกับ convertedProduct ไปด้วยเพื่อใช้ในการระบุ id product
        convertedProduct.productId = doc.id;
        // ทำการแปลง time stamp ให้เป็น ว/ด/ป ที่ใช้ใน javaScript เพื่อให้เราอ่านง่าย
        convertedProduct.updatedAt = convertedProduct.updatedAt.toDate();
        return convertedProduct;
      });

      //สำหรับดึงข้อมูล product ทั้งหมด จาก localstorage และ save ใส่ state list
      //const productList = localStorage.getItem("product-data");

      this.list = products;
    },
    async getProduct(productId) {
      try {
        // จิ้มไปที่ doc(db, "products", productId)
        const productRef = doc(db, "products", productId);
        // รับ product ที่อยู่ใน products
        const productSnapshot = await getDoc(productRef);
        // ทำการ return แสดงข้อมูล
        return productSnapshot.data();
      } catch (error) {
        console.log("error", error);
      }
    },
    async addProduct(productdata) {
      try {
        //สำหรับ add ข้อมูล product เข้า list
        productdata.remainQuantity = productdata.quantity;
        //remainQuantity กับ Quantity ตอนนี้เราจะให้เท่ากัน
        productdata.updatedAt = new Date();
        // จิ้มไปที่ collection(db,"products")
        const productCol = collection(db, "products");
        // ทำการ Add product โดยใช้ addDoc(productRef, productdata)
        await addDoc(productCol, productdata);
      } catch (error) {
        console.log("error", error);
      }
    },
    async updateProduct(productId, productdata) {
      try {
        const updateProduct = {};
        updateProduct.name = productdata.name;
        updateProduct.imageUrl = productdata.imageUrl;
        updateProduct.price = productdata.price;
        updateProduct.quantity = productdata.quantity;
        updateProduct.remainQuantity = productdata.quantity; 
        updateProduct.status = productdata.status;
        updateProduct.updatedAt = new Date();
        // จิ้มไปที่ doc(db,"products",productId)
        const productRef = doc(db, "products", productId);
        // ทำการ updateProduct โดยใช้ addDoc(productRef, productdata)
        await setDoc(productRef, updateProduct);
      } catch (error) {
        console.log("error", error);
      }
    },
    async removeProduct(productId) {
      try {
        const productRef = doc(db, "products", productId);
        await deleteDoc(productRef);
      } catch (error) {
        console.log("error", error);
      }
    },
  },
});
