/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
//const { initializeApp } = require("firebase-admin/app"); // เพิ่ม initailizeApp เพื่อเรียกใช้ firebase admin
const { db, auth } = require("./firebaseConfig.js"); //เพิ่ม Config มาใช้แทน initializeApp ด้านบน

const express = require("express"); // เพิ่ม express เข้ามาเพื่อใช้ในการทำ api เพราะถ้าใช้ onRequest จะสามารถใช้ได้ทั้ง GET and POST ได้ ซึ่งเราไม่อยากทำแบบนั้น อยากจะแยกเส้นไปเลย
const app = express(); // เพื่อเรียกใช้ app.GET,POST เป็นต้น

const logger = require("firebase-functions/logger");
const { get } = require("firebase/database");

// เพิ่ม Omise เข้ามาเพื่อใช้ในการชำระเงิน
const omise = require("omise")({
  secretKey: process.env.OMISE_SECRET_KEY, // ใช้ secret key ที่เก็บไว้ใน .env.local
  omiseVersion: "2019-05-29", // กำหนดเวอร์ชั่นของ Omise ที่จะใช้
}); // เพิ่ม Omise เข้ามาเพื่อใช้ในการชำระเงิน
// แสดงค่า secret key ที่เก็บไว้ใน .env.local เพื่อเช็คว่าได้ค่ามาหรือไม่ แต่ใน terminal ไม่แสดงค่า เลยใช้ app.get("/testenv"... เพื่อยิง api เพื่อดู secret key ว่าออกมาหรือไม่
//console.log(process.OMIE_SESCRET_KEY);

