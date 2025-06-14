<script setup>
import { reactive, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import { useAdminProductStore } from "@/stores/admin/product";

import { storage } from "@/firebase";
import { ref as storageRef, uploadBytes,getDownloadURL } from "firebase/storage";

const productIndex = ref(-1); // ประกาศตำแหน่ง productIndex
const mode = ref("ADD"); // add mode เข้ามาเพื่อเวลาเปลี่ยนไปหน้า update จะได้เปลี่ยนจาก ADD to EDIT เมื่อมี route.params.id

onMounted(async () => {
  if (route.params.id) {
    // ถ้ามี route.params.id จะทำการเปลี่ยน mode จาก ADD เป็น EDIT
    productIndex.value = route.params.id;
    mode.value = "EDIT";

    const selectProduct = await adminProductStore.getProduct(productIndex.value);
    //เนื่องจาก reactive ไม่สามารถแทนทั้งตัวลงไปได้ เราเลยต้องทำแต่ละ field ออกมา
    productData.name = selectProduct.name;
    productData.imageUrl = selectProduct.imageUrl;
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
  imageUrl: "",
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
    field: "imageUrl",
    type: "upload-image",
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

const updateproduct = async () => {
  try {
    if (mode.value === "EDIT") {
      // ถ้า mode.value เป็น EDIT ให้ทำการ update
      await adminProductStore.updateProduct(productIndex.value, productData);
    } else {
      // แต่ถ้าไม่ใช่ EDIT ให้เพิ่ม product ใหม่
      await adminProductStore.addProduct(productData);
    }
    router.push({ name: "admin-products-list" }); // เมื่อ click addProduct จะเด้งไปหน้า products-list
  } catch (error) {
    console.log("error", error);
  }
};
// ทำการ Copy handleFileUpload จาก ProfileViwe เพื่อนำมาใช้ในการ upload image
const handleFileUpload = async (event) => {
  // สร้าง function handleFileUpload
  const file = event.target.files[0]; //target เป็นการระบุไปยังตัวเองที่ file ตำแหน่งที่ 0

  // สร้าง mainPath ขึนมาเพื่อป้องกันไม่ให้ตรงกับ case สร้าง product 
  let mainPath = "";
  if (productIndex.value !== -1){
    mainPath = productIndex.value + "-"
  }

  if (file) {
    // สร้าง Folder ที่จะทำการเก็บรูปของ user โดย folder ชื่อ products และรูปภาพนั้นเป็นของ uid ไหน
    const uploadRef = storageRef(storage, `products/${mainPath}${file.name}`);
    // ทำการ upload ตำแหน่งแรกคือ ตำแหน่งที่ต้องการ upload อีกตำแหน่งคือ ค่า ที่จะใส่เข้าไปในตำแหน่งแรก
    const snapshot = await uploadBytes(uploadRef, file);
    // เอาผลลัพธ์จากการ upload มาใช้งาน
    const downloadUrl = await getDownloadURL(snapshot.ref);
    // แล้วแทนผลลัพธ์กลับไปแสดงใน imagUrl
    productData.imageUrl = downloadUrl;
  }
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
          <!--v-model เพื่อเก็บค่าในแต่ละ field ที่เราใส่ค่า-->
          <!-- สร้าง v-if เพื่อแยก type ของ image ออกมา -->
          <input v-if="form.type !== 'upload-image'" v-model="productData[form.field]" type="text" class="input" />
          <!-- สร้าง v-else เพื่อมาแสดง image ของ type: "upload-image" -->
          <div v-else>
            <div class="avatar">
              <div class="w-30 rounded-full">
                <img :src="productData[form.field]" />
              </div>
            </div>
            <input type="file" @change="handleFileUpload">
          </div>
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
        <!--เมื่อ click จะกลับยังหน้า dashboard-->
        <RouterLink :to="{ name: 'admin-products-list' }" class="btn btn-ghost">BACK</RouterLink>
        <!-- add click function -->
        <button class="btn btn-neutral" @click="updateproduct()">{{ mode }}</button>
        <!--เมื่อ click จะส่งค่าที่อยู่ใน reactive ไปใส่ใน productData-->
      </div>
    </div>
  </AdminLayout>
</template>
