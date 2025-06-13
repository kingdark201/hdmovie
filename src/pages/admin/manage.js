import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUserById, deleteUser } from '../../services/authServices';
import { getAllComments, deleteComment } from '../../services/commentServices';
import Message from '../../components/Message';
import './manage.scss';
import { useSelector } from 'react-redux';
import CardUser from '../../components/CardUser';
import CardComment from '../../components/CardComment';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';

Chart.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

function ManageAdmin() {
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [deleteCommentId, setDeleteCommentId] = useState(null);
    const [activeTab, setActiveTab] = useState('users'); // 'users' | 'comments'

    const [userFilter, setUserFilter] = useState('');
    const [commentFilter, setCommentFilter] = useState('');
    const { token, user: currentUser } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
            if (!token && !currentUser) {
                navigate('/login');
            }
        }, [token,currentUser, navigate]);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getAllUsers(token);
            if (res && res.status === 'success') {
                setUsers(res.data);
            } else {
                setUsers([]);
                setError(res.message || 'Không lấy được danh sách user');
            }
        } catch (e) {
            setError('Lỗi lấy user');
        }
        setLoading(false);
    };

    const fetchComments = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getAllComments(token);
            if (res && res.status === 'success') {
                setComments(res.data);
            } else {
                setComments([]);
                setError(res.message || 'Không lấy được danh sách comment');
            }
        } catch (e) {
            setError('Lỗi lấy comment');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
        fetchComments();
    }, []);

    const handleDeleteUser = (id) => {
        setDeleteUserId(id);
    }
    const confirmDeleteUser = async () => {
        if (!deleteUserId) return;
        setError('');
        try {
            const res = await deleteUserById(deleteUserId, token);
            if (res && res.status === 'success') {
                setDeleteUserId(null);
                setSuccess(res.message);
                setUsers(users.filter(u => u._id !== deleteUserId));
            } else {
                setError(res.message || 'Xóa user thất bại');
            }
        } catch (e) {
            console.log('Error delete', e);
            
        }
        setDeleteUserId(null);
    };
    const cancelDeleteUser = () => setDeleteUserId(null);

    // // Xóa comment
    const handleDeleteComment = (id) => {
        setDeleteCommentId(id)
    };

    const confirmDeleteComment = async () => {
        if (!deleteCommentId) return;
        setError('');
        try {
            const res = await deleteComment(deleteCommentId, token);
            if (res && res.status === 'success') {
                setSuccess(res.message);
                setComments(comments.filter(c => c.id !== deleteCommentId));
            } else {
                setError(res.message || 'Xóa comment thất bại');
            }
        } catch (e) {
            console.log('Error delete comment', e);
        }
        setDeleteCommentId(null);
    };
    const cancelDeleteComment = () => setDeleteCommentId(null);

    const filteredUsers = users.filter(u =>
        u.username?.toLowerCase().includes(userFilter.toLowerCase())
        || (u._id && u._id.toLowerCase().includes(userFilter.toLowerCase()))
    );    

    const filteredComments = comments.filter(c =>
        (c.username || (c.user && c.user.username) || '').toLowerCase().includes(commentFilter.toLowerCase())
        || (c.slug_film || '').toLowerCase().includes(commentFilter.toLowerCase())
        || (c.comment || '').toLowerCase().includes(commentFilter.toLowerCase())
    );
    
    // Tính toán dữ liệu cho biểu đồ
    const userRoleCount = users.reduce((acc, u) => {
        const role = u.role || 'user';
        acc[role] = (acc[role] || 0) + 1;
        return acc;
    }, {});

    const commentBySlug = comments.reduce((acc, c) => {
        const slug = c.slug_film || 'unknown';
        acc[slug] = (acc[slug] || 0) + 1;
        return acc;
    }, {});

    const commentByUser = comments.reduce((acc, c) => {
        const username = c.username || (c.user && c.user.username) || 'unknown';
        acc[username] = (acc[username] || 0) + 1;
        return acc;
    }, {});

    // Dữ liệu cho các biểu đồ
    const userRoleData = {
        labels: Object.keys(userRoleCount),
        datasets: [{
            label: 'Số lượng',
            data: Object.values(userRoleCount),
            backgroundColor: ['#6c63ff', '#ffb347', '#ff6384', '#36a2eb'],
        }]
    };

    const commentBySlugData = {
        labels: Object.keys(commentBySlug),
        datasets: [{
            label: 'Số comment',
            data: Object.values(commentBySlug),
            backgroundColor: ['#6c63ff', '#ffb347', '#ff6384', '#36a2eb'],
        }]
    };

    const commentByUserData = {
        labels: Object.keys(commentByUser),
        datasets: [{
            label: 'Số comment',
            data: Object.values(commentByUser),
            backgroundColor: ['#6c63ff', '#ffb347', '#ff6384', '#36a2eb'],
        }]
    };

    return (
        <div className="manage-admin-page">
            <h2>HD Movie</h2>

            <div className="manage-tabs">
                <button
                    className={`manage-tab${activeTab === 'users' ? ' active' : ''}`}
                    onClick={() => setActiveTab('users')}
                    type="button"
                >
                    Người dùng
                </button>
                <button
                    className={`manage-tab${activeTab === 'comments' ? ' active' : ''}`}
                    onClick={() => setActiveTab('comments')}
                    type="button"
                >
                    Bình luận
                </button>
                <button
                    className={`manage-tab${activeTab === 'charts' ? ' active' : ''}`}
                    onClick={() => setActiveTab('charts')}
                    type="button"
                >
                    Biểu đồ
                </button>
            </div>

            {activeTab === 'users' && (
                <div className="manage-section">
                    <div className="manage-filter-row">
                        <input
                            type="text"
                            placeholder="Tìm kiếm user..."
                            value={userFilter}
                            onChange={e => setUserFilter(e.target.value)}
                            style={{ marginRight: 16 }}
                        />
                    </div>
                    {loading ? <p>Đang tải...</p> : (
                        <div className="card-user-list">
                            {filteredUsers.map(u => (
                                <CardUser
                                    key={u._id}
                                    id={u._id}
                                    avatar={u.avatar}
                                    username={u.username}
                                    createdAt={u.createdAt}
                                    onDelete={handleDeleteUser}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'comments' && (
                <div className="manage-section">
                    <div className="manage-filter-row">
                        <input
                            type="text"
                            placeholder="Tìm kiếm bình luận..."
                            value={commentFilter}
                            onChange={e => setCommentFilter(e.target.value)}
                            style={{ marginRight: 16 }}
                        />
                    </div>
                    {loading ? <p>Đang tải...</p> : (
                        <div className="card-comment-list">
                            {filteredComments.map((c, idx) => (
                                <CardComment
                                    key={c.id || `comment-${idx}`}
                                    id={c.id}
                                    username={c.username || (c.user && c.user.username) || 'unknown'}
                                    slug={c.slug_film}
                                    comment={c.comment}
                                    time={c.createdAt}
                                    onDelete={handleDeleteComment}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'charts' && (
                <div className="manage-section">
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: 32}}>
                        <div style={{flex: 1, minWidth: 280, maxWidth: 400}}>
                            <Pie data={userRoleData} />
                            <p className='title-char'>Số lượng người dùng theo vai trò</p>
                        </div>
                        <div style={{flex: 1, minWidth: 280, maxWidth: 400}}>
                            <Bar data={commentBySlugData} options={{indexAxis: 'y'}} />
                            <p className='title-char'>Số lượng comment theo phim (slug)</p>
                        </div>
                        <div style={{flex: 1, minWidth: 280, maxWidth: 400}}>
                            <Bar data={commentByUserData} options={{indexAxis: 'y'}} />
                            <p className='title-char'>Số lượng comment theo user</p>
                        </div>
                    </div>
                </div>
            )}

            {deleteUserId && (
                <Message type="confirm" onConfirm={confirmDeleteUser} onCancel={cancelDeleteUser}>
                    Bạn có chắc muốn xóa user này?
                </Message>
            )}
            {deleteCommentId && (
                <Message type="confirm" onConfirm={confirmDeleteComment} onCancel={cancelDeleteComment}>
                    Bạn có chắc muốn xóa bình luận này?
                </Message>
            )}

            {error && <Message type="error">{error}</Message>}
            {success && <Message type="success">{success}</Message>}
        </div>
    );
}

export default ManageAdmin;
