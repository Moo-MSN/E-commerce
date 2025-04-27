<script setup>
import { ref, onMounted } from "vue";
import UserLayout from "@/layouts/UserLayout.vue";

import { useCartStore } from "@/stores/user/cart";

const cartStore = useCartStore();
const orderData = ref({}); // ใช้ ref รับ {}

onMounted(() => {
  cartStore.loadCheckout();
  if (cartStore.checkout.orderNumber) {
    orderData.value = cartStore.checkout;
  }
});
</script>

<template>
  <UserLayout>
    <div class="max-w-2xl mx-auto border border-base-200 shadow-xl p-8">
      <div>
        <div class="text-xl font-bold">Your order is succressful!</div>
        <div>Hi {{ orderData.name }}</div>
        <div>เตรียมรอรับสินค้าได้เลย</div>
      </div>
      <div class="divider"></div>
      <div class="grid grid-cols-4 gap-2">
        <div>
          <div class="font-bold">Order date</div>
          <div>{{ orderData.createdData }}</div>
        </div>
        <div>
          <div class="font-bold">Order number</div>
          <div>{{ orderData.orderNumber }}</div>
        </div>
        <div>
          <div class="font-bold">Payment method</div>
          <div>{{ orderData.paymentMethod }}</div>
        </div>
        <div>
          <div class="font-bold">Address</div>
          <div>{{ orderData.address }}</div>
        </div>
      </div>
      <div class="divider"></div>
      <div v-for="products in orderData.products" class="grid grid-cols-4 gap-2">
        <div>
          {{ products.imageURL }}
        </div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </div>
      <div class="divider"></div>
      <div class="divider"></div>
      <div class="divider"></div>
      <div>ขอบคุณที่มาซื้อของเรา</div>
    </div>
  </UserLayout>
</template>
