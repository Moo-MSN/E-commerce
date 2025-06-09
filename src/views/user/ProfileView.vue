<script setup>
import { ref, onMounted } from "vue";
import UserLayout from "@/layouts/UserLayout.vue";

import { useAccountStore } from "@/stores/account";

import { storage } from "@/firebase";
import { ref as storageRef, getDownloadURL, uploadBytes } from "firebase/storage";

const accountStore = useAccountStore();

const profileImageUrl = ref("  ");
const email = ref("");
const adminName = ref("");

onMounted(() => {
  const profileData = accountStore.profile;
  profileImageUrl.value = profileData.imageUrl || "https://yt3.ggpht.com/yti/ANjgQV9MjMEuBPoRXYoFnBnIhoYrL0zDlRzEhaXgl1rWerr3p-Y=s108-c-k-c0x00ffffff-no-rj";
  adminName.value = profileData.adminName;
  email.value = profileData.email;
});

const updateProfile = async () => {
  // สร้างตัวแปลไว้รับข้อมูล
  try {
    const profileData = {
      imageUrl: profileImageUrl.value,
      adminName: adminName.value,
      email: email.value,
    };
    // เอาค่าที่อยู่ใน updateProfile(profileData) ไป update ที่ accountStore
    await accountStore.updateProfile(profileData);
  } catch (error) {
    console.log("error", error);
  }

  //localStorage.setItem("user-profile", JSON.stringify(userData)); //ทำการเก็บข้อมูลใน user-profile
  //alert("Update profile success"); // แจ้งเตือนเมื่อทำการ update เรียบร้อย
};

const handleFileUpload = async (event) => {
  // สร้าง function handleFileUpload
  const file = event.target.files[0]; //target เป็นการระบุไปยังตัวเองที่ file ตำแหน่งที่ 0

  if (file) {
    // สร้าง Folder ที่จะทำการเก็บรูปของ user โดย folder ชื่อ users และรูปภาพนั้นเป็นของ uid ไหน
    const uploadRef = storageRef(storage, `users/${accountStore.user.uid}/${file.name}`);
    // ทำการ upload ตำแหน่งแรกคือ ตำแหน่งที่ต้องการ upload อีกตำแหน่งคือ ค่า ที่จะใส่เข้าไปในตำแหน่งแรก
    const snapshot = await uploadBytes(uploadRef, file);
    // เอาผลลัพธ์จากการ upload มาใช้งาน
    const downloadUrl = await getDownloadURL(snapshot.ref);
    // แล้วแทนผลลัพธ์กลับไปแสดงใน imagUrl
    profileImageUrl.value = downloadUrl;
    // ถ้าเกิดมี file
    //const reader = new FileReader();
    // reader.onload = (e) => {
    // แล้วทำการ onload เสร็จ
    //userData.imageUrl = e.target.result; // จะนำค่าที่อ่านได้ไปใส่ใน profileImageUrl
    //};
    //reader.readAsDataURL(file); // ทำการอ่าน file ที่เป็นภาพออกมาเป็น text
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
              <img :src="profileImageUrl" />
            </div>
          </div>
          <input type="file" @change="handleFileUpload" />
          <!--สร้างการ upload รูปโปรไฟล์-->
        </div>

        <!-- ทำการแก้ไข form โดยการแยก input เป็น 2 อัน จากตอนแรกใช้ v-for และ v-model ในการวนลูปข้อมูลออกมาแสดง -->
        <div class="form-control w-full">
          <!--เพิ่ม v-for เพื่อ loop ข้อมูลใน userForm ออกมา-->
          <label class="label">
            <span class="label-text">Email</span>
          </label>
          <input type="text" class="input w-full" placeholder="Type here" :value="email" disabled />
          <!--เพิ่ม V-model เพื่อเอา value ไปใส่ใน field-->
        </div>

        <div class="form-control w-full">
          <!--เพิ่ม v-for เพื่อ loop ข้อมูลใน userForm ออกมา-->
          <label class="label">
            <span class="label-text">Name</span>
          </label>
          <input v-model="adminName" type="text" class="input w-full" placeholder="Type here" />
          <!--เพิ่ม V-model เพื่อเอา value ไปใส่ใน field-->
        </div>
      </div>
      <button @click="updateProfile" class="btn btn-neutral mt-4 w-full">UPDATE PROFILE</button>
      <!--เพิ่ม @click เพื่อส่งข้อมูลไป updateProfile-->
    </div>
  </UserLayout>
</template>
