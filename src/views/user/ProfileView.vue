<script setup>
import { ref, reactive, onMounted } from "vue";
import UserLayout from "@/layouts/UserLayout.vue";

const userForm = [ // เพิ่มตัวแปลเพื่อทำการเอาไปใส่ใน reactive
  {
    name: "Email",
    field: "email",
  },
  {
    name: "Name",
    field: "name",
  },
];

const userData = reactive({ // สร้าง reactive เพื่อมารับตัวแปล
  imageUrl: "https://yt3.ggpht.com/yti/ANjgQV9MjMEuBPoRXYoFnBnIhoYrL0zDlRzEhaXgl1rWerr3p-Y=s108-c-k-c0x00ffffff-no-rj",
  email: "",
  name: "",
});

onMounted(() => { 
  const savedUserProfile = localStorage.getItem("user-profile"); // ทำการรับ data จาก user-profile
  if (savedUserProfile) {
    const userProfile = JSON.parse(savedUserProfile);
    userData.imageUrl = userProfile.imageUrl;
    userData.email = userProfile.email;
    userData.name = userProfile.name;
  }
});

const updateProfile = () => { //
  localStorage.setItem("user-profile", JSON.stringify(userData)); //ทำการเก็บข้อมูลใน user-profile
  alert("Update profile success"); // แจ้งเตือนเมื่อทำการ update เรียบร้อย
};

const handleFileUpload = (event) => {
  // สร้าง function handleFileUpload
  const file = event.target.files[0]; //target เป็นการระบุไปยังตัวเองที่ file ตำแหน่งที่ 0

  if (file) {
    // ถ้าเกิดมี file
    const reader = new FileReader();
    reader.onload = (e) => {
      // แล้วทำการ onload เสร็จ
      userData.imageUrl = e.target.result; // จะนำค่าที่อ่านได้ไปใส่ใน profileImageUrl
    };
    reader.readAsDataURL(file); // ทำการอ่าน file ที่เป็นภาพออกมาเป็น text
  }
};
</script>

<template>
  <UserLayout>
    <div class="max-w-2xl mx-auto border border-base-200 shadow-xl p-8 my-4">
      <div class="font-bold text-2xl">Your Profile</div>

      <div class="flex flex-col items-center">
        <div class="flex flex-col items-center">
          <div class="avatar">
            <div class="w-24 rounded-full">
              <img :src="userData.imageUrl" />
            </div>
          </div>
          <input type="file" @change="handleFileUpload" />
          <!--สร้างการ upload รูปโปรไฟล์-->
        </div>

        <div v-for="item in userForm" class="form-control w-full">
          <!--เพิ่ม v-for เพื่อ loop ข้อมูลใน userForm ออกมา-->
          <label class="label">
            <span class="label-text">{{ item.name }}</span>
            <!--จะแสดงข้อมูลที่เราใส่ค่าใน name: ออกมา-->
            <span class="label-text-alt"></span>
          </label>
          <input v-model="userData[item.field]" type="text" class="input w-full" placeholder="Type here" />
          <!--เพิ่ม V-model เพื่อเอา value ไปใส่ใน field-->
        </div>
      </div>
      <button @click="updateProfile" class="btn btn-neutral mt-4 w-full">UPDATE PROFILE</button>
      <!--เพิ่ม @click เพื่อส่งข้อมูลไป updateProfile-->
    </div>
  </UserLayout>
</template>
