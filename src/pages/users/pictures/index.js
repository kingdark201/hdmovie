import React, { useState, useEffect } from 'react';
import './style.scss';
import { useSelector } from 'react-redux';
import Message from '../../../components/Message';
import { editUser } from '../../../services/authServices';
import { deletePicture, getAllPictures } from '../../../services/pictureService';

function Pictures({ refreshKey, onAvatarChange }) {
    const { token } = useSelector((state) => state.auth);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImg, setSelectedImg] = useState(null);
    const [thumbUrl, setThumbUrl] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        async function fetchPictures() {
            setLoading(true);
            setError('');
            try {
                const res = await getAllPictures(token);
                if (res && res.status === 'success') {
                    setImages(res.data);
                } else {
                    setImages([]);
                    setError(res.message || 'Không lấy được danh sách ảnh');
                }
            } catch (e) {
                console.log('Lỗi khi lấy ảnh:', e);
                
            }
            setLoading(false);
        }
        fetchPictures();
    }, [token, refreshKey]); // Thêm refreshKey vào dependencies

    const handleDelete = async () => {
        if (!selectedImg) return;
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        setShowDeleteConfirm(false);
        if (!selectedImg) return;
        try {
            const res = await deletePicture(selectedImg, token);
            if (res && res.status === 'success') {
                setImages(prev => prev.filter(img => (img._id || img.id) !== selectedImg));
                setMessage('Đã xóa ảnh');
                setMessageType('success');
            } else {
                setMessage(res.message || 'Xóa thất bại');
                setMessageType('error');
            }
        } catch {
            console.log('Lỗi khi xóa ảnh');
        }
        setSelectedImg(null);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    const handleSetAvatar = async () => {
        if (!selectedImg) return;
        const userData = {
            avatar: thumbUrl
        }
        try {
            const res = await editUser(userData, token);
            if (res && res.status === 'success') {
                setMessage(res.message);
                setMessageType('success');
                if (onAvatarChange) {
                    onAvatarChange(thumbUrl);
                }
            } else {
                setMessage(res.message || 'Đặt avatar thất bại');
                setMessageType('error');
            }
        } catch {
            console.log('Lỗi khi đặt ảnh đại diện');
            
        }
        setSelectedImg(null);
    };

    const handleClickImage = (id, thumb) => {
        setSelectedImg(id);
        setThumbUrl(thumb);
    }

    return (
        <div className="pictures-page">
            {loading ? (
                <p>Đang tải...</p>
            ) : error ? (
                <Message type="error">{error}</Message>
            ) : (
                <div className="pictures-grid">
                    {images.map((img, idx) => (
                        <div className="picture-item animate__animated animate__bounceIn" key={idx} onClick={() => handleClickImage(img._id||img.id, img.thumb)}>
                            <img src={img.thumb} alt={`pic-${idx}`} />
                        </div>
                    ))}
                </div>
            )}
            {selectedImg && (
                <div className="picture-modal" onClick={() => setSelectedImg(null)}>
                    <div className="picture-modal-content animate__animated animate__zoomIn" onClick={e => e.stopPropagation()}>
                        <img src={thumbUrl} alt="large" />
                        <div className="picture-modal-actions">
                            <button onClick={handleDelete}><i className="bi bi-trash"></i></button>
                            <button onClick={handleSetAvatar}><i className="bi bi-person-circle"></i> Đặt làm avatar</button>
                            <button onClick={() => setSelectedImg(null)}><i className="bi bi-x-circle"></i></button>
                        </div>
                    </div>
                </div>
            )}
            {/* Xác nhận xóa ảnh */}
            {showDeleteConfirm && (
                <Message
                    type="confirm"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                >
                    Bạn có chắc chắn muốn xóa ảnh này?
                </Message>
            )}
            {message && <Message type={messageType}>{message}</Message>}
        </div>
    );
}

export default Pictures;
