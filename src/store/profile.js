import { defineStore } from "pinia";
import { supabase } from "../supabase";
import { useUserStore } from "./user";

export const useProfileStore = defineStore("profiles", {
    state: () => ({
        profiles: null,
    }),
    actions: {
        async fetchProfile() {
            try {
                const { data: profiles, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .match({ id: useUserStore().user.id })
                if (error) throw error;
                this.profiles = profiles;
                console.log(profiles);
                return this.profiles;
            } catch (error) {
                console.log(error);
            }
        },
        async createProfile(email, id) {
            await supabase
                .from("profiles")
                .insert([
                    {
                        id: id,
                        username: email
                    }
                ])
        },
        async updateProfile(username, website) {
            try {
                const { data: profile, error } = await supabase
                    .from("profiles")
                    .update([
                        {
                            username: username,
                            website: website
                        }
                    ])
                    .match({ id: useUserStore().user.id })
                if (error) throw error;
                // this.profile = profile;
                // return this.profile;
            } catch (error) {
                console.log(error);
            }
        },
    },
});