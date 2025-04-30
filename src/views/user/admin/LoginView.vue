<script setup>
import { RouterLink } from 'vue-router';


</script>


<template>
  <div class="h-screen flex items-center "> <!-- h-screen คือการตีเต็มหน้าจอ แล้วจัดให้อยู่ตรงกลางด้วย flex items-center-->
    <div class="flex-1 max-w-2xl shadow-xl mx-auto p-8">
      <div class="flex flex-col items-center">
        <h1 class="text-3xl">Login</h1>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Email</span>
          </label>
          <input type="text" placeholder="Your email here" class="input input-bordered w-full" />
        </div>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Password</span>
          </label>
          <input type="password" placeholder="Your password" class="input input-bordered w-full" />
        </div>
        <RouterLink :to="{ name:'admin-dashboard' }" class="btn btn-neutral w-full mt-4">Login</RouterLink>
      </div>
    </div>
  </div>
</template>
