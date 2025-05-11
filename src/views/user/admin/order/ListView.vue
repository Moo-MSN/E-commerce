<script setup>
import AdminLayout from "@/layouts/AdminLayout.vue";
import Table from "@/components/Table.vue";
import { useAdminOrderStore } from "@/stores/admin/order";
import { RouterLink } from "vue-router";

const adminOrderStore = useAdminOrderStore();
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
        <td>{{ order.customerName }}</td>
        <td>{{ order.totalPrice }}</td>
        <td>{{ order.status }}</td>
        <td>{{ order.updatedAt }}</td>

        <td>
          <div class="flex gap-2">
            <RouterLink :to="{ name: 'admin-orders-detail', params: { id: index } }" class="btn">SEE DETAIL</RouterLink>
            <!--ถ้า status เป็น active ปุ่มจะเป็น Disable ถ้าไม่จะเป็น Eanble (if-else 1 บรรทัด)-->
          </div>
        </td>
      </tr>
    </Table>
  </AdminLayout>
</template>
