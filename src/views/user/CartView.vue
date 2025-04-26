<script setup>
import { useCartStore } from "@/stores/user/cart";
import { RouterLink } from "vue-router";

import UserLayout from "@/layouts/UserLayout.vue";
import close from "@/components/icon/close.vue";





const cartStore = useCartStore()

const changeQuantity = (event,index) => {
  const newQuantity = parseInt(event.target.value) // สร้าง newQuantity เพื่อรับตัวแปลใหม่แล้วแปลงเป็นตัวเลขโดยใช้ parseInt
  cartStore.updateQuantity(index, newQuantity)
}

</script>

<template>
  <UserLayout>
    <h1 class="text-3xl font-bold m-4">Shopping Cart</h1>

    <div class="flex">
      <div class="flex-auto w-64 bg-base-200 p-4">
        <div v-if="cartStore.items.length===0"> <!-- เพิ่มเข้ามาเมื่อกดไม่เอาของแล้ว หน้าตะกร้าจะแสดงขึ้นมา -->
          Cart is empty
        </div>

        <div class="flex" v-else v-for=" (item, index) in cartStore.items"> <!-- v-else เพื่อควบคุมการแสดง Cart is empty-->
          <div class="flex-1">
            <img class="w-full p-10" :src="item.imageURL" /> <!--Edit src to :src = "item.imageURL"-->
          </div>
          <div class="flex-1">
            <div class="flex flex-col justify-between h-full">
              <div>
                <div class="relative grid grid-cols-2">
                  <div>
                    <div><b>{{ item.name }}</b></div>
                    <div>{{ item.about }}</div>
                    <div>{{item.price}}</div>
                  </div>
                  <div>
                    <select v-model="item.quantity" class="select w-1/2" @change="changeQuantity($event, index)">
                      <option v-for="quantity in [1, 2, 3, 4, 5]">{{ quantity }}</option>
                    </select>
                  </div>
                  <div @click="cartStore.removeItemInCart(index)" class="absolute top-0 right-0">
                    <close></close>
                  </div>
                </div>
              </div>
              <div><b>In Stock</b></div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-auto w-32 bg-slate-200 p-4">
        <div class="text-xl font-bold">Order Summary</div>
        <div class=" my-4 divide-y">

          <div class="flex justify-between py-2">
            <div>ราคาสินค้าทั้งหมด</div>
            <div>{{ cartStore.summaryPrice }}</div>
          </div>
        
          <div class="flex justify-between py-2">
            <div>ค่าส่ง</div>
            <div>0</div>
          </div>
        
          <div class="flex justify-between py-2">
            <div>ราคารวมทั้งหมด</div>
            <div>{{cartStore.summaryPrice}}</div>
          </div>
        <RouterLink :to="{name:'checkout'}" class="btn btn-neutral w-full mt-4">ชำระเงิน</RouterLink>

        </div>
      </div>
    </div>
  </UserLayout>
</template>
