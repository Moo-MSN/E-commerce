<script setup>
import { defineProps  } from 'vue';

defineProps ({
    products:Array,
    addToCart:Function
})
</script>

<template>
    <section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-4">
      <!-- เพิ่ม Grid เป็น 4 columns-->
      <div v-for="product in products " class="card bg-base-100 w-full shadow-sm">
        <!-- w-full ควรตีเต็มไว้จะได้จัดหน้าง่าย -->
        <figure>
          <img class="w-full" :src="product.imageUrl" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">{{ product.name }}</h2>
          <p>{{ product.about }}</p>
          <p>Price: {{ product.price }} B</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary" @click="addToCart(product)">Buy Now</button>
          </div>
        </div>
      </div>
    </section>
</template>