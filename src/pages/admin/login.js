import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../authSlice';
import './login.scss';
import { useNavigate } from 'react-router-dom';
import Message from '../../components/Message';

const Login = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { error, isAuthenticated } = useSelector((state) => state.auth);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
     const { token, user: currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && token && currentUser) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); 
        const resultAction = await dispatch(login({ username, password }));
        
        if (login.fulfilled.match(resultAction)) {
            navigate('/');
        } else {
            setErrorMessage(resultAction.payload || 'Đăng nhập thất bại');
        }
    };

    return (
        <div className="login-container animate__animated animate__slideInUp">
            <form onSubmit={handleSubmit}>
                <h2>Đăng nhập</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <div className="input-password-group">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                <button type="submit">Đăng nhập</button>
                <p className='text-center'>
                    Bạn chưa có tài khoản?
                    <span className='text-primary' onClick={() => navigate('/register')}>Đăng ký.</span>
                </p>
                {errorMessage && (<Message type="error">{error}</Message>)}
            </form>
        </div>
    );
};

export default Login;
