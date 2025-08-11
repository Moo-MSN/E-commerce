<script setup>
import { ref, onMounted } from "vue";

import { useRoute } from "vue-router"; // ใช้เพื่อเข้าถึง route ปัจจุบัน

import UserLayout from "@/layouts/UserLayout.vue";

import { useCartStore } from "@/stores/user/cart";

const route = useRoute(); // เข้าถึง route ปัจจุบัน

const cartStore = useCartStore();
const orderData = ref({}); // ใช้ ref รับ {}

onMounted(async () => {
  // เรียกใช้ loadCheckout เพื่อโหลดข้อมูลการสั่งซื้อ
  const orderId = route.query.order_id; // ดึง orderId จาก query params
  if (orderId)
    try {
      orderData.value = await cartStore.loadCheckout(orderId); // เรียกใช้ loadCheckout จาก cartStore
    } catch (error) {
      console.error("Error loading checkout:", error);
    }
  //if (cartStore.checkout.orderNumber) {
  //  orderData.value = cartStore.checkout;
  //}
});
</script>

<template>
  <UserLayout>
    <div class="max-w-2xl mx-auto border border-base-200 shadow-xl p-8 my-4">
      <div>
        <div class="text-xl font-bold">Your order is successful!</div>
        <div>Hi : {{ orderData.name }}</div>
        <div>เตรียมรอรับสินค้าได้เลย</div>
      </div>
      <div class="divider"></div>
      <div class="grid grid-cols-4 gap-2">
        <div>
          <div class="font-bold">Order date</div>
          <div>{{ orderData.createdAt }}</div>
        </div>
        <div>
          <div class="font-bold">Order number</div>
          <div>{{ orderData.orderNumber }}</div>
        </div>
        <div>
          <div class="font-bold">Payment method</div>
          <div>{{ orderData.paymentMethod}}</div>
        </div>
        <div>
          <div class="font-bold">Address</div>
          <div>{{ orderData.address }}</div>
        </div>
      </div>
      <div class="divider"></div>
      <div v-for="product in orderData.products" class="grid grid-cols-4 gap-2 mb-4 items-center">
        <div>
          <img class="w-full" :src="product.imageUrl" />
        </div>
        <div><b>ชื่อสินค้า</b> : {{ product.name }}</div>
        <div>จำนวน : {{ product.quantity }}</div>
        <div>ราคารวม : {{ product.price * product.quantity }}</div>
      </div>
      <div class="divider"></div>
      <div class="flex justify-between">
        <div>ราคาสินค้าทั้งหมด</div>
        <div>{{ orderData.totalPrice }}</div>
      </div>
      <div class="flex justify-between">
        <div>ค่าส่ง</div>
        <div>0</div>
      </div>

      <div class="divider"></div>
      <div class="flex justify-between">
        <div>ราคาทั้งสิน</div>
        <div>{{ orderData.totalPrice }}</div>
      </div>
      <div class="divider"></div>
      <div>ขอบคุณที่มาซื้อของเรา</div>
    </div>
  </UserLayout>
</template>
