import type { DecryptResult } from "../types/auth";

declare const CryptoJS: {
	AES: {
		decrypt: (
			encryptedContent: string,
			password: string,
		) => {
			toString: (encoding: typeof CryptoJS.enc.Utf8) => string;
		};
	};
	enc: { Utf8: unknown };
};

const CRYPTOJS_URL = "/assets/js/crypto-js.min.js";
const VERIFICATION_PREFIX = "MIZUKI-VERIFY:";

export async function loadCryptoLibraries(): Promise<void> {
	if (typeof CryptoJS !== "undefined") {
		return;
	}

	await new Promise<void>((resolve, reject) => {
		const script = document.createElement("script");
		script.src = CRYPTOJS_URL;
		script.onload = () => resolve();
		script.onerror = () =>
			reject(new Error("Failed to load CryptoJS"));
		document.head.appendChild(script);
	});
}

export function verifyCryptoLoaded(): boolean {
	return typeof CryptoJS !== "undefined";
}

export async function decryptContent(
	encryptedContent: string,
	password: string,
): Promise<DecryptResult> {
	if (!password?.trim()) {
		return { success: false, content: null, error: "passwordRequired" };
	}

	if (!encryptedContent?.trim()) {
		return { success: false, content: null, error: "invalidContent" };
	}

	if (!verifyCryptoLoaded()) {
		await loadCryptoLibraries();
	}

	try {
		const decryptedBytes = CryptoJS.AES.decrypt(
			encryptedContent,
			password,
		);
		const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);

		if (
			!decryptedString ||
			!decryptedString.startsWith(VERIFICATION_PREFIX)
		) {
			return { success: false, content: null, error: "incorrect" };
		}

		const realContent = decryptedString.replace(VERIFICATION_PREFIX, "");
		return { success: true, content: realContent, error: null };
	} catch (error) {
		console.error("[Crypto] Decryption error:", error);
		return { success: false, content: null, error: "decryptionError" };
	}
}
