import { defineStore } from "pinia";
// import firestore for use CRUD in product admin page
import { collection, doc, getDoc, getDocs, setDoc, addDoc, deleteDoc, query, where, orderBy, 
  limit,limitToLast, startAfter, endBefore, getCountFromServer } from "firebase/firestore";
import { db } from "@/firebase";

export const useAdminProductStore = defineStore("product-data", {
  state: () => ({
    list: [],
    // สร้าง docList เพื่อเก็บ doc ต้นฉบับไว้ เพื่อทำการ pagination ถ้าไม่เก็บไว้จะไม่สามารถทำได้
    docList: [],
    // เพื่อไม่ให้ total ของเราเป็น 0 ถ้าค่าเป็น 0 จะทำให้ return Math.ceil(state.total/2) แสดงออกมาเป็น NAN
    total : 1,
    // เพิ่ม filter เข้ามาเพื่อทำการจัดเรียงข้อมูลใน admin page in product list
    filter: {
      search: "",
      status: "",
      sort: { 
        updatedAt: "desc",
      },
    },
  }),
  getters: {
    list(state) {
      // ทำการ convert docList ด้วย .map แล้ว retrun เป็น doc.data() ที่ใช้ใน javaScript ได้ แล้วเก็บไว้ที่ list
      return state.docList.map((doc) => {
        const convertedProduct = doc.data();
        // ทำการแนบ id ของ product ไปกับ convertedProduct ไปด้วยเพื่อใช้ในการระบุ id product
        convertedProduct.productId = doc.id;
        // ทำการแปลง time stamp ให้เป็น ว/ด/ป ที่ใช้ใน javaScript เพื่อให้เราอ่านง่าย
        convertedProduct.updatedAt = convertedProduct.updatedAt.toDate();
        return convertedProduct;
      });
    },
    // ทำการสร้าง page จำนวน page โดยการ หาร 2 แล้วทำการปัดขึ้นด้วย Math.ceil 
    totalPage (state) {
      return Math.ceil(state.total/2)
    }
  },

  actions: {
    async loadProduct() {
      // จิ้มไปที่ collection(db,"products") ทำการเรียงโดยใช้ orderBy จาก field ที่ชื่อ updatedAt
      let productCol = query(collection(db, "products"), orderBy("updatedAt", this.filter.sort.updatedAt));
      if (this.filter.search) {
        console.log("search", this.filter.search);
        // ใช้ในการค้นหาในช่องการค้นหา
        productCol = query(productCol, where("name", "==", this.filter.search));
      }
      if (this.filter.status) {
        console.log("status", this.filter.status);
        // ใช้ในการ filter status ของสินค้าที่ open and close
        productCol = query(productCol, where("status", "==", this.filter.status));
      }
      // สร้าง rawProductCol เพื่อดึงข้อมูลจาก server ออกมาตามที่เรา limit ไว้ เมื่อเราใช้ getCountFromServer
      const rawProductCol = productCol
      // ทำการ limit ให้ product แสดงออกมาแค่ 2 ชิ้น
      productCol = query(productCol, limit(2)); 

      // รับข้อมูลมาเก็บไว้ที่ productSnapshot
      const productSnapshot = await getDocs(productCol);
      // ทำการเก็บแสดงข้อมูลออกมา
      this.docList = productSnapshot.docs;

      // เป็นการ count ข้อมูลจาก server จะดีกว่าการ query data ที่ read ข้อมูลออกมาทั้งหมด เพราะ getCount จะ read ข้อมูลออกมาครั้งเดียว แล้วนับจำนวนไปตาม index
      const allSnapshot = await getCountFromServer (rawProductCol)
      this.total = allSnapshot.data().count
    },
    // สร้าง loadNextProduct (mode) เพื่อว่าถ้า mode เป็น next เราจะทำอะไร แล้วถ้าไม่ใช่เราจะทำอะไร
    async loadNextProduct(mode) {
      // สร้าง base quenry โดยการไป Copy จาก loadProduct()
      let productCol = query(collection(db, "products"), orderBy("updatedAt", this.filter.sort.updatedAt));
      if (mode === "next") {
        // เป็นการเลือกไปยัง Array ของ docList ตัวสุดท้าย
        const lastDocument = this.docList[this.docList.length - 1];
        // ไปหน้าต่อไป startAfter() ใน () คือเราใส่ Cursor ของตำแหน่ง Array เข้าไป 
        productCol = query(productCol, startAfter(lastDocument), limit(2));
      } else {
        // หน้าที่แล้ว
        const firstDocument = this.docList[0]
        productCol = query(productCol,endBefore(firstDocument),limitToLast(2))
      }
      const productSnapshot = await getDocs(productCol);
      this.docList = productSnapshot.docs;
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
