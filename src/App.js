import './App.css';

function App() {
  return (
    <div className="profile-card">
      <div className="avatar">MT</div>

      <h1 className="name">Nguyễn Phan Minh Trí</h1>
      <p className="title">Web Developer</p>

      <div className="info-section">
        <div className="info-item">
          <div className="info-icon">📧</div>
          <div className="info-text">
            <span className="info-label">Email:</span>
            nguyenphanminhtri612004@email.com
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">📱</div>
          <div className="info-text">
            <span className="info-label">Số điện thoại:</span>
            0898506715
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">📍</div>
          <div className="info-text">
            <span className="info-label">Địa chỉ:</span>
            TP. Hồ Chí Minh, Việt Nam
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">🎂</div>
          <div className="info-text">
            <span className="info-label">Ngày sinh:</span>
            06/01/2004
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
