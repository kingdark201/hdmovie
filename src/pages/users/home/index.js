import React, { useEffect, useState } from 'react';
import './style.scss';
import { loadFilmsCategory, loadNewFilms, loadNewFilmsRandom } from '../../../utils/core';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../utils/router';
import Slider from '../../../components/Slider';
import ListCard from '../../../components/ListCard';
import { useSelector } from 'react-redux';

function HomePage() {
    const [films, setFilms] = useState([]);
    const [filmLe, setFilmLe] = useState([]);
    const [filmBo, setFilmBo] = useState([]);
    const [tvShow, setTvShow] = useState([]);
    const [randomFilms, setRandomFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { token, user: currentUser } = useSelector((state) => state.auth);
    const { exp } = jwtDecode(token);
    const expirationTime = exp * 1000 - Date.now();

    setTimeout(() => {
        logout();
    }, expirationTime);

    function logout() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        navigate(ROUTERS.ADMIN.LOGIN);
        console.log("logouted");
        
    }

    useEffect(() => {
        loadNewFilmsRandom(setRandomFilms, setLoading);
        loadNewFilms(1, setFilms);
        loadFilmsCategory(1, 'phim-le', setFilmLe);
        loadFilmsCategory(1, 'phim-bo', setFilmBo);
        loadFilmsCategory(1, 'tv-shows', setTvShow);
    }, []);

    const loadMoreFilms = (slug) => {
        navigate(ROUTERS.USER.PHIMDM(slug));
    };

    return (
        <div className='home-page'>
            <div className='list'>
                <Slider title={'Gợi Ý Phim'} data={randomFilms} loading={loading} />
                <ListCard title={'Phim Mới Nhất'} data={films} onMore={() => loadMoreFilms('phim-dang-chieu')} />
                <ListCard title={'Phim Lẻ'} data={filmLe} onMore={() => loadMoreFilms('phim-le')} />
                <ListCard title={'Phim bộ'} data={filmBo} onMore={() => loadMoreFilms('phim-bo')} />
                <ListCard title={'TV Show'} data={tvShow} onMore={() => loadMoreFilms('tv-shows')} />
            </div>
        </div>
    );
}

export default HomePage;
