import { defineStore } from "pinia";
import { supabase } from "../supabase";
import { useProfileStore } from "./profile";
// import { router } from 'vue-router';

export const useUserStore = defineStore("user", {
    state: () => ({
        user: null,
    }),

    actions: {
        // setUser(payload) {
        //     state.user = payload ? payload.user : null;
        // },
        async fetchUser() {
            const user = await supabase.auth.user();
            this.user = user;
        },
        async signUp(email, password) {
            const { user, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });
            if (error) throw error;
            if (user) {
                this.user = user;
                // console.log(this.user);
            }
            
            await useProfileStore().createProfile(email, user.id)
        },
        async signIn(email, password) {
            const { user, error } = await supabase.auth.signIn({
                email: email,
                password: password,
            });
            if (error) throw error;
            if (user) {
                this.user = user;
                console.log(this.user);
            }
        },
        async signOut() {
            const { user, error } = await supabase.auth.signOut()
            this.user = {};
        },
        persist: {
            enabled: true,
            strategies: [
                {
                    key: "user",
                    storage: localStorage,
                },
            ],
        },
    },
});