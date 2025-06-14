import React from 'react';
import './style.scss';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../utils/router';

function CardFilm({ film, favorite = '', onDelete }) {
    const navigate = useNavigate();

    const {
        current_episode,
        total_episodes,
        title,
        name,
        original_name,
        origin_title,
        thumb_url,
        thumb,
        slug
    } = film;

    const filmName = favorite ? title : name;
    const filmOriginalName = favorite ? original_name : origin_title;

    const handleClick = () => {
        navigate(`/${ROUTERS.USER.PHIM(slug)}`);
    }

    const handleDelete = (e) => {
        e.stopPropagation();
        if (onDelete) onDelete(slug);
    }

    return (
        <div className='card-film animate__animated animate__zoomIn' onClick={handleClick}>
            <div className='card-film-header'>
                <div className='episodes_language'>
                    {`${current_episode || 0}/${total_episodes || '?'}`}
                </div>
                <div className="card-film-header-right">
                    {favorite && favorite !== '' && (
                        <i
                            className="bi bi-trash"
                            onClick={handleDelete}
                            title="Xóa khỏi yêu thích"
                        ></i>
                    )}
                </div>
            </div>
            <img
                src={
                    thumb && thumb.trim() !== ''
                        ? thumb
                        : thumb_url && typeof thumb_url === 'string' && thumb_url.trim() !== ''
                            ? thumb_url
                            : 'https://phim.nguonc.com/public/images/Film/r5Ufh0if9pSYT5fMWspPI7joSO0.jpg'
                }
                alt={name || title || 'Film Poster'}
            />
            <div className='info_film'>
                <div className='film_name_v'>{name || title || 'Unknown Title'}</div>
                <div className='film_name_e'>{original_name || origin_title || 'unknown'}</div>
            </div>
        </div>
    );
}

export default CardFilm;
