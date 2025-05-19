<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAccountStore } from "@/stores/account"; // เพื่อใช้ signInAdmin
import { useEventStore } from "@/stores/event"; // เพื่อใช้ Event ของ Toast

const email = ref("");
const password = ref("");
const router = useRouter();
const accountStore = useAccountStore();
const evenStore = useEventStore();

const Login = async () => {
  console.log(email.value);
  console.log(password.value);
  try {
    // ใส่ค่า email,password ของ user Admin ที่เราสร้างไว้ใน firebase
    await accountStore.signInAdmin(email.value, password.value);
    router.push({ name: "admin-dashboard" });
  } catch (error) {
    console.log("error page = ",error.message);
    evenStore.popupMessage("error",error.message)
  }
};
</script>

<template>
  <div class="h-screen flex items-center">
    <!-- h-screen คือการตีเต็มหน้าจอ แล้วจัดให้อยู่ตรงกลางด้วย flex items-center-->
    <div class="flex-1 max-w-2xl shadow-xl mx-auto p-8">
      <div class="flex flex-col items-center">
        <h1 class="text-3xl">Login</h1>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Email</span>
          </label>
          <input v-model="email" type="text" placeholder="Your email here" class="input input-bordered w-full" />
        </div>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Password</span>
          </label>
          <input v-model="password" type="password" placeholder="Your password" class="input input-bordered w-full" />
        </div>
        <button @click="Login()" class="btn btn-neutral w-full mt-4">Login</button>
      </div>
    </div>
  </div>
</template>
