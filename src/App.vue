<script setup>
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useCartStore } from "./stores/user/cart";
import { useProductStore } from "./stores/user/product";
import { useEventStore } from "./stores/event";

const productStore = useProductStore();
const cartStore = useCartStore(); // add เข้ามาเพื่อทำการดึงข้อมูลจาก localstorage ภายในเครื่อง
const eventStore = useEventStore();

onMounted(() => {
  cartStore.loadCart(); // App.vue จะถูก render ออกมาก่อนทุกหน้าถูก set เป็น default
  productStore.loadProduct(); // ทำการดึงข้อมูลจาก localStorage มาแสดงที่หน้าบ้าน

});
</script>

<template>
  <!-- Add Toast เข้ามาเพื่อเป็น alert ตอนแก้ไขหรืออัพเดตข้อมูลในหน้าที่เราต้องการใช้ Toast-->
  <div v-if="eventStore.alert" class="toast"> <!--v-if เพื่อ control  Toast ไม่ให้แสดงตลอกเวลา-->
  <div class="alert alert-info" :class="`alert-${eventStore.data.status}`">
    <span>{{ eventStore.data.message }}</span>
  </div>
</div>  
  <RouterView />
</template>
