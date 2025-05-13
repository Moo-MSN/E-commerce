<script setup>
import AdminLayout from "@/layouts/AdminLayout.vue";
import { ref, onMounted } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { useAdminOrderStore } from "@/stores/admin/order";

const route = useRoute();
const orderIndex = ref(-1);
const adminOrderStore = useAdminOrderStore();

const orderData = ref({
  product: [], // ไม่ได้ใช้เป็น reactive เนื่องจากต้อวการแค่แสดงผลออกมาก
});

onMounted(() => {
  if (route.params.id) {
    orderIndex.value = parseInt(route.params.id);
    const selectedOrder = adminOrderStore.getOrder(orderIndex.value);
    orderData.value = selectedOrder;
  }
});
</script>

<template>
  <AdminLayout>
    <div class="shadow-xl p-8 mt-4">
      <div class="text-3xl font-semibold">Order detail in ID: {{ orderIndex }}</div>
      <div class="divider"></div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <div class="font-bold">Order date</div>
          <div>{{ orderData.updatedAt }}</div>
        </div>

        <div>
          <div class="font-bold">Order Number</div>
          <div>{{ orderData.no }}</div>
        </div>

        <div>
          <div class="font-bold">Payment method</div>
          <div>{{ orderData.paymentMethod }}</div>
        </div>

        <div>
          <div class="font-bold">Address</div>
          <div>{{ orderData.address }}</div>
        </div>
      </div>
      <div class="divider"></div>
      <div v-for="product in orderData.products" class="grid grid-cols-4 items-center"> <!-- ใช้ v-for เพื่อทำการ loop products ใน order.js-->
        <div class="mx-auto"> <!-- ทำการเลื่อนภาพให้อยู่ตรงกลาง -->
          <img class="p-4 w-30" :src="product.imageUrl" >
        </div>

        <div>
          <div class="font-bold ">{{ product.name }} </div>
          <div>{{ product.description }}</div>
        </div>

        <div>
          จำนวน {{ product.quantity }} ชิ้น
        </div>
        <div>{{ product.price }} B</div>
      </div>
      <div class="divider"></div>
        <div class="flex justify-between font-bold">
          <div>Total Price</div>
          <div>{{ orderData.totalPrice }}</div>
        </div>
        <div class="flex justify-end mt-4">
          <RouterLink :to="{ name:'admin-orders-list' }" class="btn btn-ghost">BACK</RouterLink>
        </div>
    </div>
  </AdminLayout>
</template>
