import React, { useState, useEffect } from 'react';
import './style.scss';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../utils/router';
import { loadNewFilmsRandom } from '../../utils/core';
import ListCard from '../ListCard';

function FilmInfo({ data }) {
    const navigate = useNavigate();
    const [selectedEpisode, setSelectedEpisode] = useState('');
    const [selectedEpisodeName, setSelectedEpisodeName] = useState('');
    const [selectedServer, setSelectedServer] = useState('');
    const [randomFilms, setRandomFilms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNewFilmsRandom(setRandomFilms, setLoading);
    }, []);

    // Lấy trạng thái đã lưu từ localStorage
    useEffect(() => {
        const savedEpisode = localStorage.getItem('selectedEpisode');
        const savedEpisodeName = localStorage.getItem('selectedEpisodeName');
        const savedServer = localStorage.getItem('selectedServer');
        if (savedEpisode) setSelectedEpisode(savedEpisode);
        if (savedEpisodeName) setSelectedEpisodeName(savedEpisodeName);
        if (savedServer) setSelectedServer(savedServer);
    }, []);

    const handleEpisodeClick = (embedUrl, name, serverName) => {
        setSelectedEpisode(embedUrl);
        setSelectedEpisodeName(name);
        setSelectedServer(serverName);
        localStorage.setItem('selectedEpisode', embedUrl);
        localStorage.setItem('selectedEpisodeName', name);
        localStorage.setItem('selectedServer', serverName);
    };

    const loadMoreFilms = (slug) => {
        navigate(`/${ROUTERS.USER.PHIMDM(slug)}`);
    };

    if (!data.episodes) return <p>No episodes available.</p>;

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
                <h4 className="text-white mb-4">
                    {data.name} - Tập {selectedEpisodeName}
                </h4>
            </div>
            <div className="danhsach_tap">
                {data.episodes.map((server, index) => (
                    <div key={index} className="server-section">
                        <h5 className="text-white">{server.server_name}</h5>
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
                    <p>{data.description.replace('<p>', '').replace('</p>', '')}</p>
                </div>
            </div>
            <div>
                {loading && <p className="text-center">Đang tải...</p>}
                <ListCard title={'Phim Gợi Ý'} data={randomFilms} onMore={() => loadMoreFilms('phim-dang-chieu')} />
            </div>
        </>
    );
}

export default FilmInfo;
