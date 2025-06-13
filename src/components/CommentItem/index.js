import React from 'react';
import './style.scss';

function CommentItem({ avatar, username, time, comment, onDelete }) {
    return (
        <div className="comment-item-row animate__animated animate__slideInLeft">
            <img
                src={avatar || 'https://antimatter.vn/wp-content/uploads/2022/10/anh-avatar-chill-bau-troi-dem.jpg'}
                alt="avatar"
            />
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span className="comment-username">{username||'Default'}</span>
                    <span className="comment-time">{time||'06:05:40 11/6/2025'}</span>
                </div>
                <div className="comment-content">{comment||'Example comment'}</div>
            </div>
            {onDelete && (
                <button
                    className="comment-delete-btn"
                    onClick={onDelete}
                    title="Xóa bình luận"
                >
                    <i className="bi bi-trash"></i>
                </button>
            )}
        </div>
    );
}

export default CommentItem;
