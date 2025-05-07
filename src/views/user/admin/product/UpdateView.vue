<script setup>
import { reactive, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import { useAdminProductStore } from "@/stores/admin/product";

const productIndex = ref(-1); // ประกาศตำแหน่ง productIndex
const mode = ref("ADD"); // add mode เข้ามาเพื่อเวลาเปลี่ยนไปหน้า update จะได้เปลี่ยนจาก ADD to EDIT เมื่อมี route.params.id

onMounted(() => {
  if (route.params.id) {
    // ถ้ามี route.params.id จะทำการเปลี่ยน mode จาก ADD เป็น EDIT
    productIndex.value = parseInt(route.params.id);
    mode.value = "EDIT";

    const selectProduct = adminProductStore.getProduct(productIndex.value);
    //เนื่องจาก reactive ไม่สามารถแทนทั้งตัวลงไปได้ เราเลยต้องทำแต่ละ field ออกมา
    productData.name = selectProduct.name;
    productData.image = selectProduct.image;
    productData.price = selectProduct.price;
    productData.quantity = selectProduct.quantity;
    productData.about = selectProduct.about;
    productData.status = selectProduct.status;
  }
});

const adminProductStore = useAdminProductStore();
const router = useRouter(); // เพิ่มเข้ามาเพื่อใช้ในการไปหน้าอื่น
const route = useRoute();

const productData = reactive({
  //ใช้เก็บตัวค่า input
  name: "",
  image: "",
  price: 0,
  quantity: 0,
  about: "",
  status: "",
});

const formData = [
  // ประกาศใช้ในการ loop ออกมาเป็น Form
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

const updateproduct = () => {
  if (mode.value === "EDIT") { // ถ้า mode.value เป็น EDIT ให้ทำการ update
    adminProductStore.updateproduct(productIndex.value, productData);
  } else {// แต่ถ้าไม่ใช่ EDIT ให้เพิ่ม product ใหม่
    adminProductStore.addProduct(productData);
  }
  router.push({ name: "admin-products-list" }); // เมื่อ click addProduct จะเด้งไปหน้า products-list
};
</script>

<template>
  <AdminLayout>
    <div class="shadow-xl p-8 mt-4">
      <div class="text-3xl font-semibold">{{ mode }}</div>
      <div class="divider"></div>
      <div class="grid grid-cols-2 gap-4">
        <fieldset v-for="form in formData" class="fieldset">
          <legend class="fieldset-legend">{{ form.name }}</legend>
          <input v-model="productData[form.field]" type="text" class="input" />
          <!--v-model เพื่อเก็บค่าในแต่ละ field ที่เราใส่ค่า-->
        </fieldset>
      </div>

      <div class="divider"></div>
      <div class="grid grid-cols-2 gap-4">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Status</legend>
          <select v-model="productData.status" class="select">
            <!--v-model เพื่อเก็บค่าของ status-->
            <option disabled selected>Pick a Status</option>
            <option value="open">Open</option>
            <option value="close">Close</option>
          </select>
        </fieldset>
      </div>
      <div class="flex justify-end mt-4">
        <RouterLink :to="{ name: 'admin-dashboard' }" class="btn btn-ghost">BACK</RouterLink>
        <!--เมื่อ click จะกลับยังหน้า dashboard-->
        <button class="btn btn-neutral" @click="updateproduct()">{{ mode }}</button>
        <!--เมื่อ click จะส่งค่าที่อยู่ใน reactive ไปใส่ใน productData-->
      </div>
    </div>
  </AdminLayout>
</template>
