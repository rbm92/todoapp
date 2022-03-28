import { defineStore } from "pinia";
import { supabase } from "../supabase";
import { useUserStore } from "./user";

export const useTaskStore = defineStore("profiles", {
    state: () => ({
        profile: null,
    }),
    actions: {
        async fetchProfiles() {
            const { data: profiles } = await supabase
                .from("profiles")
                .select("*")
                .order("id", { ascending: false });
            this.profiles = profiles;
            return this.profiles;
        },
        // New code
        async filterDone() {
            const { data: tasks } = await supabase
                .from("tasks")
                .select("*")
                .filter("is_complete", "eq", true);
            this.tasks = tasks;
            return this.tasks;
        },
        async filterUndone() {
            const { data: tasks } = await supabase
                .from("tasks")
                .select("*")
                .filter("is_complete", "eq", false);
            this.tasks = tasks;
            return this.tasks;
        },
        async sortTitle() {
            const { data: tasks } = await supabase
                .from("tasks")
                .select("*")
                .order("title", { ascending: true });
            this.tasks = tasks;
            return this.tasks;
        },
        async sortDate() {
            const { data: tasks } = await supabase
                .from("tasks")
                .select("*")
                .order("inserted_at", { ascending: false });
            this.tasks = tasks;
            return this.tasks;
        },
        async addTask(title) {
            // console.log(useUserStore().user.id);
            const { data, error } = await supabase
                .from('tasks')
                .insert([
                    {
                        user_id: useUserStore().user.id,
                        title: title,
                        is_complete: false
                    }
                ])
        },
        async toggleDone(bool, id) {
            const { data, error } = await supabase
                .from('tasks')
                .update({ is_complete: bool })
                .match({ id: id })
        },
        async editTask(title, id) {
            const { data, error } = await supabase
                .from('tasks')
                .update({ title: title })
                .match({ id: id })
        },
        async deleteTask(id) {
            const { data, error } = await supabase
                .from('tasks')
                .delete()
                .match({ id: id })
        },
        async allDone() {
            const { data, error } = await supabase
                .from('tasks')
                .update({ is_complete: true })
                .match({ is_complete: false })
        },
        async allUndone() {
            const { data, error } = await supabase
                .from('tasks')
                .update({ is_complete: false })
                .match({ is_complete: true })
        },
        async removeAll() {
            const { data, error } = await supabase
                .from('tasks')
                .delete()
                .match({ user_id: useUserStore().user.id })
        },
    },

});