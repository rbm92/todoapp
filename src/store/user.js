import { defineStore } from "pinia";
import { supabase } from "../supabase";
import { useProfileStore } from "./profile";
import { useRouter } from 'vue-router';

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
            try {
                const { user, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });
            if (error) throw error;
            if (user) {
                this.user = user;
                // console.log(this.user);
                await useProfileStore().createProfile(email, user.id)
            }
            } catch(error) {
                this.error = error;
            }
        },
        async signIn(email, password) {
            const { user, error } = await supabase.auth.signIn({
                email: email,
                password: password,
            });
            if (error) throw error;
            if (user) {
                this.user = user;
                // console.log(this.user);
            }
        },
        async signOut() {
            const { user, error } = await supabase.auth.signOut()
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
        async resetPassword(email) {
            const redirect = useRouter();
            const { user, error } = await supabase.auth.api.
                resetPasswordForEmail(email);
                // redirect.push({ path: "/auth/reset" });

        },
        async updatePassword(password) {
            const { user, error } = await supabase.auth.update({ password: password })
        }
    },
}); 