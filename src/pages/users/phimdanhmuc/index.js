import React, { useEffect, useState } from 'react';
import './style.scss';
import ListCard from '../../../components/ListCard';
import { useLocation } from 'react-router-dom';
import { loadFilmsCategoryWithPagination } from '../../../utils/core';

function PhimDanhuc() {
    const [films, setFilms] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const location = useLocation();
    const pathname = location.pathname;
    const slug = pathname.split('/').pop();

    useEffect(() => {
        setFilms([]);
        setPage(1);
        setHasMore(true);
    }, [slug]);

    useEffect(() => {
        if (hasMore) {
            loadFilmsCategoryWithPagination(page, slug, setFilms, setHasMore);
        }
    }, [page, slug, hasMore]);

    const loadMoreFilms = () => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <div className='phim-danh-muc'>
            <div className='list'>
                <ListCard
                    title={slug.toUpperCase().replaceAll('-', ' ')}
                    data={films}
                    onMore={loadMoreFilms}
                    status={1}
                    hasMore={hasMore}
                />
            </div>
        </div>
    );
}

export default PhimDanhuc;
