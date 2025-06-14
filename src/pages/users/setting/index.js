import React, { useEffect, useState } from 'react';
import './style.scss';
import { useNavigate } from 'react-router-dom';

const defaultSettings = {
    headerColor: '#0d0731f3',
    headerTextColor: '#fff', // màu chữ header
    bodyColor: 'rgb(5, 1, 22)',
    bodyTextColor: '#fff', // màu chữ body
    footerColor: '#0d0731f3',
    footerTextColor: '#fff', // màu chữ footer
    buttonColor: 'white',
    buttonTextColor: '#000', // màu chữ button
    filmInfoColor: '#060125f3',
    filmInfoTextColor: '#fff', // màu chữ film-info
    fontFamily: 'Arial, sans-serif',
    headerSearchColor: '#05042c',
    headerItemSearchColor: '#18123a',
    descriptionColor: '#0a093b', // thêm trường mới
};

function Setting() {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('siteSettings');
        return saved ? JSON.parse(saved) : defaultSettings;
    });
    const navigate = useNavigate();


    useEffect(() => {
        document.documentElement.style.setProperty('--header-color', settings.headerColor);
        document.documentElement.style.setProperty('--header-text-color', settings.headerTextColor);
        document.documentElement.style.setProperty('--body-color', settings.bodyColor);
        document.documentElement.style.setProperty('--body-text-color', settings.bodyTextColor);
        document.documentElement.style.setProperty('--footer-color', settings.footerColor);
        document.documentElement.style.setProperty('--footer-text-color', settings.footerTextColor);
        document.documentElement.style.setProperty('--button-color', settings.buttonColor);
        document.documentElement.style.setProperty('--button-text-color', settings.buttonTextColor);
        document.documentElement.style.setProperty('--film-info-color', settings.filmInfoColor);
        document.documentElement.style.setProperty('--film-info-text-color', settings.filmInfoTextColor);
        document.documentElement.style.setProperty('--main-font', settings.fontFamily);
        document.documentElement.style.setProperty('--header-search-color', settings.headerSearchColor);
        document.documentElement.style.setProperty('--header-item-search-color', settings.headerItemSearchColor);
        document.documentElement.style.setProperty('--description-color', settings.descriptionColor); // set biến mới
        localStorage.setItem('siteSettings', JSON.stringify(settings));
    }, [settings]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings((prev) => ({ ...prev, [name]: value }));
    };

    const handleFontChange = (e) => {
        setSettings((prev) => ({ ...prev, fontFamily: e.target.value }));
    };

    const handleReset = () => {
        setSettings(defaultSettings);
        localStorage.removeItem('siteSettings');
    };

    return (
        <div className="setting-page animate__animated animate__slideInRight">
            <h2>Cài đặt giao diện</h2>
            <div className="setting-group animate__animated animate__fadeIn">
                <label>Màu Header: <input type="color" name="headerColor" value={settings.headerColor} onChange={handleChange} /></label>
                <label>Màu chữ Header: <input type="color" name="headerTextColor" value={settings.headerTextColor} onChange={handleChange} /></label>
                <label>Màu Body: <input type="color" name="bodyColor" value={settings.bodyColor} onChange={handleChange} /></label>
                <label>Màu chữ Body: <input type="color" name="bodyTextColor" value={settings.bodyTextColor} onChange={handleChange} /></label>
                <label>Màu Footer: <input type="color" name="footerColor" value={settings.footerColor} onChange={handleChange} /></label>
                <label>Màu chữ Footer: <input type="color" name="footerTextColor" value={settings.footerTextColor} onChange={handleChange} /></label>
                <label>Màu Button tập: <input type="color" name="buttonColor" value={settings.buttonColor} onChange={handleChange} /></label>
                <label>Màu chữ Button: <input type="color" name="buttonTextColor" value={settings.buttonTextColor} onChange={handleChange} /></label>
                <label>Màu card: <input type="color" name="filmInfoColor" value={settings.filmInfoColor} onChange={handleChange} /></label>
                <label>Màu chữ card: <input type="color" name="filmInfoTextColor" value={settings.filmInfoTextColor} onChange={handleChange} /></label>
                <label>Màu Card popup: <input type="color" name="headerSearchColor" value={settings.headerSearchColor} onChange={handleChange} /></label>
                <label>Màu Itemsearch: <input type="color" name="headerItemSearchColor" value={settings.headerItemSearchColor} onChange={handleChange} /></label>
                <label>Màu Desc: <input type="color" name="descriptionColor" value={settings.descriptionColor} onChange={handleChange} /></label>
                <label>Font:
                    <select name="fontFamily" value={settings.fontFamily} onChange={handleFontChange}>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="Tahoma, Geneva, sans-serif">Tahoma</option>
                        <option value="Times New Roman, Times, serif">Times New Roman</option>
                        <option value="Courier New, Courier, monospace">Courier New</option>
                        <option value="Roboto, sans-serif">Roboto</option>
                        <option value="'Segoe UI', Arial, sans-serif">Segoe UI</option>
                        <option value="'Open Sans', Arial, sans-serif">Open Sans</option>
                        <option value="'Noto Sans', Arial, sans-serif">Noto Sans</option>
                        <option value="'Quicksand', Arial, sans-serif">Quicksand</option>
                        <option value="'Montserrat', Arial, sans-serif">Montserrat</option>
                        <option value="'Source Sans Pro', Arial, sans-serif">Source Sans Pro</option>
                        <option value="'Lato', Arial, sans-serif">Lato</option>
                        <option value="'Be Vietnam Pro', Arial, sans-serif">Be Vietnam Pro</option>
                        <option value="'Nunito', Arial, sans-serif">Nunito</option>
                        <option value="'Merriweather', serif">Merriweather</option>
                        <option value="'IBM Plex Sans', Arial, sans-serif">IBM Plex Sans</option>
                        <option value="'Fira Sans', Arial, sans-serif">Fira Sans</option>
                        <option value="'Inter', Arial, sans-serif">Inter</option>
                        <option value="'Poppins', Arial, sans-serif">Poppins</option>
                        <option value="'SF Pro Display', Arial, sans-serif">SF Pro Display</option>
                    </select>
                </label>
            </div>
            <button className="btn-reset-setting" onClick={handleReset}>
                Đặt lại mặc định
            </button>
        </div>
    );
}

export default Setting;
