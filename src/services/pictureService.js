function getAuthHeader(token) {
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function addPicture(thumb, token) {
    try {
        const response = await fetch('https://hdmoviebe.onrender.com/api/pictures/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(token),
            },
            body: JSON.stringify({ thumb }),
        });
        return await response.json();
    } catch (error) {
        return { status: 'error', message: error.message };
    }
}

export async function deletePicture(id, token) {
    try {
        const response = await fetch(`https://hdmoviebe.onrender.com/api/pictures/delete/${id}`, {
            method: 'DELETE',
            headers: {
                ...getAuthHeader(token),
            },
        });
        return await response.json();
    } catch (error) {
        return { status: 'error', message: error.message };
    }
}

export async function getAllPictures(token) {
    try {
        const response = await fetch('https://hdmoviebe.onrender.com/api/pictures/all', {
            method: 'GET',
            headers: {
                ...getAuthHeader(token),
            },
        });
        return await response.json();
    } catch (error) {
        return { status: 'error', message: error.message };
    }
}
