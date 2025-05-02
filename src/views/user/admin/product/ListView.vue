<script setup>
import AdminLayout from "@/layouts/AdminLayout.vue";
import { useAdminProductStore } from "@/stores/admin/product";
import { RouterLink } from "vue-router";

import trash from "@/components/icon/trash.vue"; // import icon
import edit from "@/components/icon/edit.vue"; // import icon

const adminProduct = useAdminProductStore();
</script>

<template>
  <AdminLayout>
    <div class="flex items-center justify-between my-6">
      <div class="text-3xl font-semibold">Product</div>
      <div>
        <RouterLink :to="{name:'admin-products-create'}" class="btn btn-neutral">Add New</RouterLink>
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
            <tr v-for="product in adminProduct.list ">
              <th>{{ product.name }}</th>
              <td>
                <img :src="product.image" class="w-12" />
              </td>
              <td>{{ product.price }}</td>
              <td>{{ product.quantity }}</td>
              <td>
                <div class="badge badge-success gap-2">
                  {{ product.status }}
                </div>
              </td>
              <td>{{ product.updatedAt }}</td>
              <td>
                <div class="flex gap-2">
                  <div class="btn btn-ghost">
                    <edit></edit>
                  </div>
                  <div class="btn btn-ghost">
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
