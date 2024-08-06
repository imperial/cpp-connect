/**
 * Functions for accessing MS Graph APIs
 */

export async function makeGraphRequest(access_token: string, endpoint: string) {
	return fetch(`https://graph.microsoft.com/v1.0/${endpoint}`, {
		headers: { Authorization: `Bearer ${access_token}` },
	})
}

export async function getDepartment(access_token: string) {
	const response = await makeGraphRequest(access_token, "/me?$select=department")
	try {
		const data = await response.json()
		return data.department
	} catch {
		console.error("Error fetching department")
		return null
	}
}