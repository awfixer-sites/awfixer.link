import { defineStore } from 'pinia';
import type { Session } from '@supabase/supabase-js';
import { ref } from 'vue';

export const useAppStore = defineStore('appStore', {
	state: () => {
		return {
			initialURL: ref(''),
			supabaseSession: ref<Session | null>(null),
		};
	},
});
