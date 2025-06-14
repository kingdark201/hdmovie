import React, { useState } from 'react';
import './style.scss';
import logo from '../../../../assets/video-production.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../../utils/router';
import { searchFilm } from '../../../../services/dataServices';
import CardSearch from '../../../../components/CardSearch';
import Setting from '../../setting';
import { useSelector } from 'react-redux';

function Header() {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [openSubMenus, setOpenSubMenus] = useState({});
    const [showSetting, setShowSetting] = useState(false);
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const location = useLocation();
    const pathname = location.pathname;
    const slugcurrent = pathname.split('/').pop();
    const { token, user: currentUser } = useSelector((state) => state.auth);

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
        { title: 'Cài đặt', onClick: () => setShowSetting(true), slug: 'setting' } ,
        {title: token && currentUser ? currentUser.username : 'Tài khoản', path: '/admin/users', slug: 'account'},
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

    const clickSearch = (slug) => {
        navigate(ROUTERS.USER.PHIM(slug));
        setSearchQuery('');
    }

    const clickSubmenu = (path) => {
        navigate(path);
        setOpenSubMenus(false);
    }

    const clickMenuSmall = (path) => {
        navigate(path);
        setMenuOpen(false);
    }

    const clickSubmenuSmall = (path) => {
        navigate(path);
        setOpenSubMenus(false);
        setMenuOpen(false);
    }

    const handleSettingSmall = () => {
        setMenuOpen(false);
        setShowSetting(true);
    };

    return (
        <div className='header animate__animated animate__slideInDown'>
            <div className='header-logo animate__animated animate__backInLeft' onClick={() => navigate('/')}>
                <img src={logo} alt='logo' />
                <span className='logo-name'>HD<sup>movies</sup></span>
            </div>

            <div className='header-search animate__animated animate__bounceIn'>
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="search-input"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                />
                <div className='search_result'>
                    {searchQuery && searchResults && searchResults.map((film, index) => (
                        <CardSearch key={index} data={film} onClickCardSearch={(slug) => clickSearch(slug)} />
                    ))}
                </div>
            </div>

            <div className="header-icons animate__animated animate__fadeInDown">
                <i className="bi bi-person" title="Tài khoản" onClick={()=>navigate('/admin/users')}></i>
                <i className="bi bi-gear" title="Cài đặt" onClick={handleSettingSmall}></i>
            </div>

            <div className='header-menu animate__animated animate__fadeInDown'>
                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        onClick={item.onClick ? item.onClick : () => !item.subMenu && navigate(item.path)}
                        className={slugcurrent === item.slug ? 'active' : ''}
                    >
                        <span>
                            {/* Nếu là Tài khoản thì đã có icon, các mục khác giữ nguyên */}
                            {item.slug === 'account' ? item.title : item.title}
                        </span>
                        {item.subMenu && (
                            <>
                                <i className="bi bi-chevron-compact-down" onClick={() => toggleSubMenu(index)}></i>
                                {openSubMenus[index] && (
                                    <ul className='submenu'>
                                        {item.subMenu.map((column, colIndex) => (
                                            <div className='sub' key={colIndex}>
                                                {column.map((subItem, subIndex) => (
                                                    <li key={subIndex} onClick={() => clickSubmenu(subItem.path)} className={slugcurrent === item.slugsub ? 'active_sub' : ''}>
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
                <div className='header-menu-small animate__animated animate__fadeInDown'>
                    <button className='btnX' onClick={toggleMenu}><i className="bi bi-x"></i></button>
                    {/* Xóa 2 icon ở đây, chỉ giữ lại menu nhỏ */}
                    {menuItems.map((item, index) => (
                        <li
                            key={index}
                            onClick={
                                item.title === 'Cài đặt'
                                    ? handleSettingSmall
                                    : () => !item.subMenu && clickMenuSmall(item.path)
                            }
                            className={slugcurrent === item.slug ? 'active' : ''}
                        >
                            <span>
                                {/* Nếu là Tài khoản thì đã có icon, các mục khác giữ nguyên */}
                                {item.slug === 'account' ? item.title : item.title}
                            </span>
                            {item.subMenu && (
                                <>
                                    <i className="bi bi-chevron-compact-down" onClick={() => toggleSubMenu(index)}></i>
                                    {openSubMenus[index] && (
                                        <ul className='submenu-small'>
                                            {item.subMenu.map((column, colIndex) => (
                                                <div className='sub' key={colIndex}>
                                                    {column.map((subItem, subIndex) => (
                                                        <li key={subIndex} onClick={() => clickSubmenuSmall(subItem.path)} className={slugcurrent === item.slugsub ? 'active_sub' : ''}>
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

            {showSetting && (
                <div className='setting-overlay' onClick={() => setShowSetting(false)}>
                    <div className='setting-slide' onClick={e => e.stopPropagation()}>
                        <button className='close-setting' onClick={() => setShowSetting(false)}>&times;</button>
                        <Setting />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Header;
