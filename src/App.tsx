import { useState, useEffect, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';
import './index.css';
import { fetchMenuData } from './services/googleSheets';
import type { MenuItem } from './services/googleSheets';
import BookingModal from './components/BookingModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const menuScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (menuScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = menuScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft) < scrollWidth - clientWidth - 1);
    }
  };

  const scrollMenu = (direction: 'left' | 'right') => {
    if (menuScrollRef.current) {
      const scrollAmount = 350;
      menuScrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const loadMenu = async () => {
      setLoadingMenu(true);
      const data = await fetchMenuData();
      setMenuItems(data);
      setLoadingMenu(false);
    };
    loadMenu();

    window.scrollTo(0, 0);
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [menuItems]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="app-container">
      {/* Navbar */}
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
        <div className="hero-content animate-on-load">
          <span className="hero-badge">Nhà hàng ẩm thực truyền thống</span>
          <h1>Tràng An</h1>
          <p className="delay-1 animate-on-load">
            Tinh Hoa Ẩm Thực Cố Đô Giữa Lòng Hà Nội.<br />
            Trải nghiệm hương vị truyền thống<br />
            trong không gian sang trọng, ấm cúng và riêng tư.
          </p>
          <button className="btn-gold delay-2 animate-on-load" onClick={openModal}>Đặt Bàn Ngay</button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about section">
        <div className="about-content">
          <p className="section-subtitle">Câu chuyện của chúng tôi</p>
          <h2>Khơi nguồn vị giác<br />Bảo tồn di sản</h2>
          <p>
            Giữa nhịp sống hối hả của thủ đô, Tràng An hiện lên như một chốn bình yên, lưu giữ trọn vẹn tinh hoa ẩm thực Việt. Với thiết kế lấy cảm hứng từ những ngôi nhà cổ xưa, kết hợp cùng tông màu gỗ ấm áp và ánh đèn vàng dịu nhẹ.
          </p>
          <p>
            Chúng tôi mang đến cho thực khách không chỉ là những bữa ăn ngon, mà còn là một trải nghiệm không gian văn hóa đích thực, lý tưởng cho những buổi tiệc gia đình hay gặp gỡ đối tác quan trọng.
          </p>
          <div className="signature">Tràng An</div>
        </div>
        <div className="about-image-wrapper">
          <img src="/palace.jpg" alt="Không gian mộc mạc" className="about-img" />
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="menu section">
        <p className="section-subtitle">Tinh Hoa Ẩm Thực</p>
        <h2 className="section-title">Thực Đơn Đặc Sắc</h2>
        {loadingMenu ? (
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.1rem' }}>Đang tải thực đơn...</div>
        ) : (
          <div className="menu-carousel-wrapper">
            <button 
              className={`carousel-btn left ${!canScrollLeft ? 'disabled' : ''}`} 
              onClick={() => scrollMenu('left')}
              disabled={!canScrollLeft}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <div className="menu-carousel" ref={menuScrollRef} onScroll={checkScroll}>
              {menuItems.map((item, index) => (
                <div key={index} className="menu-card">
                  <div className="menu-image-container">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="menu-image" />
                    ) : (
                      <div className="menu-image image-placeholder">Ảnh {item.name}</div>
                    )}
                    <div className="price-tag">{item.price}</div>
                  </div>
                  <div className="menu-info">
                    <h3>{item.name}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className={`carousel-btn right ${!canScrollRight ? 'disabled' : ''}`} 
              onClick={() => scrollMenu('right')}
              disabled={!canScrollRight}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        )}
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="gallery section">
        <p className="section-subtitle">Trải nghiệm</p>
        <h2 className="section-title">Không Gian Tràng An</h2>
        <div className="gallery-grid">
          <div className="gallery-item g-large">
            <img src="/palace.jpg" alt="Phòng VIP sang trọng" />
          </div>
          <div className="gallery-item g-wide">
            <img src="/place1.jpg" alt="Bàn tiệc gia đình" />
          </div>
          <div className="gallery-item">
            <img src="/place2.jpg" alt="Chi tiết trang trí" />
          </div>
          <div className="gallery-item">
            <img src="/palace.jpg" alt="Không gian ấm cúng" />
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="reviews section">
        <p className="section-subtitle">Khách Hàng</p>
        <h2 className="section-title">Thực Khách Nói Gì</h2>
        <div className="reviews-container">
          {[
            { name: 'Hoàng Long', text: 'Không gian ở đây cực kỳ ấm cúng và lịch sự. Món lẩu cua đồng thực sự xuất sắc, nước dùng rất đậm đà. Sẽ quay lại nhiều lần!', rating: 5 },
            { name: 'Mai Phương', text: 'Mình đãi khách ở phòng VIP, nhân viên phục vụ rất chu đáo. Thiết kế gỗ rất đẹp và mang lại cảm giác thư giãn tuyệt đối.', rating: 5 },
            { name: 'Tuấn Tú', text: 'Món dê xé phay làm rất tới, không hề có mùi hôi. Giá cả hợp lý so với chất lượng dịch vụ và không gian tuyệt vời như thế này.', rating: 5 }
          ].map((review, i) => (
            <div key={i} className="review-card">
              <span className="quote-icon">"</span>
              <div className="stars">{'★'.repeat(review.rating)}</div>
              <p className="review-text">{review.text}</p>
              <h4 className="reviewer-name">{review.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-info">
            <span className="footer-logo">Tràng An</span>
            <p className="footer-desc">Mang trọn vẹn hương vị truyền thống tinh túy của ẩm thực cố đô vào từng món ăn, trong một không gian đậm chất di sản.</p>
          </div>
          <div className="footer-info">
            <h4>Thông Tin Liên Hệ</h4>
            <p>📍 Hà Nội, Việt Nam</p>
            <p>📞 09xx xxx xxx</p>
            <p>⏰ 09:00 - 22:30 hàng ngày</p>
          </div>
          <div className="footer-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14897.46793239677!2d105.77436295058928!3d21.017997201326157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab0d0d093d69%3A0x3642779b91f09f62!2zTmjDoCBIw6BuZyBUcsOgbmcgQW4!5e0!3m2!1svi!2s!4v1786199454019!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin">
            </iframe>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Nhà Hàng Tràng An. All rights reserved. Designed with precision.</p>
        </div>
      </footer>
      <Analytics />

      {/* Booking Modal */}
      <BookingModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default App;
