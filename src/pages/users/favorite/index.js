import React, { useEffect, useState } from 'react';
import { getFavorite, deleteFavorite } from '../../../services/filmFavoriteServices';
import CardFilm from '../../../components/CardFilm';
import Message from '../../../components/Message';
import { useSelector } from 'react-redux';
import './style.scss'; // Thêm dòng này để import style

function FavoritePage() {
    const { token } = useSelector((state) => state.auth);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [confirmSlug, setConfirmSlug] = useState(null);

    useEffect(() => {
        async function fetchFavorites() {
            setLoading(true);
            const res = await getFavorite(token);
            if (res && res.status === 'success') {
                setFavorites(res.data);                
            } else {
                setFavorites([]);
            }
            setLoading(false);
        }
        fetchFavorites();
    }, [token]);

    const handleDelete = (slug) => {
        setConfirmSlug(slug);
        setMessage('Bạn có chắc muốn xóa phim này khỏi yêu thích?');
        setMessageType('confirm');
    };

    const handleConfirmDelete = async () => {
        if (!confirmSlug) return;
        const res = await deleteFavorite(confirmSlug, token);
        if (res && res.status === 'success') {
            setFavorites(prev => prev.filter(f => f.slug !== confirmSlug));
            setMessage(res.message || 'Đã xóa khỏi yêu thích');
            setMessageType('success');
        } else {
            setMessage(res.message || 'Xóa thất bại');
            setMessageType('error');
        }
        setConfirmSlug(null);
    };

    const handleCancelDelete = () => {
        setConfirmSlug(null);
        setMessage('');
    };

    return (
        <div className="favorite-page">
            {message && (
                <Message
                    type={messageType}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                >
                    {message}
                </Message>
            )}
            {loading ? (
                <p>Đang tải...</p>
            ) : favorites.length === 0 ? (
                <p>Bạn chưa có phim yêu thích nào.</p>
            ) : (
                <div className="favorite-cards">
                    {favorites.map(film => (
                        <CardFilm key={film.slug} film={film} favorite='favorite' onDelete={() => handleDelete(film.slug)} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default FavoritePage;
