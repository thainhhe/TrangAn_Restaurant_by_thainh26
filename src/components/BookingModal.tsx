import { useState } from 'react';
import { submitBooking } from '../services/googleSheets';
import type { BookingData } from '../services/googleSheets';
import './BookingModal.css';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const [formData, setFormData] = useState<BookingData>({
    name: '',
    phone: '',
    time: '',
    guests: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const isSuccess = await submitBooking(formData);
    
    if (isSuccess) {
      setSuccess(true);
      // Đặt lại form
      setFormData({ name: '', phone: '', time: '', guests: '', notes: '' });
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } else {
      setError('Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại hoặc liên hệ Hotline.');
    }
    
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Đặt Bàn Tại Tràng An</h2>
        <p className="modal-subtitle">Để lại thông tin, chúng tôi sẽ liên hệ xác nhận trong vòng 15 phút.</p>

        {success ? (
          <div className="modal-success">
            <h3>🎉 Đặt bàn thành công!</h3>
            <p>Cảm ơn quý khách. Chúng tôi sẽ sớm liên hệ lại.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label>Tên của bạn *</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="VD: Anh Minh" />
            </div>
            
            <div className="form-group">
              <label>Số điện thoại *</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="VD: 0912 345 678" />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Giờ đến *</label>
                <input type="time" name="time" required value={formData.time} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Số người *</label>
                <input type="number" min="1" name="guests" required value={formData.guests} onChange={handleChange} placeholder="VD: 4" />
              </div>
            </div>

            <div className="form-group">
              <label>Ghi chú (Tùy chọn)</label>
              <textarea name="notes" rows={3} value={formData.notes} onChange={handleChange} placeholder="VD: Có trẻ em, cần ghế ăn dặm..."></textarea>
            </div>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="btn-primary btn-submit" disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi Đặt Bàn'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