// สร้างฟังก์ชัน createCharge เพื่อรับ source id แล้วส่ง secret key ไปยัง Omise เพื่อสร้างการชำระเงิน
const createCharge = (source, amount, orderId) => {
  return new Promise((resolve, reject) => {
    omise.charges.create(
      {
        amount: amount * 100,
        currency: "THB",
        return_uri: `http://localhost:5173/success?order_id=${orderId}`,
        metadata: {
          orderId,
        },
        source, // source ตัวนี้มาจากการสร้าง source token ที่ได้จาก Omise ในฝั่ง frontend
      },
      (err, resp) => {
        if (err) {
          return reject(err);
        }
        resolve(resp);
      }
    );
  });
};

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started
app.post("/placeorder", async (req, res) => {
  console.log(req.body); // ตัวนี้จะไปแสดงที่ terminal
  try {
    const checkoutData = req.body.checkout; // รับ body แล้วเลือกข้อมูลใน checkout มาใส่ใน checkoutData
    const sourceOmise = req.body.source; // รับ body แล้วเลือกข้อมูลใน source มาใส่ใน sourceOmise
    let checkoutProducts = [];
    let summaryPrice = 0;
    let orderData = {}; // ประกาศตัวแปร orderData เพื่อใช้ในการเก็บข้อมูลที่ได้จาก checkoutData
    let omiseRespone = {}; // ประกาศตัวแปร omiseRespone เพื่อใช้ในการเก็บข้อมูลที่ได้จาก Omise
    let successOrderId = ""; // ประกาศตัวแปร successOrderId เพื่อใช้ในการเก็บข้อมูล orderId ที่ได้จากการสั่งซื้อ

    const products = checkoutData.products; //  รับข้อมูลจาก checkoutData แล้วเลือก products ที่มีใน [] มาใส่ใน products

    //เพิ่ม runTransition เข้ามาเพื่อใช้ในการ stamp order แต่ข้อมูลที่อยู่ใน transition ต้องถูกต้องทั้งหมดก่อนถึงจะทำการ stamp order ให้ ถ้ามีอะไรผิดพลาดจะไม่มีการทำรายการเกิดขึ้น
    await db.runTransaction(async (t) => {
      for (const product of products) {
        // loop ข้อมูลที่มีใน products
        // สร้าง productRef เพื่อใช้ db ของ firestore แล้วเลือกไปยัง collection ที่ชื่อ products, .doc()คือการใส่ข้อมูลที่เราจะ get ออกมา
        const productRef = db.collection("products").doc(product.productId);
        const productSnapshot = await productRef.get(); // ใช้ productRef.get() เพื่อดึงข้อมูลออกมาจาก .doc(product.productId) ที่อยู่ใน productData
        const productData = productSnapshot.data();
        //console.log("productDarta", productData);

        let checkoutProduct = product; // ทำการประกาศรับค่า checkoutProduct โดนการใช้ใช้ข้อมูลในการ loop products
        checkoutProduct.name = productData.name; // นำชื่อสินค้าที่ได้จาก productData มาใส่ใน checkoutProduct
        checkoutProduct.imageUrl = productData.imageUrl; // นำรูปสินค้าที่ได้จาก product
        checkoutProduct.price = productData.price;
        checkoutProduct.totalPrice = productData.price * product.quantity;
        summaryPrice += productData.price * product.quantity; // เมื่อเราทำการสั่งสินค้ามากกว่า 1 ชนิด ก็สามารถได้ราคารวมทั้งหมดได้
        checkoutProducts.push(checkoutProduct);
        //console.log("checkoutProducts", checkoutProducts);

        if (productData.remainQuantity < 0 || productData.remainQuantity < product.quantity) {
          // เช็คว่าจำนวนสินค้าที่สั่งมามากกว่าที่มีอยู่ใน firestore หรือไม่
          throw new Error(`จำนวนสินค้าที่สั่งมามากกว่าที่มีอยู่ใน Stock ${productData.name} ชิ้น`);
        }

        // ลดจำนวนสินค้า
        t.update(productRef, {
          remainQuantity: productData.remainQuantity - product.quantity, // ลดจำนวนสินค้าใน firestore
        });

        // การสร้าง order ใน firestore
        const orderRef = db.collection("orders"); // สร้าง collection ที่ชื่อ orders
        const orderId = orderRef.doc().id; // สร้าง id ของ order ใหม่


        //
        omiseRespone = await createCharge(sourceOmise, summaryPrice, orderId); // ทำการสร้าง charge โดยใช้ sourceOmise ที่ได้จาก frontend และ summaryPrice ที่ได้จากการคำนวณราคาสินค้า
        console.log("omiseRespone", omiseRespone); // ทำการ log omiseRespone เพื่อดูข้อมูลที่ได้จาก Omise
        //orderData.orderId = orderId; // นำ orderId ที่สร้างขึ้นมาใส่ใน orderData
        //orderData.userId = checkoutData.userId; // ใส่ userId ที่มาจาก checkoutData
        //orderData.status = "successful"; // กำหนดสถานะเริ่มต้นของ

        // การเขียน order ลงใน collection orders
        orderData = {
          ...checkoutData, // ใช้ข้อมูลที่อยู่ใน checkoutData
          chargeId: omiseRespone.id, // สร้าง chargeId โดยใช้ orderId เอาไว้ตอนรวมกับ omise ตอนน้ีทำการรวมกับ omise แล้วได้ chargeId เรียบร้อย  
          products: checkoutProducts, // ใช้ข้อมูลที่อยู่ใน checkoutProducts
          totalPrice: summaryPrice, // ใช้ข้อมูลที่อยู่ใน summaryPrice
          paymentMethod: "rabbit_linepay", // กำหนดวิธีการชำระเงิน
          createdAt: new Date().toLocaleString(), // กำหนดวันที่และเวลาในการสร้าง order
          status: "pending", // กำหนดสถานะเริ่มต้นของ order เมื่อเราใช้ฝั่ง frontend แต่สถานะของการชำระเงินจะมีหลักๆ คือ successful, pending, failed
        };
        // การสร้าง order ใน firestore
        t.set(orderRef.doc(orderId), orderData); // ทำการ set ข้อมูล แล้วใส่ข้อมูลที่อยู่ใน orderData ลงไปใน collection orders


        successOrderId = orderId; // นำ orderId ที่สร้างขึ้นมาใส่ใน successOrderId เพื่อทำการ redirect ไปยังหน้าสั่งซื้อสำเร็จฝั่ง frontend
      }
    });
    res.json({
      message: "Hello from firebase",
      //checkoutProducts, // จะได้ค่าที่อยู่ใน checkoutProduct ด้านบนไปแสดงไป postman
      //summaryPrice, // จะแสดงแค่ค่า totalPrice ใน postman ตอนเรายิง app.post
      //orderData
      redirectUrl: omiseRespone.authorize_uri, // ส่งค่า redirectUrl กลับไปยัง frontend เพื่อให้ redirect ไปยังหน้าสำเร็จ
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดในการสั่งสินค้า",
      error: error.message, // แสดงข้อความที่เกิดขึ้นใน console
    });
  }
});
// เป็นการทดสอบว่า api ทำงาน แล้วได้ Sesret key กลับมาหรือไม่ ซึ่งไม่ควรทำใน production
//app.get("/teseenv", (req, res) => {
//  res.json({
//    key: process.env.OMISE_SECRET_KEY, // ส่งค่า public key กลับไปยัง frontend เพื่อใช้ในการชำระเงิน
//  });
//});
exports.api = onRequest(app);
//exports.helloWorld = onRequest((request, response) => {
//    initializeApp({
// projectId: "easy-commerce-by-moo-msn"
// })
//logger.info("Hello logs!", { structuredData: true });
//  response.send("Hello from Firebase!");
// });
