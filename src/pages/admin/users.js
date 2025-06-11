import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser, editUser, deleteUser } from '../../services/authServices';
import { logout } from '../../authSlice';
import './users.scss';
import { useNavigate } from 'react-router-dom';
import Message from '../../components/Message';

const UserAdmin = () => {
    const dispatch = useDispatch();
    const { token, user: currentUser } = useSelector((state) => state.auth);

    const userId = currentUser?._id || currentUser?.id || '';
    const [user, setUser] = useState(null);
    const [editData, setEditData] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const navigate = useNavigate();

    const handleGetUser = useCallback(async () => {
        if (!userId || !token) {
            setErrorMessage('Bạn chưa đăng nhập!');
            setSuccessMessage('');
            setUser(null);
            setEditData({});
            return;
        }
        const res = await getUser(userId, token);
        const userObj = res && res.user ? res.user : res;
        if (userObj && !res.error) {
            setUser(userObj);
            setEditData(userObj);
            setErrorMessage('');
            setSuccessMessage('');
        } else {
            setUser(null);
            setEditData({});
            setErrorMessage(res.error || 'Không tìm thấy user');
            setSuccessMessage('');
        }
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
        // Không reset errorMessage ở đầu hàm, chỉ reset successMessage
        setSuccessMessage('');
        if (!editData.username || editData.username.trim() === '') {
            // Đặt errorMessage thành giá trị mới để Message luôn render lại
            setErrorMessage('');
            setTimeout(() => setErrorMessage('Username không được bỏ trống'), 0);
            return;
        }
        setErrorMessage('');
        const res = await editUser(editData, token);
        if (res && !res.error) {
            setUser(res);
            setSuccessMessage('Cập nhật thành công!');
            setIsEditing(false);
        } else {
            setErrorMessage(res.error || 'Cập nhật thất bại');
        }
    };

    const handleDelete = async () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        setShowDeleteConfirm(false);
        if (!userId) return;
        dispatch(logout());
        await deleteUser(token);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        navigate('/login');
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
            {token && user ? (
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
                </>
            ) : (
                <div className="user-admin-login-prompt">
                    <center>
                        <p>Bạn cần đăng nhập để quản lý tài khoản.</p>
                        <button onClick={() => navigate('/login')} className="user-admin-login-btn">Đăng nhập</button>
                    </center>
                </div>
            )}

            {user && (
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
                                    className="user-admin-avatar-img"
                                    onError={e => { e.target.src = 'https://via.placeholder.com/96?text=No+Avatar'; }}
                                />
                            ) : (
                                <img
                                    src="https://via.placeholder.com/96?text=No+Avatar"
                                    alt="avatar"
                                    className="user-admin-avatar-img"
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
                </div>
            )}
            {/* Hiển thị thông báo lỗi và thành công */}
            {errorMessage && <Message type="error">{errorMessage}</Message>}
            {successMessage && <Message type="success">{successMessage}</Message>}

            {/* Hiển thị xác nhận xóa */}
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
