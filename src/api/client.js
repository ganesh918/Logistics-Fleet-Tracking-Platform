import { API_BASE_URL } from './config';
export class ApiError extends Error {
    status;
    body;
    constructor(message, status, body) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.body = body;
    }
}
export async function apiRequest(path, options = {}) {
    const { body, headers, ...rest } = options;
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...rest,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
        let payload;
        try {
            payload = await response.json();
        }
        catch {
            payload = undefined;
        }
        throw new ApiError(response.statusText || 'Request failed', response.status, payload);
    }
    if (response.status === 204) {
        return undefined;
    }
    return response.json();
}
