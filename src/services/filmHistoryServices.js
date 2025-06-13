function getAuthHeader(token) {
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function upsertHistory(history, token) {
    try {
        const response = await fetch(`https://hdmoviebe.onrender.com/api/film-history/upsert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(token)
            },
            body: JSON.stringify(history)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return { status: 400, message: error.message };
    }
}

export async function deleteHistory(slug, token) {
    try {
        const response = await fetch(`https://hdmoviebe.onrender.com/api/film-history/delete/${slug}`, {
            method: 'DELETE',
            headers: {
                ...getAuthHeader(token)
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return { status: 400, message: error.message };
    }
}

export async function getHistory(token) {
    try {
        const response = await fetch(`https://hdmoviebe.onrender.com/api/film-history/get`, {
            method: 'GET',
            headers: {
                ...getAuthHeader(token)
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return { status: 400, message: error.message };
    }
}
