import { createRouter, createWebHistory } from "vue-router";
import Auth from "../views/Auth.vue";
import Home from "../views/Home.vue";
import Profile from "../views/Profile.vue";
import SignIn from "../components/SignIn.vue";
import SignUp from "../components/SignUp.vue";
import Reset from "../components/Reset.vue";

const routes = [
    {
        path: "/auth",
        component: Auth,
        children: [
            {
                path: "",
                component: SignIn
            },
            {
                path: "sign-up",
                component: SignUp
            },
            {
                path: "reset",
                component: Reset
            },
        ]
    },
    {
        path: "/",
        component: Home,
    },
    {
        path: "/profile",
        component: Profile
    },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;