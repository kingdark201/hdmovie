import React from 'react'
import './style.scss'

function CardSearch({ data, onClickCardSearch }) {
    const { name, original_name, poster_url, slug } = data;

    return (
        <div className='card-search' onClick={()=>onClickCardSearch(slug)}>
            <img
                src={
                    !poster_url ||
                        (typeof poster_url === 'object' && Object.keys(poster_url).length === 0) ||
                        (typeof poster_url === 'string' && poster_url.trim() === '')
                        ? 'https://phim.nguonc.com/public/images/Film/r5Ufh0if9pSYT5fMWspPI7joSO0.jpg'
                        : poster_url
                }
                alt={name || 'Film Poster'}
            />
            <div className='info-search'>
                <p className='name_v'>{name || 'Unknown'}</p>
                <p className='name_e'>{original_name || 'Unknown'}</p>
            </div>
        </div>
    )
}

export default CardSearch
