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
import { upsertHistory, getHistory } from '../../services/filmHistoryServices';
import { useSelector } from 'react-redux';

function FilmInfo({ data }) {
    const navigate = useNavigate();

    const [selectedEpisode, setSelectedEpisode] = useState(() => localStorage.getItem('selectedEpisode') || '');
    const [selectedEpisodeName, setSelectedEpisodeName] = useState(() => localStorage.getItem('selectedEpisodeName') || '');
    const [selectedServer, setSelectedServer] = useState(() => localStorage.getItem('selectedServer') || '');
    const [randomFilms, setRandomFilms] = useState([]);
    const [loading, setLoading] = useState(true);

    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [commentError, setCommentError] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteCommentId, setDeleteCommentId] = useState(null);
    const [historyLoaded, setHistoryLoaded] = useState(false);

    const location = useLocation();
    const pathname = location.pathname;
    const slug = pathname.split('/').pop();

    const { token, user: currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        loadNewFilmsRandom(setRandomFilms, setLoading);
    }, []);

    useEffect(() => {
        const savedFilmSlug = localStorage.getItem('currentFilmSlug');
        const savedEpisode = localStorage.getItem('selectedEpisode');
        const savedEpisodeName = localStorage.getItem('selectedEpisodeName');
        const savedServer = localStorage.getItem('selectedServer');

        if (savedFilmSlug === slug) {
            setSelectedEpisode(savedEpisode || '');
            setSelectedEpisodeName(savedEpisodeName || '');
            setSelectedServer(savedServer || '');
        } else {
            setSelectedEpisode('');
            setSelectedEpisodeName('');
            setSelectedServer('');
            localStorage.setItem('currentFilmSlug', slug);

            localStorage.removeItem('selectedEpisode');
            localStorage.removeItem('selectedEpisodeName');
            localStorage.removeItem('selectedServer');
        }
        setHistoryLoaded(false);
    }, [slug]);


    useEffect(() => {
        async function checkFilmHistory() {
            if (!currentUser || !token || !slug || historyLoaded) return;
            try {
                const res = await getHistory(token);

                if (res && res.status === 'success' && Array.isArray(res.data)) {
                    const filmHis = res.data.find(item => item.slug === slug && (!currentUser.id || item.user_id === currentUser.id || item.user_id === currentUser._id));
                    if (filmHis && filmHis.episode) {
                        setSelectedEpisode(filmHis.embeb);
                        setSelectedEpisodeName(filmHis.episode);
                        setSelectedServer(filmHis.server);
                        localStorage.setItem('selectedEpisode', filmHis.embeb);
                        localStorage.setItem('selectedEpisodeName', filmHis.episode);
                        localStorage.setItem('selectedServer', filmHis.server);
                    }
                }
            } catch (e) {
                console.error('Error fetching film history:', e);
            }
            setHistoryLoaded(true);
        }
        if (data && data.episodes && !historyLoaded) {
            checkFilmHistory();
        }
    }, [data, slug, currentUser, token, historyLoaded]);

    const handleEpisodeClick = async (embedUrl, name, serverName) => {
        setSelectedEpisode(embedUrl);
        setSelectedEpisodeName(name);
        setSelectedServer(serverName);
        localStorage.setItem('selectedEpisode', embedUrl);
        localStorage.setItem('selectedEpisodeName', name);
        localStorage.setItem('selectedServer', serverName);
        localStorage.setItem('currentFilmSlug', slug);

        let progress = 0;
        if (data.total_episodes && !isNaN(Number(data.total_episodes)) && !isNaN(Number(name))) {
            progress = Math.round((Number(name) / Number(data.total_episodes)) * 100);
            if (progress > 100) progress = 100;
        } else {
            progress = 100;
        }

        const filmInfo = {
            user_id: currentUser ? currentUser.id : null,
            title: data.name,
            thumb: data.thumb_url,
            episode: name,
            total_episodes: data.total_episodes,
            server: serverName,
            progress,
            slug,
            embeb: embedUrl,
        };

        if (currentUser && currentUser.id && token) {
            try {
                await upsertHistory(filmInfo, token);
            } catch (e) {
                console.error('Error saving film history:', e);
            }
        }
    };

    const loadMoreFilms = (slug) => {
        navigate(`/${ROUTERS.USER.PHIMDM(slug)}`);
    };

    const loadComments = async () => {
        setCommentLoading(true);
        setCommentError('');
        try {
            const res = await getCommentBySlug(slug);
            if (res && res.status === 'success') {
                setComments(res.data);
            } else {
                setComments([]);
            }
        } catch (e) {
            console.log('Error loading comments:', e);
        }
        setCommentLoading(false);
    }

    useEffect(() => {
        if (slug) loadComments();
    }, [slug]);

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
            if (res && res.status === 'success') {
                setCommentInput('');
                loadComments();
            } else {
                setCommentError(res.message || 'Không thể gửi bình luận');
                setCommentInput('');
            }
        } catch (e) {
            console.log('error', e);
        }
        setCommentLoading(false);
    };

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
            if (res && res.status === 'success') {
                loadComments();
            } else {
                setCommentError(res.message || 'Không thể xóa bình luận');
            }
        } catch (e) {
            console.error('Error deleting comment:', e);
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
                                    String(selectedEpisodeName) === episode.name &&
                                        String(selectedServer) === server.server_name &&
                                        String(selectedEpisode) === episode.embed
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
                    <p>{data.description.replace('<p>', '').replace('</p>', '')}</p>
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
                {commentLoading && <center><div className="comment-loading">Đang tải bình luận...</div></center>}
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
                                    currentUser && (currentUser._id === c.user_id || currentUser._id === c.currentUser?.id || currentUser._id === c.currentUser?._id)
                                        ? () => handleDeleteComment(c.id)
                                        : undefined
                                }
                            />
                        ))
                    ) : (
                        !commentLoading && <div className="comment-empty">Chưa có bình luận nào.</div>
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
