import { useState } from 'react';
import { submitBooking } from '../services/googleSheets';
import type { BookingData } from '../services/googleSheets';
import * as yup from 'yup';
import './BookingModal.css';

const bookingSchema = yup.object().shape({
  name: yup.string().trim().min(2, 'Tên của bạn quá ngắn.').required('Vui lòng nhập tên.'),
  phone: yup.string().matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ (Ví dụ: 0912345678).').required('Vui lòng nhập số điện thoại.'),
  date: yup.date().min(
    new Date(new Date().setHours(0, 0, 0, 0)),
    'Ngày đặt bàn không được là ngày trong quá khứ.'
  ).required('Vui lòng chọn ngày.'),
  time: yup.string().test('is-valid-time', 'Nhà hàng mở cửa từ 09:00 đến 22:30.', (value) => {
    if (!value) return false;
    const [hours, minutes] = value.split(':').map(Number);
    const timeValue = hours + minutes / 60;
    return timeValue >= 9 && timeValue <= 22.5;
  }).required('Vui lòng chọn giờ.'),
  guests: yup.number().min(1, 'Số người phải lớn hơn 0.').required('Vui lòng nhập số người.'),
  notes: yup.string()
});

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const [formData, setFormData] = useState<BookingData>({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Lấy ngày hôm nay định dạng YYYY-MM-DD cho thuộc tính min của ô chọn Ngày
  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    try {
      await bookingSchema.validate(formData);
      setError('');
    } catch (err: any) {
      setError(err.message);
      return;
    }

    setLoading(true);
    setError('');

    const isSuccess = await submitBooking(formData);
    
    if (isSuccess) {
      setSuccess(true);
      // Đặt lại form
      setFormData({ name: '', phone: '', date: '', time: '', guests: '2', notes: '' });
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } else {
      setError('Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại hoặc liên hệ Hotline.');
    }
    
    setLoading(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
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
            <input type="tel" name="phone" required placeholder="Ví dụ: 0912345678" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Ngày *</label>
              <input type="date" name="date" required min={todayStr} value={formData.date} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Giờ đến *</label>
              <input type="time" name="time" required value={formData.time} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Số người</label>
              <input type="number" name="guests" min="1" value={formData.guests} onChange={handleChange} />
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
