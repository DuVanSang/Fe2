import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:8081'}/auth/Login`, {
        name: username,
        password
      });
      if (res.data && res.data.result && res.data.result.token) {
        onLogin(res.data.result.token);
      } else {
        setError('Đăng nhập thất bại!');
      }
    } catch (err) {
      setError('Đăng nhập thất bại!');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: 24, borderRadius: 8 }}>
      <h3>Đăng nhập</h3>
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ width: '100%', padding: 8 }}
          required
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', padding: 8 }}
          required
        />
      </div>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <button type="submit" style={{ width: '100%', padding: 10 }}>Đăng nhập</button>
    </form>
  );
}

export default Login;
