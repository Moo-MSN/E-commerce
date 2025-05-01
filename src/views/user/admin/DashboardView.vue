<script setup>
import AdminLayout from "@/layouts/AdminLayout.vue";

const barOption = {
  options: {
    chart: {
      id: "vuechart-example",
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
    },
  },
  series: [
    {
      name: "series-1",
      data: [30, 40, 45, 50, 49, 60, 70, 91],
    },
  ],
};

const donutOption = {
  options: {},
  series: [44, 55, 41, 17, 15],
};
</script>

<template>
  <AdminLayout>
    <h1 class="text-4xl  mb-4">Dashboard</h1>
    <div class="flex mb-4">
    <div class="stats shadow w-full mb-4">
      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 320 512">
            <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. -->
            <path
              d="M144 0c-17.7 0-32 14.3-32 32l0 32L37.6 64C16.8 64 0 80.8 0 101.6L0 224l0 41.7L0 288 0 406.3c0 23 18.7 41.7 41.7 41.7l70.3 0 0 32c0 17.7 14.3 32 32 32s32-14.3 32-32l0-32 32 0c61.9 0 112-50.1 112-112c0-40.1-21.1-75.3-52.7-95.1C280.3 222.6 288 200.2 288 176c0-61.9-50.1-112-112-112l0-32c0-17.7-14.3-32-32-32zM112 128l0 96-48 0 0-96 48 0zm64 96l0-96c26.5 0 48 21.5 48 48s-21.5 48-48 48zm-64 64l0 96-48 0 0-96 48 0zm64 96l0-96 32 0c26.5 0 48 21.5 48 48s-21.5 48-48 48l-32 0z"
            />
          </svg>
        </div>
        <div class="text-lg stat-title">Order</div>
        <div class="stat-value">31K</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 448 512">
            <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. -->
            <path
              d="M448 80l0 48c0 44.2-100.3 80-224 80S0 172.2 0 128L0 80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6L448 288c0 44.2-100.3 80-224 80S0 332.2 0 288L0 186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6l0 85.9c0 44.2-100.3 80-224 80S0 476.2 0 432l0-85.9z"
            />
          </svg>
        </div>
        <div class="text-lg stat-title">Products</div>
        <div class="stat-value">4,200</div>
      </div>

      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 512 512">
            <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. -->
            <path
              d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"
            />
          </svg>
        </div>
        <div class="text-lg stat-title">Users</div>
        <div class="stat-value">1,200</div>
      </div>
    </div>
  </div>
    <div class="flex flex-col md:flex-row gap-2">
      <div class="flex-1">
        <div class="cart w-full p-6 bg-base-100 shadow-xl">
          <h1>ยอดขาย</h1>
          <apexchart type="bar" :options="barOption.options" :series="barOption.series"></apexchart>
        </div>
      </div>

      <div class="flex-1">
        <div class="cart w-full p-6 bg-base-100 shadow-xl">
          <h1>ประเภทการขาย</h1>
          <apexchart type="donut" :options="donutOption.options" :series="donutOption.series"></apexchart>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
