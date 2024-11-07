import { getFilm, getFilmCategory, newFilms } from "../services/dataServices";

const loadNewFilms = async (page, setData) => {
    try {
        const data = await newFilms(page);
        if (data && data.items && data.items.length > 0) {
            const limitedFilms = data.items.slice(0, 10);
            setData((prevFilms) => [...prevFilms, ...limitedFilms]);
        }
    } catch (error) {
        console.error('Error fetching films:', error);
    }
};

const loadFilms = async (slug, setData) => {
    try {
        const data = await getFilm(slug);
        setData(data.movie);
    } catch (error) {
        console.error('Error fetching films:', error);
    }
};


const loadNewFilmsRandom = async (setData,setLoading) => {
    setLoading(true);
    try {
        const totalPage = 2810;
        const randomPages = Array.from({ length: 3 }, () => Math.floor(Math.random() * totalPage) + 1);
        let allFilms = [];
        for (const page of randomPages) {
            const data = await newFilms(page);
            if (data && data.items) {
                allFilms = allFilms.concat(data.items);
            }
        }

        const randomFilms = allFilms.sort(() => 0.5 - Math.random()).slice(0, 20);
        setData(randomFilms);
    } catch (error) {
        console.error('Error fetching films:', error);
    } finally {
        setLoading(false);
    }
};

const loadFilmsCategory = async (page, slug, setData) => {
    try {
        const data = await getFilmCategory(slug, page);
        if (data && data.items && data.items.length > 0) {
            setData((prevFilms) => [...prevFilms, ...data.items]);
        }
    } catch (error) {
        console.error('Error fetching films:', error);
    }
};

const loadFilmsCategoryWithPagination = async (currentPage, slug, setData, setHasMore) => {
    try {
        const data = await getFilmCategory(slug, currentPage);

        if (data && data.items && data.items.length > 0) {
            setData((prevFilms) => [...prevFilms, ...data.items]);

            if (data.items.length < 10) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
        } else {
            setHasMore(false);
        }
    } catch (error) {
        console.error('Error fetching films:', error);
    }
};


export { loadNewFilms, loadFilms, loadNewFilmsRandom, loadFilmsCategory, loadFilmsCategoryWithPagination };
