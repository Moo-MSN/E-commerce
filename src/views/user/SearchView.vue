<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";

import UserLayout from "@/layouts/UserLayout.vue";
import Product from "@/components/Product.vue";

import { useProductStore } from "@/stores/user/product";

const productStore = useProductStore();
const route = useRoute();
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
</script>

<template>
  <UserLayout>
    <div class="text-2xl m-4">
      Search: <b>{{ searchText }}</b>
    </div>
    <Product :products="filterProducts"></Product>
  </UserLayout>
</template>
