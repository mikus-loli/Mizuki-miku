export async function executeDecryptedScripts(
	contentDiv: HTMLElement,
): Promise<void> {
	const scripts = contentDiv.querySelectorAll("script");
	const scriptPromises = Array.from(scripts).map((script) => {
		return new Promise<void>((resolve) => {
			const newScript = document.createElement("script");
			if (script.type) {
				newScript.type = script.type;
			}
			newScript.textContent = script.textContent;
			newScript.onload = () => resolve();
			newScript.onerror = () => resolve();
			script.parentNode?.replaceChild(newScript, script);
			if (!newScript.src) {
				resolve();
			}
		});
	});
	await Promise.all(scriptPromises);
}

export function showShareComponents(): void {
	const shareComponent = document.getElementById("share-component");
	const licenseComponent = document.getElementById("license-component");
	if (shareComponent) {
		shareComponent.classList.remove("encrypted-hidden");
	}
	if (licenseComponent) {
		licenseComponent.classList.remove("encrypted-hidden");
	}
}
