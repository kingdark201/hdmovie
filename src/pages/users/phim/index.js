import React, { useEffect, useState } from 'react'
import './style.scss'
import FilmInfo from '../../../components/FilmInfo'
import { loadFilms } from '../../../utils/core';
import { useLocation } from 'react-router-dom';

function Phim() {
    const [films, setFilms] = useState([]);
    const location = useLocation();
    const pathname = location.pathname;
    const slug = pathname.split('/').pop();

    useEffect(() => {
        loadFilms(slug, setFilms);
    }, [slug]);

    return (
        <div className='phim'>
            <div className='phim-card'>
                {films && <FilmInfo data={films} />}
            </div>
        </div>
    )
}

export default Phim
