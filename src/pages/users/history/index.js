import React, { useEffect, useState } from 'react';
import './style.scss';
import CardHistory from '../../../components/CardHistory';
import { getHistory, deleteHistory } from '../../../services/filmHistoryServices';
import Message from '../../../components/Message';
import { useSelector } from 'react-redux';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmSlug, setConfirmSlug] = useState(null);
    const { token, user: currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            const res = await getHistory(token);
            if (res && res.status === 'success' && Array.isArray(res.data)) {
                setHistory(res.data);
            } else {
                setHistory([]);
            }
            setLoading(false);
        };
        fetchHistory();
    }, []);

    const handleDeleteHistory = (slug) => {
        setConfirmSlug(slug);
    };

    const handleConfirmDelete = async () => {
        if (!confirmSlug) return;
        const res = await deleteHistory(confirmSlug, token);
        if (res && res.status === 'success') {
            setHistory(prev => prev.filter(item => item.slug !== confirmSlug));
            setConfirmSlug(null);
        }
    };

    const handleCancelDelete = () => {
        setConfirmSlug(null);
    };

    return (
        <div className="history-page">
            <h2 className='title-history'>Lịch sử xem phim</h2>
            {confirmSlug && (
                <Message
                    type="confirm"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                >
                    Bạn có muốn xóa lịch sử phim này?
                </Message>
            )}
            {loading ? (
                <p>Đang tải lịch sử...</p>
            ) : history.length === 0 ? (
                <p>Bạn chưa xem bộ phim nào.</p>
            ) : (
                <>
                    <div className="history-list">
                        {history.map((item, idx) => (
                            <CardHistory film={item} key={item._id || idx} onDelete={handleDeleteHistory} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default History;
