export async function addComment({ comment, slug_film }, token) {
    try {
        const response = await fetch('https://hdmoviebe.onrender.com/api/comments/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ comment, slug_film }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getCommentBySlug(slug) {
    try {
        const response = await fetch(`https://hdmoviebe.onrender.com/api/comments/by-slug/${slug}`);
        const data = await response.json();
        if (Array.isArray(data)) {
            return { comments: data };
        }
        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function deleteComment(commentId, token) {
    try {
        const response = await fetch(`https://hdmoviebe.onrender.com/api/comments/delete/${commentId}`, {
            method: 'DELETE',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getAllComments(token) {
    try {
        const response = await fetch('https://hdmoviebe.onrender.com/api/comments/all', {
            method: 'GET',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}
