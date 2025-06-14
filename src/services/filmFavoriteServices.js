function getAuthHeader(token) {
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function addFavorite(favorite, token) {
    try {
        const response = await fetch(`https://hdmoviebe.onrender.com/api/film-favorite/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(token)
            },
            body: JSON.stringify(favorite)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return { status: 400, message: error.message };
    }
}

export async function deleteFavorite(slug, token) {
    try {
        const response = await fetch(`https://hdmoviebe.onrender.com/api/film-favorite/delete/${slug}`, {
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

export async function getFavorite(token) {
    try {
        const response = await fetch(`https://hdmoviebe.onrender.com/api/film-favorite/get`, {
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
