import React, { useEffect, useState } from 'react';
import './style.scss';

function Message({ type = 'success', children, onConfirm, onCancel }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (type === 'success' || type === 'error') {
            const timer = setTimeout(() => setVisible(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [type]);

    if (!visible) return null;

    return (
        <div className={`message-box message-${type}`}>
            <div className="message-content">{children}</div>
            {type === 'confirm' && (
                <div className="message-actions">
                    <button className="btn-confirm" onClick={onConfirm}>Xác nhận</button>
                    <button className="btn-cancel" onClick={onCancel}>Hủy</button>
                </div>
            )}
        </div>
    );
}

export default Message;
