<script setup>
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useCartStore } from "./stores/user/cart";
import { useProductStore } from "./stores/user/product";

const productStore = useProductStore();
const cartStore = useCartStore(); // add เข้ามาเพื่อทำการดึงข้อมูลจาก localstorage ภายในเครื่อง

onMounted(() => {
  cartStore.loadCart(); // App.vue จะถูก render ออกมาก่อนทุกหน้าถูก set เป็น default
  productStore.loadProduct(); // ทำการดึงข้อมูลจาก localStorage มาแสดงที่หน้าบ้าน
});
</script>

<template>
  <RouterView />
</template>
