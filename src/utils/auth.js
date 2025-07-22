export function getUserIdFromToken(token) {
	if (!token) return null;
	try {
		const payload = token.split(".")[1];
		const decodedPayload = JSON.parse(atob(payload));
		return decodedPayload.user_id || decodedPayload.id;
	} catch (e) {
		console.error("Failed to decode token", e);
		return null;
	}
}
