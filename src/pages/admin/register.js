import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../../services/authServices';
import './register.scss';
import Message from '../../components/Message';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [enterpassword, setEnterpassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showEnterPassword, setShowEnterPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (password !== enterpassword) {
            setError('Mật khẩu nhập lại không khớp');
            return;
        }
        const res = await addUser({ username, password });
        
        if (res && res.status === 'success') {
            setSuccess(res.message || 'Đăng ký thành công');
            setTimeout(() => navigate('/login'), 1200);
        } else {
            setError(res.message || 'Đăng ký thất bại');
        }
    };

    return (
        <div className="login-container animate__animated animate__slideInDown">
            <form onSubmit={handleSubmit}>
                <h2>Đăng ký</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => {
                        setUsername(e.target.value);
                        setError(''); // Reset error khi thay đổi username
                    }}
                    required
                />
                <div className="input-password-group">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={e => {
                            setPassword(e.target.value);
                            setError(''); // Reset error khi thay đổi password
                            setSuccess('');
                        }}
                        required
                    />
                    <span
                        className="toggle-password"
                        onClick={() => setShowPassword(v => !v)}
                        tabIndex={0}
                        role="button"
                        aria-label="Hiện/ẩn mật khẩu"
                    >
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </span>
                </div>
                <div className="input-password-group">
                    <input
                        type={showEnterPassword ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu"
                        value={enterpassword}
                        onChange={e => {
                            setEnterpassword(e.target.value);
                            setError(''); 
                        }}
                        required
                    />
                    <span
                        className="toggle-password"
                        onClick={() => setShowEnterPassword(v => !v)}
                        tabIndex={0}
                        role="button"
                        aria-label="Hiện/ẩn mật khẩu"
                    >
                        <i className={`bi ${showEnterPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </span>
                </div>
                <button type="submit">Đăng ký</button>
                <p className='text-center'>
                    Đã có tài khoản?
                    <span className='text-primary' onClick={() => navigate('/login')}>Đăng nhập.</span>
                </p>
                {error && <Message type="error">{error}</Message>}
                {success && <Message type="success">{success}</Message>}
            </form>
        </div>
    );
};

export default Register;
