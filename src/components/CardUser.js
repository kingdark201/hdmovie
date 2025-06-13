import React from 'react';
import './CardUser.scss';

function CardUser({ id,avatar, username, role, createdAt, onDelete }) {
    return (
        <div className="card-user-row animate__animated animate__fadeInLeft">
            <img
                src={avatar || 'https://antimatter.vn/wp-content/uploads/2022/10/anh-avatar-chill-bau-troi-dem.jpg'}
                alt="avatar"
                className="card-user-avatar"
            />
            <div className="card-user-info">
                <span className="card-user-username">{`${username} - ${role}` ||'unknown'}</span>
                <span className="card-user-created">{createdAt ? new Date(createdAt).toLocaleDateString() : '10/06/2025'}</span>
            </div>
            <button className="card-user-delete-btn" onClick={()=>onDelete(id)} title="Xóa user">
                <i className="bi bi-trash"></i>
            </button>
        </div>
    );
}

export default CardUser;
