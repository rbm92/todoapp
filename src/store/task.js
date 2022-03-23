import { defineStore } from "pinia";
import { supabase } from "../supabase";

export const useTaskStore = defineStore("tasks", {
    state: () => ({
        tasks: null,
    }),
    actions: {
        async fetchTasks() {
            const { data: tasks } = await supabase
                .from("tasks")
                .select("*")
                .order("id", { ascending: false });
            this.tasks = tasks;
        },
        // New code
        async addTask(title) {
            const { data, error } = await supabase
                .from('tasks')
                .insert([
                    {
                        user_id: '27ce9b17-e568-4977-a8be-744b96d18363',
                        title: title,
                        is_complete: false
                    }
                ])
        },
        async editTask(id) {
            const { data, error } = await supabase
                .from('tasks')
                .update({
                    other_column: 'otherValue'
                })
                .eq('some_column', 'someValue')
        },
        async deleteTask(id) {
            const { data, error } = await supabase
                .from('tasks')
                .delete()
                .match({ id: id })
        }
    },

});