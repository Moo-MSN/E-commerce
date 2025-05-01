<script setup>
import { ref, onMounted } from "vue";
import { RouterLink, useRoute } from "vue-router";

const menus = [
  // สร้าง menus เพื่อนำไป loop ใน menu bar ให้แสดงแต่ละหน้า
  {
    name: "Dashboard",
    routeName: "admin-dashboard",
  },
  {
    name: "Product",
    routeName: "admin-products-list",
  },
  {
    name: "Order",
    routeName: "admin-orders-list",
  },
  {
    name: "User",
    routeName: "admin-users-list",
  },
  {
    name: "Logout",
    routeName: "admin-login",
  },
];
const route = useRoute(); // useRoute สามารถบอกเราได้ว่า เราอยู่หน้าไหน ดึงข้อมูล param quarry
const activeMenu = ref(""); //ใช้ในการเก็บว่าเราอยู่ที่ menu ไหนแล้วไปแสดงที่ menu-active

onMounted(() => { //ใช้ในการ render 
  activeMenu.value = route.name;
});
</script>

<template>
  <div>
    <div class="drawer drawer-open">
      <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content mx-4">
        <slot></slot>
      </div>

      <div class="drawer-side ">
        <label for="my-drawer-2" class="drawer-overlay"></label>
        <ul class="menu p-4 w-60 min-h-full bg-base-200 text-base-content">
          <!-- Sidebar content here -->
          <li class="text-3xl font-bold">
            <a>Admin</a>
          </li>
          <li v-for="menu in menus">
            <!--:class="menu.routeName === activeMenu ? 'menu-active' : ''" เป็น if else แบบบรรทัดเดียว-->
            <RouterLink :to="{ name: menu.routeName }" :class="menu.routeName === activeMenu ? 'menu-active' : ''">{{ menu.name }}</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
