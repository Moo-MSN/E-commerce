<script setup>
import AdminLayout from "@/layouts/AdminLayout.vue";
import { RouterLink } from "vue-router";
import { useAdminUserStore } from "@/stores/admin/user";

import Table from "@/components/Table.vue";
import edit from "@/components/icon/edit.vue";
import trash from "@/components/icon/trash.vue";


const adminUserStoer = useAdminUserStore()

const changeStatus = (index) => {
  // สร้าง selectedUser เพื่อมารับค่า
  let selectedUser = adminUserStoer.list[index] // เป็นการเลือกเอาข้อมูลเดิมออกมาก่อน
  selectedUser.status = selectedUser.status === 'active'?'inactive':'active'// ถ้า status เป็น active ให้เปลี่ยนเป็น inactive แต่ถ้าไม่ใช่ให้เปลี่ยนเป็น active
  adminUserStoer.updateUser(selectedUser) // แล้วค่อยทำการส่งข้อมูลเดิมกับ selectedUser.status กลับไป
}
</script>

<template>
  <AdminLayout> 
    <div class="flex items-center justify-between my-6">
      <div class="text-3xl font-semibold">User</div>
    </div>
    <Table :headers="['Name', 'Role', 'Status', 'Updated At', '']"> <!--ชื่อ Header บนหัวตาราง-->
     <tr v-for="(user,index) in adminUserStoer.list"> <!--ใช้ v-for ในการดึงข้อมูลในหน้า "@/stores/admin/user" ออกมาแสดง-->
      <td>{{ user.adminName }}</td>
      <td>{{ user.role }}</td>
      <td>{{ user.status }}</td>
      <td>{{ user.updatedAt }}</td>
      <td>
        <div class="flex gap-2">
          <RouterLink :to="{name:'admin-users-update', params:{id:index}}" class="btn">Edit</RouterLink>
          <button class="btn" @click="changeStatus(index)">{{ user.status === 'active' ? 'Disable' : 'Enable'}}</button>
          <!--ถ้า status เป็น active ปุ่มจะเป็น Disable ถ้าไม่จะเป็น Eanble (if-else 1 บรรทัด)-->
        </div>
      </td>
     </tr>

      
    </Table>
    </AdminLayout>
</template>