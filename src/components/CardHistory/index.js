import React from 'react';
import './style.scss';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../utils/router';

function CardHistory({ film }) {
    const navigate = useNavigate();
    const { episode, total_episodes, progress, title, thumb, slug } = film;

    const handleClick = () => {
        navigate(`/${ROUTERS.USER.PHIM(slug)}`);
    }

    return (
        <div className='card-film' onClick={handleClick}>
            <div className='episodes_language'>
                {`Tiến độ: ${progress || '0'}%`}
            </div>
            <img
                src={
                    !thumb ||
                        (typeof thumb === 'object' && Object.keys(thumb).length === 0) ||
                        (typeof thumb === 'string' && thumb.trim() === '')
                        ? 'https://phim.nguonc.com/public/images/Film/r5Ufh0if9pSYT5fMWspPI7joSO0.jpg'
                        : thumb
                }
                alt={title || 'Film Poster'}
            />
            <div className='info_film'>
                <div className='film_name_v'>{title || 'Unknown Title'}</div>
                <div className='film_name_e'>Đã xem: {episode || 'unknown'}/ {total_episodes || '?'}</div>
            </div>
        </div>
    );
}

export default CardHistory;
