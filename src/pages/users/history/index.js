import React, { useEffect, useState } from 'react';
import './style.scss';
import CardHistory from '../../../components/CardHistory';

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem('watchHistory');
    if (data) {
      setHistory(JSON.parse(data));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('watchHistory');
    setHistory([]);
  }

  return (
    <div className="history-page">
      <h2 className='title-history'>Lịch sử xem phim</h2>
      {history.length === 0 ? (
        <p>Bạn chưa xem bộ phim nào.</p>
      ) : (
        <>
          <button className='btn-clear-history' onClick={clearHistory}><i className="bi bi-journal-x"></i> Xóa lịch sử xem</button>
          <div className="history-list">
            {history.map((item, idx) => (
              <CardHistory film={item} key={idx} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default History;
