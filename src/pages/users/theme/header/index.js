import React, { useState } from 'react';
import './style.scss';
import logo from '../../../../assets/video-production.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../../utils/router';
import { searchFilm } from '../../../../services/dataServices';
import CardSearch from '../../../../components/CardSearch';

function Header() {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [openSubMenus, setOpenSubMenus] = useState({});
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');  // Search query state
    const [searchResults, setSearchResults] = useState([]);

    const location = useLocation();
    const pathname = location.pathname;
    const slugcurrent = pathname.split('/').pop();

    const menuItems = [
        { title: 'Phim lẻ', path: ROUTERS.USER.PHIMDM('phim-le'), slug: 'phim-le' },
        { title: 'Phim bộ', path: ROUTERS.USER.PHIMDM('phim-bo'), slug: 'phim-bo' },
        { title: 'Phim đang chiếu', path: ROUTERS.USER.PHIMDM('phim-dang-chieu'), slug: 'phim-dang-chieu' },
        {
            title: 'Thể loại',
            path: '#',
            slug: 'the-loai',
            subMenu: [
                [
                    { title: 'Hành Động', path: ROUTERS.USER.PHIMDM('hanh-dong'), slugsub: 'hanh-dong' },
                    { title: 'Phiêu Lưu', path: ROUTERS.USER.PHIMDM('phieu-luu'), slugsub: 'phieu-luu' },
                    { title: 'Hoạt Hình', path: ROUTERS.USER.PHIMDM('hoat-hinh'), slugsub: 'hoat-hinh' },
                    { title: 'Hài', path: ROUTERS.USER.PHIMDM('hai'), slugsub: 'hai' },
                    { title: 'Hình Sự', path: ROUTERS.USER.PHIMDM('hinh-su'), slugsub: 'hinh-su' },
                ],
                [
                    { title: 'Tài Liệu', path: ROUTERS.USER.PHIMDM('tai-lieu'), slugsub: 'tai-lieu' },
                    { title: 'Chính Kịch', path: ROUTERS.USER.PHIMDM('chinh-kich'), slugsub: 'chinh-kich' },
                    { title: 'Gia Đình', path: ROUTERS.USER.PHIMDM('gia-dinh'), slugsub: 'gia-dinh' },
                    { title: 'Giả Tưởng', path: ROUTERS.USER.PHIMDM('gia-tuong'), slugsub: 'gia-tuong' },
                    { title: 'Lịch Sử', path: ROUTERS.USER.PHIMDM('lich-su'), slugsub: 'lich-su' },
                ],
                [
                    { title: 'Kinh Dị', path: ROUTERS.USER.PHIMDM('kinh-di'), slugsub: 'kinh-di' },
                    { title: 'Nhạc', path: ROUTERS.USER.PHIMDM('nhac'), slugsub: 'nhac' },
                    { title: 'Bí Ẩn', path: ROUTERS.USER.PHIMDM('bi-an'), slugsub: 'bi-an' },
                    { title: 'Lãng Mạn', path: ROUTERS.USER.PHIMDM('lang-man'), slugsub: 'lang-man' },
                    { title: 'Khoa Học Viễn Tưởng', path: ROUTERS.USER.PHIMDM('khoa-hoc-vien-tuong'), slugsub: 'khoa-hoc-vien-tuong' },
                ],
                [
                    { title: 'Gây Cấn', path: ROUTERS.USER.PHIMDM('gay-can'), slugsub: 'gay-can' },
                    { title: 'Chiến Tranh', path: ROUTERS.USER.PHIMDM('chien-tranh'), slugsub: 'chien-tranh' },
                    { title: 'Tâm Lý', path: ROUTERS.USER.PHIMDM('tam-ly'), slugsub: 'tam-ly' },
                    { title: 'Tình Cảm', path: ROUTERS.USER.PHIMDM('tinh-cam'), slugsub: 'tinh-cam' },
                    { title: 'Cổ Trang', path: ROUTERS.USER.PHIMDM('co-trang'), slugsub: 'co-trang' },
                ],
                [
                    { title: 'Miền Tây', path: ROUTERS.USER.PHIMDM('mien-tay'), slugsub: 'mien-tay' },
                    { title: 'Phim 18+', path: ROUTERS.USER.PHIMDM('phim-18'), slugsub: 'phim-18' },
                ]
            ]
        },
        { title: 'TV show', path: ROUTERS.USER.PHIMDM('tv-shows'), slug: 'tv-shows' }
    ];

    const toggleMenu = () => setMenuOpen(!isMenuOpen);

    const toggleSubMenu = (index) => {
        setOpenSubMenus((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const handleSearchInputChange = async (event) => {
        setSearchQuery(event.target.value);
        if (searchQuery !== '') {
            const results = await searchFilm(searchQuery);
            setSearchResults(results.items);
        }
    };

    // const navigateToFilm = (film) => {
    //     navigate(`/phim/${film.slug}`);
    //     setSearchQuery('');
    //     setSearchResults([]);
    // };

    const clickSearch = (slug) => {
        navigate(ROUTERS.USER.PHIM(slug));
        setSearchQuery('');
    }

    return (
        <div className='header'>
            <div className='header-logo' onClick={() => navigate('/')}>
                <img src={logo} alt='logo' />
                <span>HD<sup>movies</sup></span>
            </div>

            <div className='header-search'>
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="search-input"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                />
                <div className='search_result'>
                    {searchQuery && searchResults && searchResults.map((film,index) => (
                        <CardSearch key={index} data={film} onClickCardSearch={(slug)=>clickSearch(slug)}/>
                    ))}
                </div>
            </div>

            <div className='header-menu'>
                {menuItems.map((item, index) => (
                    <li key={index} onClick={() => !item.subMenu && navigate(item.path)} className={slugcurrent === item.slug ? 'active' : ''}>
                        <span>{item.title}</span>
                        {item.subMenu && (
                            <>
                                <i className="bi bi-chevron-compact-down" onClick={() => toggleSubMenu(index)}></i>
                                {openSubMenus[index] && (
                                    <ul className='submenu'>
                                        {item.subMenu.map((column, colIndex) => (
                                            <div className='sub' key={colIndex}>
                                                {column.map((subItem, subIndex) => (
                                                    <li key={subIndex} onClick={() => navigate(subItem.path)} className={slugcurrent === item.slugsub ? 'active_sub' : ''}>
                                                        {subItem.title}
                                                    </li>
                                                ))}
                                            </div>
                                        ))}
                                    </ul>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </div>

            <button className='menu-toggle' onClick={toggleMenu}>☰</button>

            {isMenuOpen && (
                <div className='header-menu-small'>
                    <button className='btnX' onClick={toggleMenu}><i className="bi bi-x"></i></button>
                    {menuItems.map((item, index) => (
                        <li key={index} onClick={() => !item.subMenu && navigate(item.path)} className={slugcurrent === item.slug ? 'active' : ''}>
                            <span>{item.title}</span>
                            {item.subMenu && (
                                <>
                                    <i className="bi bi-chevron-compact-down" onClick={() => toggleSubMenu(index)}></i>
                                    {openSubMenus[index] && (
                                        <ul className='submenu-small'>
                                            {item.subMenu.map((column, colIndex) => (
                                                <div className='sub' key={colIndex}>
                                                    {column.map((subItem, subIndex) => (
                                                        <li key={subIndex} onClick={() => navigate(subItem.path)} className={slugcurrent === item.slugsub ? 'active_sub' : ''}>
                                                            {subItem.title}
                                                        </li>
                                                    ))}
                                                </div>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            )}
                        </li>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Header;
