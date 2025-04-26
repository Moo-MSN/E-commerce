<script setup>
import { useRouter } from "vue-router";
import UserLayout from "@/layouts/UserLayout.vue";
import Product from "@/components/Product.vue";


import { useProductStore } from "@/stores/user/product";
import { useCartStore } from "@/stores/user/cart";

const productStore = useProductStore();
const cartStore = useCartStore() // 
const router = useRouter()


const addToCart = (product) => {
  cartStore.addToCart(product) // ต้องทำการอัพเดตจำนวนด้วย โดยการไป add ที่ cart.js
  router.push({name:'cart'}) // เมื่อทำการกด Buy now จะไปสู่หน้า ตะกร้าสินค้า
}

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
    <Product :products="productStore.list"
             :addToCart="addToCart"
    ></Product> <!-- ทำการ import Product เพื่อทำหน้า Product shelf และย้าย section ไปไว้หน้า Products.vue -->
    
  </UserLayout>
</template>
