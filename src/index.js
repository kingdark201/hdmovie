import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import RouterCustom from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min";
import './globalStyle.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <RouterCustom />
    </BrowserRouter>
);

// Khởi tạo biến CSS từ localStorage khi app khởi động
const saved = localStorage.getItem('siteSettings');
if (saved) {
    try {
        const settings = JSON.parse(saved);
        if (settings.headerColor) document.documentElement.style.setProperty('--header-color', settings.headerColor);
        if (settings.headerTextColor) document.documentElement.style.setProperty('--header-text-color', settings.headerTextColor);
        if (settings.bodyColor) document.documentElement.style.setProperty('--body-color', settings.bodyColor);
        if (settings.bodyTextColor) document.documentElement.style.setProperty('--body-text-color', settings.bodyTextColor);
        if (settings.footerColor) document.documentElement.style.setProperty('--footer-color', settings.footerColor);
        if (settings.footerTextColor) document.documentElement.style.setProperty('--footer-text-color', settings.footerTextColor);
        if (settings.buttonColor) document.documentElement.style.setProperty('--button-color', settings.buttonColor);
        if (settings.buttonTextColor) document.documentElement.style.setProperty('--button-text-color', settings.buttonTextColor);
        if (settings.filmInfoColor) document.documentElement.style.setProperty('--film-info-color', settings.filmInfoColor);
        if (settings.filmInfoTextColor) document.documentElement.style.setProperty('--film-info-text-color', settings.filmInfoTextColor);
        if (settings.fontFamily) document.documentElement.style.setProperty('--main-font', settings.fontFamily);
        if (settings.headerSearchColor) document.documentElement.style.setProperty('--header-search-color', settings.headerSearchColor);
        if (settings.headerItemSearchColor) document.documentElement.style.setProperty('--header-item-search-color', settings.headerItemSearchColor);
        if (settings.descriptionColor) document.documentElement.style.setProperty('--description-color', settings.descriptionColor);
    } catch (e) { }
}
