import React from 'react'
import './style.scss'

function CardSearch({ data, onClickCardSearch }) {
    const { name, original_name, poster_url, slug } = data;

    return (
        <div className='card-search' onClick={()=>onClickCardSearch(slug)}>
            <img src={poster_url || "https://phim.nguonc.com/public/images/Film/4avmIRBBOs9b4DKoenf8SWWJJP7.jpg"} alt={name||'anh'}/>
            <div className='info-search'>
                <p className='name_v'>{name || 'Unknown'}</p>
                <p className='name_e'>{original_name || 'Unknown'}</p>
            </div>
        </div>
    )
}

export default CardSearch
