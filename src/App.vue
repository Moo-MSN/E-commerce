<script setup>
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useCartStore } from "./stores/user/cart";

const cartStore = useCartStore (); // add เข้ามาเพื่อทำการดึงข้อมูลจาก localstorage ภายในเครื่อง

onMounted (()=>{
  cartStore.loadCart() // App.vue จะถูก render ออกมาก่อนทุกหน้าถูก set เป็น default
})
</script>

<template>
  <RouterView />
</template>
