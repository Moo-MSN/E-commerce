import { defineStore } from "pinia";

export const useAdminUserStore = defineStore("admin-user", {
  state: () => ({
    list: [
      {
        adminName: "Moo",
        role: "admin",
        status: "active",
        updatedAt: new Date().toISOString(),
      },
    ],
  }),
  actions: {
    getUser(index) {
      return this.list[index];
    },
    updateUser(index, userData) {
      const fields = ["adminName", "role", "status"];
      for (let field of fields) {
        // เป็นการ loop field ใน [] ออกมา
        this.list[index][field] = userData[field];
      }
      this.list[index].updatedAt = new Date().toISOString();
    }, // ตัวด้านบนสามารถเขียนอีกแบบได้เหมือนก้านล่าง
    // ด้านล่างคือการใช้แบบยาว เก็บ index และค่าของ userData
    //this.list[index].adminName = userData.adminName
    //this.list[index].role = userData.role
    //this.list[index].status = userData.status
    //this.list[index].updatedAt = userData.updatedAt
    removeUser(index) {
      this.list.splice(index, 1);
    },
  },
});
