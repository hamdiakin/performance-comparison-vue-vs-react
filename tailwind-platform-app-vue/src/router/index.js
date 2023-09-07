import { createApp } from "vue";
import App from "../App.vue";
import { createRouter, createWebHistory } from "vue-router";
import List from "../components/List.vue";
import ItemDetail from "../components/ItemDetail.vue";
import EditItem from "../components/EditItem.vue";

const routes = [
  { path: "/", component: List },
  { path: "/item/:id", component: ItemDetail },
  { path: "/item/:id/edit", component: EditItem },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);

export default router