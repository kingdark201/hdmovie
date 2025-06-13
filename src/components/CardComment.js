import React from 'react';
import './CardComment.scss';

function CardComment({ id, username, slug, comment, time, onDelete }) {
    return (
        <div className="card-comment-row animate__animated animate__fadeInLeft">
            <div className="card-comment-info">
                <div className="card-comment-username">{username||'uknown'}</div>
                <div className="card-comment-slug">{slug||'slug default'}</div>
                <div className="card-comment-content">{comment||'default comment'}</div>
                <div className="card-comment-time">{time ? new Date(time).toLocaleString() : '00:00:00 10/06/2025'}</div>
            </div>
            <button className="card-comment-delete-btn" onClick={()=>onDelete(id)} title="Xóa bình luận">
                <i className="bi bi-trash"></i>
            </button>
        </div>
    );
}

export default CardComment;
