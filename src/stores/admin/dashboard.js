import { defineStore } from "pinia"; // Import Pinia for state management

import { realtimeDB } from "@/firebase"; // Import Firebase database configuration
import { ref,get } from "firebase/database";

export const useAdminDashboardStore = defineStore("admin-dashboard", {
  state: () => ({
    stats :{
        order: 0,
        product:0,
        user: 0,
    }
  }),
  actions: { // Actions to manage the dashboard state
    async loadDashboard() {
     const statRef = ref(realtimeDB,"stats"); // Reference to the stats node in the realtime database
     const statSnapshot = await get(statRef); // get the data from the stats reference
     this.stats = statSnapshot.val(); // เป็นการ convertข้อมูลที่ได้จาก snapshot เป็น object และเก็บไว้ใน stats
    }
}
  
});             