<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute} from "vue-router";

import AdminLayout from "@/layouts/AdminLayout.vue";

import { useAdminUserStore } from "@/stores/admin/user";
import router from "@/router";
import { useEventStore } from "@/stores/event";

const formData = [
  //เพิ่ม type เพื่อเลือกใช้ type ใน v-if ในการแสดงข้อมูลออกมากตาม type การทำแบบเรียกว่า form confic ทำให้แก้ไข้หรือเพิ่มเติมได้ง่าย
  {
    name: "Name",
    field: "adminName",
    type: "text",
  },
  {
    name: "Role",
    field: "role",
    type: "select",
    dropdownList: ["admin", "moderator", "user"],
  },
  {
    name: "Status",
    field: "status",
    type: "select",
    dropdownList: ["active", "inactive"], // จะแสดงเป็น dropdown
  },
];

const adminUserStore = useAdminUserStore();
const rout = useRoute();
const userIndex = ref(-1);
const eventStore = useEventStore();


const userData = reactive({
  // ใช้เก็บค่า
  adminName: "",
  role: "",
  status: "",
});

onMounted(() => {
  //นำข้อมูลมาใส่ userData โดยการเอาข้อมูลมาจาก user.js โดยต้องอ่านผ่าน params
  if (rout.params.id) {
    // ถ้า rout.params.id มีิิอยู่ ให้
    userIndex.value = parseInt(rout.params.id);
    const selectedUser = adminUserStore.getUser(userIndex.value); // และทำการ getUser(userindex.value) ในแต่ละ Index
    userData.adminName = selectedUser.adminName; // มาใส่ใน reactive แล้วแสดงค่าตาม field ออกมา
    userData.role = selectedUser.role;
    userData.status = selectedUser.status;
  }
});

const updateUser = () => {
  adminUserStore.updateUser(userIndex.value, userData);
  eventStore.popupMessage ("Success","Update user successful" )
  router.push({ name: "admin-users-list" });
};
</script>

<template>
  <AdminLayout>
    <div class="shadow-xl p-8 mt-4">
      <div class="text-3xl font-semibold">Update user</div>
      <div class="divider"></div>

      <div class="grid grid-cols-1 gap-4">
        <fieldset v-for="form in formData" class="fieldset">
          <legend class="fieldset-legend">{{ form.name }}</legend>
          <input v-if="form.type === 'text'" type="text" class="input w-full" v-model="userData[form.field]" />
          <select v-if="form.type === 'select'" type="text" class="input w-full" v-model="userData[form.field]">
            <option v-for="item in form.dropdownList">{{ item }}</option>
          </select>
        </fieldset>
      </div>

      <div class="flex justify-end mt-4">
        <RouterLink :to="{ name: 'admin-dashboard' }" class="btn btn-ghost">BACK</RouterLink>
        <!--เมื่อ click จะกลับยังหน้า dashboard-->
        <button class="btn btn-neutral" @click="updateUser()">Update</button>
        <!--เมื่อ click จะส่งค่าที่อยู่ใน reactive ไปใส่ใน productData-->
      </div>
    </div>
  </AdminLayout>
</template>
