<script setup>
import UserLayout from "@/layouts/UserLayout.vue";
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
    <section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-4"> <!-- เพิ่ม Grid เป็น 4 columns-->
      <div v-for="Items in [1,2,3,4,5,6,7,8]" class="card bg-base-100 w-full shadow-sm"> <!-- w-full ควรตีเต็มไว้จะได้จัดหน้าง่าย -->
        <figure>
          <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">Card Title</h2>
          <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
    </section>

  </UserLayout>
</template>
