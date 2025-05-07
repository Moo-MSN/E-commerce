<script setup>
import {onMounted } from "vue";
import AdminLayout from "@/layouts/AdminLayout.vue";
import { useAdminProductStore } from "@/stores/admin/product";
import { RouterLink } from "vue-router";

import trash from "@/components/icon/trash.vue"; // import icon
import edit from "@/components/icon/edit.vue"; // import icon

const adminProductStore = useAdminProductStore();

onMounted(() => {
  adminProductStore.loadProduct();
});

const removeProduct = (index) => {
  adminProductStore.removeProduct(index);
};
</script>

<template>
  <AdminLayout>
    <div class="flex items-center justify-between my-6">
      <div class="text-3xl font-semibold">Product</div>
      <div>
        <RouterLink :to="{ name: 'admin-products-create' }" class="btn btn-neutral">Add New</RouterLink>
      </div>
    </div>
    <div>
      <div class="overflow-x-auto">
        <table class="table">
          <!-- head -->
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Update At</th>
              <th></th>
              <!--สร้างไว้รอใส่ Action-->
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            <tr v-for="(product, index) in adminProductStore.list">
              <th>{{ product.name }}</th>
              <td>
                <img :src="product.image" class="w-12" />
              </td>
              <td>{{ product.price }}</td>
              <td>{{ product.quantity }}</td>
              <td>
                <div class="badge gap-2" 
                
                :class="product.status === 'open' ?'badge-success': 'badge-error' "> 
                <!--if else 1 บรรทัด คือ ถ้า open ให้เป็น badge-success ถ้าไม่ใช่ให้เป็น badge-error-->
                  {{ product.status }}
                </div> 
              </td> 
              <td>{{ product.updatedAt }}</td>
              <td>
                <div class="flex gap-2">
                  <RouterLink :to="{name:'admin-products-update',params:{id:index}}" class="btn btn-ghost">
                    <edit></edit>
                  </RouterLink>
                  <div class="btn btn-ghost" @click="removeProduct(index)"> <!--เมื่อ click จะทำการลบข้อมูลที่ตำแหน่ง index  -->
                    <trash></trash>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>
