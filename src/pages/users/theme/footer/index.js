import React from 'react'
import './style.scss'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer className="footer animate__animated animate__slideInUp">
            <div className="footer-content">
                <div className="footer-section about">
                    <h3>Về chúng tôi</h3>
                    <p>Cung cấp rất nhiều bộ phim, giúp bạn thoải mái xem các bộ phim mới nhất. Giao diện thân thiện, dễ dàng sử dụng</p>
                </div>
                <div className="footer-section links">
                    <h3>Đường dẫn nhanh</h3>
                    <ul>
                        <li><Link>Trang chủ</Link></li>
                        <li><Link>Phim lẻ</Link></li>
                        <li><Link>Phim bộ</Link></li>
                        <li><Link>Liên hệ</Link></li>
                    </ul>
                </div>
                <div className="footer-section contact">
                    <h3>Liên hệ chúng tôi</h3>
                    <p>Email: duytnh201@gmail.com</p>
                    <p>Phone: 0964896483</p>
                </div>
            </div>
            <div className="footer-bottom">
                &copy; 2024 Hoang Duy | Thiết kế và chỉnh sửa
            </div>
        </footer>

    )
}

export default Footer
