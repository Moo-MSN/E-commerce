<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute,useRouter } from "vue-router";

import UserLayout from "@/layouts/UserLayout.vue";
import Product from "@/components/Product.vue";

import { useProductStore } from "@/stores/user/product";
import { useCartStore } from "@/stores/user/cart";

// เป็น Config
const route = useRoute();
const router = useRouter();


const productStore = useProductStore();
const cartStore = useCartStore();


const searchText = ref(""); 


watch( // เพิ่มการดักจับคำค้นหาเมื่อเราเปลี่ยนคำค้นหาใหม่  
  () => route.query.q,
  (newSearchText) => {
    searchText.value = newSearchText;
  },
  { immediate: true }
);

const filterProducts = computed(() => {
  return productStore.filterProducts(searchText.value);
});


const addToCart = (product) => {
  cartStore.addToCart(product) // ต้องทำการอัพเดตจำนวนด้วย โดยการไป add ที่ cart.js
  router.push({name:'cart'}) // เมื่อทำการกด Buy now จะไปสู่หน้า ตะกร้าสินค้า
}

</script>

<template>
  <UserLayout>
    <div class="text-2xl m-4">
      Search: <b>{{ searchText }}</b>
    </div>
    <Product :products="filterProducts"
            :addToCart = "addToCart"
    ></Product>
  </UserLayout>
</template>
