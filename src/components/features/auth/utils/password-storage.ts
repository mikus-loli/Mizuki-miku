export interface PasswordStorage {
	save(key: string, password: string): void;
	get(key: string): string | null;
	remove(key: string): void;
}

export class SessionPasswordStorage implements PasswordStorage {
	save(key: string, password: string): void {
		try {
			sessionStorage.setItem(key, password);
		} catch (error) {
			console.error("[PasswordStorage] Failed to save:", error);
		}
	}

	get(key: string): string | null {
		try {
			return sessionStorage.getItem(key);
		} catch (error) {
			console.error("[PasswordStorage] Failed to get:", error);
			return null;
		}
	}

	remove(key: string): void {
		try {
			sessionStorage.removeItem(key);
		} catch (error) {
			console.error("[PasswordStorage] Failed to remove:", error);
		}
	}
}

export function createPageKey(pathname: string): string {
	return `page-password-${pathname}`;
}

const defaultStorage = new SessionPasswordStorage();

export function savePassword(password: string): void {
	const key = createPageKey(window.location.pathname);
	defaultStorage.save(key, password);
}

export function getSavedPassword(): string | null {
	const key = createPageKey(window.location.pathname);
	return defaultStorage.get(key);
}

export function removeSavedPassword(): void {
	const key = createPageKey(window.location.pathname);
	defaultStorage.remove(key);
}

export { defaultStorage as passwordStorage };
