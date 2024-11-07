import React from 'react'
import CardFilm from '../CardFilm'
import './style.scss'

function ListCard({ title, data, onMore, status = 0, hashmore = true }) {
    return (
        <>
            <h4 className={status ===0 ? 'title_listcard' : 'title_category'}>{title}</h4>
            <div className='list-card'>
                {data.map((film, index) => (
                    <CardFilm key={index} film={film} />
                ))}
            </div>
            {status === 0 ? (
                <button onClick={(slug) => onMore(slug)} className='load-more'>
                    <i className="bi bi-arrow-down-circle"></i>
                </button>
            ) : status !== 0 && hashmore && (
                <button onClick={() => onMore()} className='load-more'>
                    <i className="bi bi-arrow-down-circle"></i>
                </button>
            )}
        </>
    )
}

export default ListCard
