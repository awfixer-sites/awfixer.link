import { ref } from 'vue';
import { supabase } from '@/services/supabase';

async function handleSignIn(credentials: { email: string; password?: string }) {
	if (credentials.password) {
		const { error, data } = await supabase.auth.signInWithPassword({
			email: credentials.email,
			password: credentials.password,
		});
		return { error, user: data.user };
	} else {
		const { error } = await supabase.auth.signInWithOtp({
			email: credentials.email,
		});
		return { error, user: null };
	}
}

async function handleSignup(credentials: { email: string; password: string }) {
	const { email, password } = credentials;
	const { error } = await supabase.auth.signUp({ email, password });
	return { error };
}

async function handleOAuthLogin(provider: string) {
	const { error } = await supabase.auth.signInWithOAuth({
		provider: provider as any,
	});
	return { error };
}

async function handlePasswordReset(credentials: { email: string }) {
	const { email } = credentials;
	const { error } = await supabase.auth.resetPasswordForEmail(email);
	return { error };
}

async function handleUpdateUser(credentials: { email?: string; password?: string }) {
	const { error } = await supabase.auth.updateUser(credentials);

	return { error };
}

async function handleSignOut() {
	const { error } = await supabase.auth.signOut();
	return { error };
}

export {
	handleSignIn,
	handleOAuthLogin,
	handleSignup,
	handleSignOut,
	handlePasswordReset,
	handleUpdateUser,
};
