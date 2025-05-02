<script setup>
import AdminLayout from "@/layouts/AdminLayout.vue";

const formData = [
  {
    name: "Name",
    field: "name",
  },
  {
    name: "Image",
    field: "image",
  },
  {
    name: "Price",
    field: "price",
  },
  {
    name: "Quanitiy",
    field: "quantity",
  },
  {
    name: "About",
    field: "about",
  },
];
</script>

<template>
  <AdminLayout>
    <div class="shadow-xl p-8 mt-4">
      <div class="text-3xl font-semibold">ADD</div>
      <div class="divider"></div>
      <div class="grid grid-cols-2 gap-4">
        <fieldset v-for="form in formData" class="fieldset">
          <legend class="fieldset-legend">{{ form.name }}</legend>
          <input type="text" class="input" placeholder="Type here" />
        </fieldset>
      </div>

      <div class="divider"></div>
      <div class="grid grid-cols-2 gap-4">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Status</legend>
          <select class="select">
            <option disabled selected>Pick a Status</option>
            <option value="open">Open</option>
            <option value="close">Close</option>
          </select>
        </fieldset>
      </div>
      <div class="flex justify-end mt-4">
        <button class="btn btn-ghost">BACK</button>
        <button class="btn btn-neutral">ADD</button>
      </div>
    </div>
  </AdminLayout>
</template>
