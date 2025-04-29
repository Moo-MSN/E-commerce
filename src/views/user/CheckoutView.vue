<script setup>
import { reactive } from "vue";
import UserLayout from "@/layouts/UserLayout.vue";
import { RouterLink, useRouter } from "vue-router";

import { useCartStore } from "@/stores/user/cart";

const FormData = [
  {
    name: "Email address",
    field: "email",
  },
  {
    name: "Name",
    field: "name",
  },
  {
    name: "Address",
    field: "address",
  },
  {
    name: "Note",
    field: "note",
  },
];

const cartStore = useCartStore();
const router = useRouter(); // สร้าง router เพื่อนำทางไปยังหน้า success

const userFormData = reactive({
  // สร้าง reactive เพื่อเก็บค่าของ form
  email: "",
  name: "",
  address: "",
  note: "",
});

const payment = () => {
  cartStore.placeorder(userFormData);
  router.push({ name: "success" });
};
</script>

<template>
  <UserLayout>
    <h1 class="text-3xl font-bold m-4">Checkout</h1>
    <div class="flex">
      <!--เป็นการตีเต็มหน้าก่อน-->
      <section class="flex-auto w-64 bg-base-200 p-8">
        <div v-for="form in FormData" class="form-control w-full">
          <!-- เพิ่ม v-for เพื่อ loop หัวข้อ input แต่ละตัวออกมา-->
          <label class="lable">
            <span class="lable-text">{{ form.name }}</span>
            <!--หัวข้อที่ออกมาจะมาจาก name: -->
          </label>
          <input v-model="userFormData[form.field]" type="text" class="input input-bordered w-full" placeholder="Type here" />
        </div>
        <button @click="payment" class="btn btn-neutral mt-4 w-full">ชำระเงิน</button>
      </section>
      <!--เป็นการแบ่งครึ่ง-->
      <section class="flex-auto w-32 bg-slate-200 px-2">
        <div v-for="item in cartStore.items" class="flex bg-white m-4 py-4">
          <div class="flex-1">
            <img class="w-full p-8" :src="item.imageURL" />
          </div>
          <div class="flex-1">
            <div class="flex flex-col justify-between h-full">
              <div>
                <div>
                  <b>{{ item.name }}</b>
                </div>
                <div>จำนวน: {{ item.quantity }}</div>
              </div>
              <RouterLink :to="{ name: 'cart' }">Edit</RouterLink>
            </div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="p-4">
          <div><b>Order summary</b></div>
          <div class="flex justify-between">
            <div>ราคาสินค้าทั้งหมด</div>
            <div>{{ cartStore.summaryPrice }}</div>
          </div>
          <div class="flex justify-between">
            <div>ค่าส่ง</div>
            <div>0</div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="flex justify-between mb-4 p-4">
          <div>ราคาทั้งสิน</div>
          <div>{{ cartStore.summaryPrice }}</div>
        </div>
      </section>
    </div>
  </UserLayout>
</template>
