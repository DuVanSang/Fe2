import React, { useEffect, useState } from 'react';
import axios from 'axios';

function BookManager({ token, onLogout }) {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8081';

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/books/GetAll`);
      setBooks(res.data.result.data || []);
    } catch (err) {
      setMessage('Không lấy được danh sách sách');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post(`${apiUrl}/books/Create`, {
        title,
        price: parseFloat(price),
        description
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTitle(''); setPrice(''); setDescription('');
      fetchBooks();
      setMessage('Thêm sách thành công!');
    } catch (err) {
      setMessage('Thêm sách thất bại!');
    }
  };

  const handleDelete = async (id) => {
    setMessage('');
    try {
      await axios.delete(`${apiUrl}/books/Delete`, {
        params: { id },
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBooks();
      setMessage('Xóa sách thành công!');
    } catch (err) {
      setMessage('Xóa sách thất bại!');
    }
  };

  return (
    <div>
      <button onClick={onLogout} style={{ float: 'right' }}>Đăng xuất</button>
      <h3>Danh sách sách</h3>
      {message && <div style={{ color: message.includes('thành công') ? 'green' : 'red' }}>{message}</div>}
      {loading ? <div>Đang tải...</div> : (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', marginBottom: 16 }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên sách</th>
              <th>Giá</th>
              <th>Mô tả</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.price}</td>
                <td>{book.description}</td>
                <td><button onClick={() => handleDelete(book.id)}>Xóa</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h4>Thêm sách mới</h4>
      <form onSubmit={handleAdd} style={{ background: '#f4f4f4', padding: 12, borderRadius: 8 }}>
        <input type="text" placeholder="Tên sách" value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '30%', marginRight: 8 }} />
        <input type="number" placeholder="Giá" value={price} onChange={e => setPrice(e.target.value)} required min="0" step="0.01" style={{ width: '20%', marginRight: 8 }} />
        <input type="text" placeholder="Mô tả" value={description} onChange={e => setDescription(e.target.value)} style={{ width: '30%', marginRight: 8 }} />
        <button type="submit">Thêm</button>
      </form>
    </div>
  );
}

export default BookManager;
