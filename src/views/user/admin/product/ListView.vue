<script setup>
import { onMounted } from "vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import { useAdminProductStore } from "@/stores/admin/product";
import { RouterLink } from "vue-router";

import Table from "@/components/Table.vue";
import trash from "@/components/icon/trash.vue"; // import icon
import edit from "@/components/icon/edit.vue"; // import icon

const adminProductStore = useAdminProductStore();

onMounted(async () => {
  await adminProductStore.loadProduct();
});

const searchProduct = async () => {
  // เมื่อกด search จะนำค่าที่ใส่ในช่องค้นหา ไปใส่ค่าใน adminProductStoer แล้วทำการ loadproduct อีกรอบ พร้อมค่าที่ค้นที่ตรงกัน
  await adminProductStore.loadProduct();
};

const removeProduct = async (index) => {
  await adminProductStore.removeProduct(index);
  await adminProductStore.loadProduct(index);
};

const changeStatusFilter = async (newStatus) => {
  // เมื่อกดที่ status จะนำค่าที่เรากดไป ไปใส่ค่าใน adminProductStoer แล้วทำการ loadproduct อีกรอบ พร้อมค่าที่ค้นที่ตรงกัน
  adminProductStore.filter.status = newStatus;
  await adminProductStore.loadProduct();
};

const changeSortUpdatedAt = async (newSort) => {
  // เมื่อกดที่ ASC or DESC จะนำค่าที่เรากดไป ไปใส่ค่าใน adminProductStoer แล้วทำการ loadproduct อีกรอบ พร้อมค่าที่ค้นที่ตรงกัน
  adminProductStore.filter.sort.updatedAt = newSort;
  await adminProductStore.loadProduct();
};
</script>

<template>
  <AdminLayout>
    <div class="flex items-center justify-between my-6">
      <div class="text-3xl font-semibold">Product</div>
      <label class="input">
        <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input v-model="adminProductStore.filter.search" type="search" class="grow" placeholder="Search" />
        <button class="btn kbd-sm" @click="searchProduct()">Search</button>
      </label>
      <div>
        <RouterLink :to="{ name: 'admin-products-create' }" class="btn btn-neutral">Add New</RouterLink>
      </div>
    </div>

    <div class="flex justify-end text-sm mx-auto">
      <div>
        UpdatedAt Sort :
        <div class="join mx-8">
          <!-- :class เป็นการใส่ if else 1 บรรทัด ในการให้ปุ่มแสดงว่าเรากดปุ่มที่ status ไหนอยู่-->
          <button class="btn btn-xs join-item" @click="changeSortUpdatedAt('asc')" :class="adminProductStore.filter.sort.updatedAt === 'asc' ? 'btn-active' : ''">ASE</button>
          <button class="btn btn-xs join-item" @click="changeSortUpdatedAt('desc')" :class="adminProductStore.filter.sort.updatedAt === 'desc' ? 'btn-active' : ''">DESC</button>
        </div>
      </div>
      <div>
        Status Sort :
        <div class="join mx-8">
          <!-- :class เป็นการใส่ if else 1 บรรทัด ในการให้ปุ่มแสดงว่าเรากดปุ่มที่ status ไหนอยู่-->
          <button class="btn btn-xs join-item" @click="changeStatusFilter('open')" :class="adminProductStore.filter.status === 'open' ? 'btn-active' : ''">Open</button>
          <button class="btn btn-xs join-item" @click="changeStatusFilter('close')" :class="adminProductStore.filter.status === 'close' ? 'btn - active:' : ''">Close</button>
        </div>
      </div>
    </div>

    <Table :headers="['Name', 'Image', 'Price', 'Quantity', 'Status', 'UpdateAt', '']">
      <!-- row 1 -->
      <tr v-for="(product, index) in adminProductStore.list">
        <th>{{ product.name }}</th>
        <td>
          <img :src="product.imageUrl" class="w-12" />
        </td>
        <td>{{ product.price }}</td>
        <td>{{ product.remainQuantity }} / {{ product.quantity }}</td>
        <td>
          <div class="badge gap-2" :class="product.status === 'open' ? 'badge-success' : 'badge-error'">
            <!--if else 1 บรรทัด คือ ถ้า open ให้เป็น badge-success ถ้าไม่ใช่ให้เป็น badge-error-->
            {{ product.status }}
          </div>
        </td>
        <td>{{ product.updatedAt }}</td>
        <td>
          <div class="flex gap-2">
            <RouterLink :to="{ name: 'admin-products-update', params: { id: product.productId } }" class="btn btn-ghost">
              <edit></edit>
            </RouterLink>
            <div class="btn btn-ghost" @click="removeProduct(product.productId)">
              <!--เมื่อ click จะทำการลบข้อมูลที่ตำแหน่ง index  -->
              <trash></trash>
            </div>
          </div>
        </td>
      </tr>
    </Table>
  </AdminLayout>
</template>
