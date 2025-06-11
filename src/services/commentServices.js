// Thêm bình luận mới
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

// Lấy danh sách bình luận theo slug phim
export async function getCommentBySlug(slug) {
    try {
        const response = await fetch(`https://hdmoviebe.onrender.com/api/comments/by-slug/${slug}`);
        const data = await response.json();
        // Nếu data là mảng, trả về { comments: data }
        if (Array.isArray(data)) {
            return { comments: data };
        }
        return data;
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Xóa bình luận theo id
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
