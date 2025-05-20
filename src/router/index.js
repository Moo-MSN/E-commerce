import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/user/HomeView.vue";
import CartView from "@/views/user/CartView.vue";
import CheckoutView from "@/views/user/CheckoutView.vue";
import ProfileView from "@/views/user/ProfileView.vue";
import SearchView from "@/views/user/SearchView.vue";
import SuccessView from "@/views/user/SuccessView.vue";

//Admin Site
import AdminLogin from "@/views/user/admin/LoginView.vue";
import AdminDashboard from "@/views/user/admin/DashboardView.vue";
//AdminProduct Site
import AdminProductList from "@/views/user/admin/product/ListView.vue";
import AdminProductUpdate from "@/views/user/admin/product/UpdateView.vue";
//AdminUser Site
import AdminUserList from "@/views/user/admin/user/ListView.vue";
import AdminUserUpdate from "@/views/user/admin/user/UpdateView.vue";
//AdminOrder Site
import AdminOrderList from "@/views/user/admin/order/ListView.vue";
import AdminOrderDetail from "@/views/user/admin/order/DetailView.vue";

import { useAccountStore } from "@/stores/account";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/cart",
      name: "cart",
      component: CartView,
    },
    {
      path: "/checkout",
      name: "checkout",
      component: CheckoutView,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
    },
    {
      path: "/search",
      name: "search",
      component: SearchView,
    },
    {
      path: "/success",
      name: "success",
      component: SuccessView,
    },
    //Admin Site
    {
      path: "/admin/login",
      name: "login",
      component: AdminLogin,
    },
    {
      path: "/admin/dashboard",
      name: "admin-dashboard",
      component: AdminDashboard,
    },
    {
      path: "/admin/products",
      name: "admin-products-list",
      component: AdminProductList,
    },
    {
      path: "/admin/products/create",
      name: "admin-products-create",
      component: AdminProductUpdate,
    },
    {
      path: "/admin/products/update/:id",
      name: "admin-products-update",
      component: AdminProductUpdate,
    },
    {
      path: "/admin/users",
      name: "admin-users-list",
      component: AdminUserList,
    },
    {
      path: "/admin/users/update/:id",
      name: "admin-users-update",
      component: AdminUserUpdate,
    },
    {
      path: "/admin/orders",
      name: "admin-orders-list",
      component: AdminOrderList,
    },
    {
      path: "/admin/orders/detail/:id",
      name: "admin-orders-detail",
      component: AdminOrderDetail,
    },
  ],
});
//ทำการสร้าง router.beforeEach เพื่อทำการรันก่อนเว็ปทำการ render เสร็จจะทำให้ icon ของ profile render เสร็จก่อนและจะมองไม่เห็นจังหวะที่ยังไม่ login
router.beforeEach(async (to, from, next) => {
  const accountStore = useAccountStore();
  await accountStore.checkAuth();
  //ถ้าเราไม่ใช่ admin แล้วพยายามเข้า เราจะโดนดึงมาที่หน้า Home เป็นการทำ Guard ใน Navigation
  if (to.name.includes("admin") && !accountStore.isAdmin) {
    next({ name: "home" });
    // ถ้า login ด้วย admin acoount อยู่ ให้ไปหน้า admin page เมื่อทำการ refresh ได้โดยไม่ต้อง login ใหม่
  } else if (to.name === "login" && accountStore.isAdmin) {
    next({ name: "admin-dashboard" });
  } else {
    // พอกลับมาที่หน้า Home ค่อย render หน้าเว็ป
    next();
  }
});

export default router;
