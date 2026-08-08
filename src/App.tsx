import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import { fetchMenuData } from './services/googleSheets';
import type { MenuItem } from './services/googleSheets';
import BookingModal from './components/BookingModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);

  useEffect(() => {
    const loadMenu = async () => {
      setLoadingMenu(true);
      const data = await fetchMenuData();
      setMenuItems(data);
      setLoadingMenu(false);
    };
    loadMenu();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
        <button className="btn-primary" onClick={openModal}>Đặt Bàn Ngay</button>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Tinh Hoa Ẩm Thực Cố Đô Giữa Lòng Hà Nội</h1>
          <p>Trải nghiệm hương vị truyền thống trong không gian sang trọng, ấm cúng.</p>
          <button className="btn-large" onClick={openModal}>Đặt Bàn Ngay</button>
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
        {loadingMenu ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Đang tải thực đơn...</div>
        ) : (
          <div className="menu-grid">
            {menuItems.map((item, index) => (
              <div key={index} className="menu-card">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="menu-image" style={{ objectFit: 'cover' }} />
                ) : (
                  <div className="menu-image image-placeholder">Ảnh món {item.name}</div>
                )}
                <div className="menu-info">
                  <h3>{item.name}</h3>
                  <p>{item.desc}</p>
                  <span className="price">{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="gallery section">
        <h2 className="section-title">Không Gian Tràng An</h2>
        <div className="gallery-grid">
          <img src="/palace.jpg" alt="Phòng VIP sang trọng" className="gallery-item g-large" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
          <img src="/place1.jpg" alt="Bàn tiệc gia đình" className="gallery-item" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
          <img src="/place2.jpg" alt="Chi tiết trang trí" className="gallery-item" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
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
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14897.46793239677!2d105.77436295058928!3d21.017997201326157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab0d0d093d69%3A0x3642779b91f09f62!2zTmjDoCBIw6BuZyBUcsOgbmcgQW4!5e0!3m2!1svi!2s!4v1786199454019!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin">
            </iframe>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Nhà Hàng Tràng An. All rights reserved.</p>
        </div>
      </footer>
      <Analytics />

      {/* Booking Modal */}
      <BookingModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default App;
