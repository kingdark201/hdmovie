import React, { useState, useEffect } from 'react';
import './style.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../utils/router';
import { loadNewFilmsRandom } from '../../utils/core';
import ListCard from '../ListCard';
// Thêm import cho commentServices
import { addComment, getCommentBySlug, deleteComment } from '../../services/commentServices';
import CommentItem from '../CommentItem';
import Message from '../Message';

function FilmInfo({ data }) {
    const navigate = useNavigate();
    const [selectedEpisode, setSelectedEpisode] = useState('');
    const [selectedEpisodeName, setSelectedEpisodeName] = useState('');
    const [selectedServer, setSelectedServer] = useState('');
    const [randomFilms, setRandomFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    // State cho comment
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentError, setCommentError] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteCommentId, setDeleteCommentId] = useState(null);

    const location = useLocation();
    const pathname = location.pathname;
    const slug = pathname.split('/').pop();

    // Load phim ngẫu nhiên
    useEffect(() => {
        loadNewFilmsRandom(setRandomFilms, setLoading);
    }, []);

    // Khôi phục trạng thái từ localStorage khi slug hoặc data thay đổi
    useEffect(() => {
        const savedFilmSlug = localStorage.getItem('currentFilmSlug');
        const savedEpisode = localStorage.getItem('selectedEpisode');
        const savedEpisodeName = localStorage.getItem('selectedEpisodeName');
        const savedServer = localStorage.getItem('selectedServer');

        if (savedFilmSlug === slug) {
            // Khôi phục trạng thái nếu slug khớp
            setSelectedEpisode(savedEpisode || '');
            setSelectedEpisodeName(savedEpisodeName || '');
            setSelectedServer(savedServer || '');
        } else {
            // Reset trạng thái nếu slug không khớp
            setSelectedEpisode('');
            setSelectedEpisodeName('');
            setSelectedServer('');
            // Lưu thông tin phim mới vào localStorage
            localStorage.setItem('currentFilmSlug', slug);

            //Xóa localStorage phim cũ
            localStorage.removeItem('selectedEpisode');
            localStorage.removeItem('selectedEpisodeName');
            localStorage.removeItem('selectedServer');
        }
    }, [slug]);

    // Cập nhật trạng thái và lưu vào localStorage khi click tập phim
    const handleEpisodeClick = (embedUrl, name, serverName) => {
        setSelectedEpisode(embedUrl);
        setSelectedEpisodeName(name);
        setSelectedServer(serverName);
        localStorage.setItem('selectedEpisode', embedUrl);
        localStorage.setItem('selectedEpisodeName', name);
        localStorage.setItem('selectedServer', serverName);
        localStorage.setItem('currentFilmSlug', slug);

        // Lưu lịch sử xem vào localStorage
        const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
        // Tính toán tiến độ %
        let progress = 0;
        if (data.total_episodes && !isNaN(Number(data.total_episodes)) && !isNaN(Number(name))) {
            progress = Math.round((Number(name) / Number(data.total_episodes)) * 100);
            if (progress > 100) progress = 100;
        } else {
            progress = 100;
        }
        const filmInfo = {
            slug: slug,
            title: data.name,
            thumb: data.thumb_url,
            episode: name, // Lưu số tập đã xem
            total_episodes: data.total_episodes,
            server: serverName,
            progress // Tiến độ %
        };
        // Xóa bản ghi cũ nếu đã có
        const newHistory = history.filter(item => item.slug !== slug);
        newHistory.unshift(filmInfo); // Thêm mới lên đầu
        localStorage.setItem('watchHistory', JSON.stringify(newHistory.slice(0, 30)));
    };

    const loadMoreFilms = (slug) => {
        navigate(`/${ROUTERS.USER.PHIMDM(slug)}`);
    };

    // Lấy user từ localStorage (nếu có)
    const user = JSON.parse(localStorage.getItem('authUser') || 'null');
    const token = localStorage.getItem('authToken');

    // Load comment khi slug thay đổi
    useEffect(() => {
        async function fetchComments() {
            setCommentLoading(true);
            setCommentError('');
            try {
                const res = await getCommentBySlug(slug);
                setComments(res.comments || []);
            } catch (e) {
                setCommentError('Không thể tải bình luận');
            }
            setCommentLoading(false);
        }
        if (slug) fetchComments();
    }, [slug]);

    // Thêm bình luận mới
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentInput.trim()) return;
        setCommentLoading(true);
        setCommentError('');
        try {
            const res = await addComment(
                {
                    comment: commentInput,
                    slug_film: slug
                },
                token
            );
            if (res && res.success !== false && !res.error && !res.message) {
                setCommentInput('');
                const reload = await getCommentBySlug(slug);
                setComments(reload.comments || []);
            } else {
                setCommentError('Đăng nhập để bình luận');
                setCommentInput('');
            }
        } catch (e) {
            setCommentError('Không thể gửi bình luận');
        }
        setCommentLoading(false);
    };

    // Xóa bình luận
    const handleDeleteComment = (commentId) => {
        setDeleteCommentId(commentId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteComment = async () => {
        setShowDeleteConfirm(false);
        if (!deleteCommentId) return;
        setCommentLoading(true);
        try {
            const res = await deleteComment(deleteCommentId, token);
            if (res && res.success !== false) {
                // Sau khi xóa thành công, reload lại danh sách comment từ server
                const reload = await getCommentBySlug(slug);
                setComments(reload.comments || []);
            } else {
                setCommentError(res.error || 'Không thể xóa bình luận');
            }
        } catch (e) {
            setCommentError('Không thể xóa bình luận');
        }
        setCommentLoading(false);
        setDeleteCommentId(null);
    };

    const cancelDeleteComment = () => {
        setShowDeleteConfirm(false);
        setDeleteCommentId(null);
    };

    if (!data.episodes) return <p className='text-white'>No episodes available.</p>;

    return (
        <>
            <div className="iframe_video">
                <iframe
                    src={selectedEpisode}
                    title="Film Video"
                    width="100%"
                    height="500px"
                    frameBorder="0"
                    allowFullScreen
                ></iframe>
                <h4 className="text-white mb-4 namefilm-episode">
                    {data.name} {selectedEpisodeName ? `- Tập ${selectedEpisodeName}` : ''}
                </h4>
            </div>
            <div className="danhsach_tap">
                {data.episodes.map((server, index) => (
                    <div key={index} className="server-section">
                        <h5 className="server-name">{server.server_name}</h5>
                        {server.items.map((episode) => (
                            <button
                                key={episode.name}
                                data-video={episode.embed}
                                className={
                                    selectedEpisodeName === episode.name && selectedServer === server.server_name
                                        ? 'active'
                                        : ''
                                }
                                onClick={() => handleEpisodeClick(episode.embed, episode.name, server.server_name)}
                            >
                                {episode.name}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
            <div className="film-info">
                <img src={data.thumb_url} alt={data.name} />
                <div className="infomation">
                    <h4>{data.name}</h4>
                    <p className="original_name_film">{data.original_name}</p>
                    <div className="details_info">
                        <p className="name_film">{data.name} - {data.original_name}</p>
                        <p className="status_film">Trạng thái: {data.current_episode} {data.language}</p>
                        <p className="time_film">Thời lượng: {data.time}</p>
                        <p className="quality_film">Chất lượng: {data.quality}</p>
                        <p className="director">Tác giả: {data.director}</p>
                        <p className="dienvien">Diễn viên: {data.casts}</p>
                    </div>
                </div>
                <div className="description">
                    <h4>Nội Dung Chi Tiết</h4>
                    <p>{data.description.replace('<p>', '').replace('</p>','')}</p>
                </div>
            </div>
            {/* PHẦN COMMENT */}
            <div className="film-comments">
                <h4>Bình luận</h4>
                <form onSubmit={handleAddComment} className="comment-form">
                    <input
                        type="text"
                        placeholder="Nhập bình luận..."
                        value={commentInput}
                        onChange={e => setCommentInput(e.target.value)}
                        disabled={commentLoading}
                        required
                    />
                    <button type="submit" disabled={commentLoading || !commentInput.trim()}>
                        Gửi
                    </button>
                </form>
                {/* Thông báo lỗi sử dụng Message */}
                {commentError && <Message type="error">{commentError}</Message>}
                {commentLoading && <div className="comment-loading">Đang xử lý...</div>}
                <div className="comment-list">
                    {comments && comments.length > 0 ? (
                        comments.map((c, idx) => (
                            <CommentItem
                                key={c._id || idx}
                                avatar={c.avatar || c.user?.avatar}
                                username={c.username || c.user?.username || 'unknown'}
                                time={c.createdAt ? c.createdAt : ''}
                                comment={c.comment}
                                onDelete={
                                    user && (user._id === c.user_id || user._id === c.user?.id || user._id === c.user?._id)
                                        ? () => handleDeleteComment(c.id)
                                        : undefined
                                }
                            />
                        ))
                    ) : (
                        <div className="comment-empty">Chưa có bình luận nào.</div>
                    )}
                </div>
                {/* Hiển thị xác nhận xóa bình luận */}
                {showDeleteConfirm && (
                    <Message
                        type="confirm"
                        onConfirm={confirmDeleteComment}
                        onCancel={cancelDeleteComment}
                    >
                        Bạn có chắc muốn xóa bình luận này?
                    </Message>
                )}
            </div>
            <div>
                {loading && <p className="text-center">Đang tải...</p>}
                <ListCard title={'Phim Gợi Ý'} data={randomFilms} onMore={() => loadMoreFilms('phim-dang-chieu')} />
            </div>
        </>
    );
}

export default FilmInfo;
