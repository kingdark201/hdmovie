import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser, editUser, deleteUser } from '../../services/authServices';
import { logout } from '../../authSlice';
import './users.scss';
import { useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
import History from '../users/history';
import Favorite from '../users/favorite';

const UserAdmin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, user: currentUser } = useSelector((state) => state.auth);
    const userId = currentUser?._id || currentUser?.id || '';

    const [user, setUser] = useState(null);
    const [editData, setEditData] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [loading, setLoading] = useState(false); // Thêm state loading
    const [activeTab, setActiveTab] = useState('history');
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    const handleGetUser = useCallback(async () => {
        if (!userId || !token) {
            setErrorMessage('Vui lòng đăng nhập để xem thông tin người dùng!');
            setSuccessMessage('');
            setUser(null);
            setEditData({});
            setLoading(false);
            return;
        }
        setLoading(true); // Bắt đầu loading
        const res = await getUser(userId, token);
        const userObj = res && res.data ? res.data : null;

        if (userObj && res.status === 'success') {
            setUser(userObj);
            setEditData(userObj);
            setErrorMessage('');
            setSuccessMessage('');
        } else {
            setUser(null);
            setEditData({});
            setErrorMessage(res.message);
            setSuccessMessage('');
        }
        setLoading(false); // Kết thúc loading
    }, [userId, token]);

    useEffect(() => {
        if (!token || !userId) {
            setErrorMessage('Bạn chưa đăng nhập hoặc thông tin user không hợp lệ!');
            setSuccessMessage('');
            setUser(null);
            setEditData({});
            return;
        }
        handleGetUser();
    }, [userId, token, handleGetUser]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditData(prev => ({
            ...prev,
            password: ''
        }));
        setErrorMessage('');
        setSuccessMessage('');
    };

    const handleSave = async () => {
        if (!userId) return;
        setSuccessMessage('');
        if (!editData.username || editData.username.trim() === '') {
            setErrorMessage('');
            return;
        }
        setErrorMessage('');
        const res = await editUser(editData, token);
        if (res && res.status === 'success') {
            setUser(res.data);
            setSuccessMessage(res.message || 'Cập nhật thành công');
            setIsEditing(false);
        } else {
            setErrorMessage(res.message || 'Cập nhật thất bại');
        }
    };

    const handleDelete = async () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        setShowDeleteConfirm(false);
        if (!userId) return;
        dispatch(logout());
        const res = await deleteUser(token);
        if (res && res.status === 'success') {
            setSuccessMessage(res.message || 'Xóa tài khoản thành công');
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            navigate('/login');
        } else {
            setErrorMessage(res.message || 'Xóa tài khoản thất bại');
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        navigate('/login');
    };

    return (
        <div className="user-admin-container">
            {/* Avatar Modal */}
            {showAvatarModal && (
                <div
                    className="user-admin-avatar-modal"
                    onClick={() => setShowAvatarModal(false)}
                >
                    <img
                        src={editData.avatar || 'https://via.placeholder.com/400?text=No+Avatar'}
                        alt="avatar-large"
                        className="user-admin-avatar-modal-img"
                        onClick={e => e.stopPropagation()}
                    />
                </div>
            )}
            {/* End Avatar Modal */}

            {loading ? (
                <div className="user-admin-loading">
                    <center>Đang tải...</center>
                </div>
            ) : token && user ? (
                <>
                    <div className="user-admin-delete-topleft">
                        <button onClick={handleDelete} className="user-admin-delete-btn">
                            <i className="bi bi-trash"></i>
                        </button>
                    </div>
                    <div className="user-admin-logout-topright">
                        <button onClick={handleLogout} className="user-admin-logout-btn">
                            <i className="bi bi-box-arrow-right"></i>
                        </button>
                    </div>

                    <div className="user-admin-fields">
                        <div className="user-admin-avatar">
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="user-admin-input"
                                    placeholder="Avatar URL"
                                    value={editData.avatar || ''}
                                    onChange={e => setEditData({ ...editData, avatar: e.target.value })}
                                    style={{ textAlign: 'center' }}
                                />
                            ) : (
                                editData.avatar ? (
                                    <img
                                        src={editData.avatar}
                                        alt="avatar"
                                        className="user-admin-avatar-img animate__animated animate__ZoomIn"
                                        onError={e => { e.target.src = 'https://via.placeholder.com/96?text=No+Avatar'; }}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setShowAvatarModal(true)}
                                    />
                                ) : (
                                    <img
                                        src="https://via.placeholder.com/96?text=No+Avatar"
                                        alt="avatar"
                                        className="user-admin-avatar-img"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setShowAvatarModal(true)}
                                    />
                                )
                            )}
                        </div>
                        <h1 className="user-admin-username">{editData.username}</h1>
                        <p className="user-admin-created-at">
                            {editData.createdAt ? new Date(editData.createdAt).toLocaleDateString() : 'Chưa có ngày tạo'}
                        </p>
                        <div className="user-admin-field">
                            {isEditing && (
                                <input
                                    value={editData.username || ''}
                                    onChange={e => setEditData({ ...editData, username: e.target.value })}
                                    className="user-admin-input"
                                />
                            )}
                        </div>
                        <div className="user-admin-field">
                            {isEditing && (
                                <input
                                    type="password"
                                    value={editData.password || ''}
                                    onChange={e => setEditData({ ...editData, password: e.target.value })}
                                    className="user-admin-input"
                                    placeholder="Nhập mật khẩu mới"
                                />
                            )}
                        </div>

                        {isEditing ? (
                            <button onClick={handleSave} className="user-admin-save-btn"><i className="bi bi-clipboard-check"></i> Save</button>
                        ) : (
                            <button onClick={handleEdit} className="user-admin-edit-btn"><i className="bi bi-pencil-square"></i> Edit</button>
                        )}

                        {user.role && user.role === 'admin' && (
                            <button onClick={() => navigate('/admin/manage')} className="user-admin-manage-btn"><i className="bi bi-person-circle"></i> Manage</button>
                        )}

                        {/* Tabs */}
                        <div className="user-admin-tabs">
                            <button
                                className={`user-admin-tab-btn${activeTab === 'history' ? ' active' : ''}`}
                                onClick={() => setActiveTab('history')}
                            >
                                <i className="bi bi-clock-history"></i> Lịch sử xem
                            </button>
                            <button
                                className={`user-admin-tab-btn${activeTab === 'favorites' ? ' active' : ''}`}
                                onClick={() => setActiveTab('favorites')}
                            >
                                <i className="bi bi-heart"></i> Phim yêu thích
                            </button>
                        </div>
                        <div className="user-admin-tab-content">
                            {activeTab === 'history' && <History/>}
                            {activeTab === 'favorites' && <Favorite/>}
                        </div>
                        {/* End Tabs */}

                        
                    </div>
                </>
            ) : (
                <div className="user-admin-login-prompt">
                    <center>
                        <p>Bạn cần đăng nhập để quản lý tài khoản.</p>
                        <button onClick={() => navigate('/login')} className="user-admin-login-btn">Đăng nhập</button>
                    </center>
                </div>
            )}

            {errorMessage && <Message type="error">{errorMessage}</Message>}
            {successMessage && <Message type="success">{successMessage}</Message>}

            {showDeleteConfirm && (
                <Message
                    type="confirm"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                >
                    Bạn muốn xóa "{currentUser.username}"?
                </Message>
            )}
        </div>
    );
};


export default UserAdmin;
