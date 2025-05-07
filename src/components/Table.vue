<script setup>
import { defineProps } from "vue";

defineProps({
  headers: Array,
});
</script>

<template>
  <!--สร้างขึ้นมาเพื่อใช้ในหน้าต่่างๆ ที่มีลักษณะที่ใช้ Table เหมือนๆกัน -->
  <div class="overflow-x-auto">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th v-for="header in headers">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <slot></slot>
      </tbody>
    </table>
  </div>
</template>
