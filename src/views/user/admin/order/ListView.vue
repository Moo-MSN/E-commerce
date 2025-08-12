<script setup>
import AdminLayout from "@/layouts/AdminLayout.vue";
import Table from "@/components/Table.vue";
import { useAdminOrderStore } from "@/stores/admin/order";
import { RouterLink } from "vue-router";
 
import { onMounted } from "vue"; // Import onMounted to fetch data when the component is mounted

const adminOrderStore = useAdminOrderStore();

// Fetch orders when the component is mounted
onMounted (async ()=>{
  await adminOrderStore.loadOrder(); 
})
</script>

<template>
  <AdminLayout>
    <div class="flex items-center justify-between my-6">
      <div class="text-3xl font-semibold">Order</div>
      <div class="divider"></div>
    </div>
    <Table :headers="['Customer name', 'Price', 'Status', 'UpdateAt', '']">
      <tr v-for="(order, index) in adminOrderStore.list">
        <!--ใช้ v-for ในการดึงข้อมูลในหน้า "@/stores/admin/user" ออกมาแสดง-->
        <td>{{ order.name }}</td>
        <td>{{ order.totalPrice }}</td>
        <td>{{ order.status }}</td>
        <td>{{ order.createdAt }}</td>

        <td>
          <div class="flex gap-2">
            <RouterLink :to="{ name: 'admin-orders-detail', params: { id: order.orderId } }" class="btn">SEE DETAIL</RouterLink>
            <!--ถ้า status เป็น active ปุ่มจะเป็น Disable ถ้าไม่จะเป็น Eanble (if-else 1 บรรทัด)-->
          </div>
        </td>
      </tr>
    </Table>
  </AdminLayout>
</template>
