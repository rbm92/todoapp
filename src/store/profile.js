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
                // console.log(profiles);
                return this.profiles;
            } catch (error) {
                console.log(error);
            }
        },
        async createProfile(email, id) {
            console.log(email, id)
            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .insert([
                        {
                            id: id,
                            username: email.split('@')[0],
                            avatar_url: 'https://www.actionpeace.org/wp-content/uploads/2015/07/generic-avatar.png',
                            website: 'vuejsexamples.com/tag/todo/'
                        }
                    ])
                if (error) throw error;
            }
            catch (error) {
                console.log(error);
            }
        },
        async updateProfile(username, website, avatar) {
            try {
                const { data: profile, error } = await supabase
                    .from("profiles")
                    .update([
                        {
                            username: username,
                            website: website,
                            avatar_url: avatar
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
        async uploadFile(avatar) {
            try {
                const { data, error } = await supabase
                    .storage
                    .from('avatars')
                    .upload('public/avatar1.png', avatar, {
                        cacheControl: '3600',
                        upsert: false
                    })
                if (error) throw error
            } catch (error) {
                console.log(error);
                return { error: error }
            }
            // await this.getFile();
        },
        async getFile() {
            try {
                const { publicURL, error } = await supabase
                    .storage
                    .from('avatars')
                    .getPublicUrl('public/avatar1.png');
                if (error) throw error
                return publicURL;
            } catch (error) {
                return { error: error }
            }
        }
    },
});