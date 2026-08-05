import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import './index.css';

function App() {
  return (
    <div className="app-container">
      {/* Header / Navbar */}
      <header className="navbar">
        <div className="logo">Tràng An</div>
        <nav className="nav-links">
          <a href="#about">Về chúng tôi</a>
          <a href="#menu">Thực đơn</a>
          <a href="#gallery">Không gian</a>
          <a href="#reviews">Đánh giá</a>
        </nav>
        <button className="btn-primary">Đặt Bàn Ngay</button>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Tinh Hoa Ẩm Thực Cố Đô Giữa Lòng Hà Nội</h1>
          <p>Trải nghiệm hương vị truyền thống trong không gian sang trọng, ấm cúng.</p>
          <button className="btn-large">Khám Phá Thực Đơn</button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about section">
        <div className="about-text">
          <h2>Về Nhà Hàng Tràng An</h2>
          <p>
            Giữa nhịp sống hối hả của thủ đô, Tràng An hiện lên như một chốn bình yên, lưu giữ trọn vẹn tinh hoa ẩm thực Việt. 
            Với thiết kế lấy cảm hứng từ những ngôi nhà cổ, sử dụng tông màu gỗ ấm áp và ánh đèn vàng dịu nhẹ, chúng tôi mang đến 
            cho thực khách không chỉ là những bữa ăn ngon mà còn là một trải nghiệm không gian văn hóa đích thực.
          </p>
        </div>
        <div className="about-image-container">
          <img src="/palace.jpg" alt="Không gian mộc mạc" className="about-img" />
        </div>
      </section>

      {/* Signature Menu Section */}
      <section id="menu" className="menu section">
        <h2 className="section-title">Thực Đơn Đặc Sắc</h2>
        <div className="menu-grid">
          {[
            { name: 'Dê Xé Phay', desc: 'Thịt dê tươi ngon, mềm ngọt hòa quyện cùng các loại gia vị đặc trưng.', price: '250.000đ' },
            { name: 'Lẩu Riêu Cua Bắp Bò', desc: 'Nước lẩu thanh mát, riêu cua đồng nguyên chất, bắp bò giòn sần sật.', price: '450.000đ' },
            { name: 'Gà Nướng Mộc', desc: 'Gà ta thả vườn nướng than hoa, da giòn thịt dai, thơm lừng.', price: '380.000đ' },
            { name: 'Nộm Ngó Sen', desc: 'Món khai vị thanh đạm, giòn sần sật, chua ngọt hài hòa.', price: '120.000đ' }
          ].map((item, index) => (
            <div key={index} className="menu-card">
              <div className="menu-image image-placeholder">Ảnh món {item.name}</div>
              <div className="menu-info">
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                <span className="price">{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="gallery section">
        <h2 className="section-title">Không Gian Tràng An</h2>
        <div className="gallery-grid">
          <div className="gallery-item image-placeholder g-large">Phòng VIP sang trọng</div>
          <div className="gallery-item image-placeholder">Góc sân vườn</div>
          <div className="gallery-item image-placeholder">Bàn tiệc gia đình</div>
          <div className="gallery-item image-placeholder">Chi tiết trang trí (Hoa sen)</div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="reviews section">
        <h2 className="section-title">Thực Khách Nói Gì</h2>
        <div className="reviews-container">
          {[
            { name: 'Hoàng Long', text: '"Không gian ở đây cực kỳ ấm cúng và lịch sự. Món lẩu cua đồng thực sự xuất sắc, nước dùng rất đậm đà. Sẽ quay lại nhiều lần!"', rating: 5 },
            { name: 'Mai Phương', text: '"Mình đãi khách ở phòng VIP, nhân viên phục vụ rất chu đáo. Thiết kế gỗ rất đẹp và mang lại cảm giác thư giãn tuyệt đối."', rating: 5 },
            { name: 'Tuấn Tú', text: '"Món dê xé phay làm rất tới, không hề có mùi hôi. Giá cả hợp lý so với chất lượng dịch vụ và không gian tuyệt vời như thế này."', rating: 5 }
          ].map((review, i) => (
            <div key={i} className="review-card">
              <div className="stars">{'★'.repeat(review.rating)}</div>
              <p className="review-text">{review.text}</p>
              <h4 className="reviewer-name">- {review.name} -</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-info">
            <h3>Nhà Hàng Tràng An</h3>
            <p>📍 Địa chỉ: Hà Nội, Việt Nam</p>
            <p>📞 Hotline: 09xx xxx xxx</p>
            <p>⏰ Giờ mở cửa: 09:00 - 22:30</p>
          </div>
          <div className="footer-map">
             <div className="image-placeholder map-placeholder">Google Maps Embed</div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Nhà Hàng Tràng An. All rights reserved.</p>
        </div>
      </footer>
      <Analytics />
    </div>
  );
}

export default App;
