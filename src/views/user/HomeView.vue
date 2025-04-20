<script setup>
import UserLayout from "@/layouts/UserLayout.vue";
import { useProductStore } from "@/stores/user/product";
import Product from "@/components/Product.vue";

const productStore = useProductStore();
</script>

<template>
  <UserLayout>
    <!-- Add Hero -->
    <div class="hero bg-base-200 min-h-96">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">Hello welcome</h1>
          <p class="py-6">Trust tour intuition</p>
        </div>
      </div>
    </div>

    <!--Add Product Shelf-->
    <Product :products="productStore.list"></Product> 
    <!-- ทำการ import Product เพื่อทำหน้า Product shelf และย้าย section ไปไว้หน้า Products.vue -->
    
  </UserLayout>
</template>
