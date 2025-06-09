import React from 'react';
import './style.scss';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../utils/router';

function CardFilm({ film }) {
    const navigate = useNavigate();

    const { current_episode, 
            total_episodes, 
            name, 
            original_name, 
            thumb_url, 
            slug } = film;

    const handleClick = () => {
        navigate(`/${ROUTERS.USER.PHIM(slug)}`);
    }

    return (
        <div className='card-film' onClick={handleClick}>
            <div className='episodes_language'>
                {`${current_episode || 0}/${total_episodes || '?'}`}
            </div>
            <img
                src={
                    !thumb_url ||
                        (typeof thumb_url === 'object' && Object.keys(thumb_url).length === 0) ||
                        (typeof thumb_url === 'string' && thumb_url.trim() === '')
                        ? 'https://phim.nguonc.com/public/images/Film/r5Ufh0if9pSYT5fMWspPI7joSO0.jpg'
                        : thumb_url
                }
                alt={name || 'Film Poster'}
            />
            <div className='info_film'>
                <div className='film_name_v'>{name || 'Unknown Title'}</div>
                <div className='film_name_e'>{original_name || 'unknown'}</div>
            </div>
        </div>
    );
}

export default CardFilm;
