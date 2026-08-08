export interface MenuItem {
  name: string;
  desc: string;
  price: string;
  image: string;
}

export interface BookingData {
  name: string;
  phone: string;
  time: string;
  guests: string;
  notes: string;
}

// TODO: Replace with your actual Google Sheet ID
const SHEET_ID = '1xdCkET1iFgPWAKbdRPwpeAPJ7dPjGfP3EHIM9RsPwVQ';
const SHEET_TAB_NAME = 'Menu';

// TODO: Replace with your Google Apps Script Web App URL
const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwEyb-o0sbM4yjUy2jKveIb_65Uvf8m-QOnRr8z4RX6uob5xuAFl7lB9dTh7YISAIp1Hg/exec';

/**
 * Hàm hỗ trợ chuyển đổi link Google Drive (dạng Share) thành link ảnh trực tiếp
 */
function getDirectImageUrl(url: string): string {
  if (!url) return '';
  // Nếu là link Google Drive dạng /file/d/ID/view
  if (url.includes('drive.google.com/file/d/')) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      // Dùng thumbnail API để lấy ảnh trực tiếp, tránh bị chặn (CORS/403) bởi Google Drive
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
    }
  }
  return url;
}

/**
 * Lấy dữ liệu thực đơn từ Google Sheet công khai
 */
export async function fetchMenuData(): Promise<MenuItem[]> {

  const query = encodeURIComponent('Select *');
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_TAB_NAME}&tq=${query}`;

  try {
    const response = await fetch(url);
    const text = await response.text();

    // Parse Google's weird JSON format (JSON_CALLBACK)
    const jsonString = text.match(/(?<=.*\().*(?=\);)/s);
    if (!jsonString || !jsonString[0]) throw new Error('Invalid response format');

    const data = JSON.parse(jsonString[0]);

    // Map data from Google Sheet rows
    // Giả sử cột A: Tên món, B: Mô tả, C: Giá, D: Link ảnh
    const menuItems: MenuItem[] = data.table.rows.map((row: any) => {
      const imgUrl = getDirectImageUrl(row.c[3]?.v || '');
      return {
        name: row.c[0]?.v || '',
        desc: row.c[1]?.v || '',
        price: row.c[2]?.v || '',
        image: imgUrl,
      };
    });

    console.log("Danh sách Menu lấy được từ Google Sheet:", menuItems);

    // Bỏ qua dòng tiêu đề nếu dòng đầu tiên là Tên Món
    if (menuItems.length > 0 && menuItems[0].name.toLowerCase().includes('tên món')) {
      menuItems.shift();
    }

    return menuItems;
  } catch (error) {
    console.error('Error fetching menu from Google Sheets:', error);
    return [];
  }
}

/**
 * Gửi dữ liệu đặt bàn tới Google Apps Script Webhook
 */
export async function submitBooking(data: BookingData): Promise<boolean> {

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Required for Google Apps Script CORS
      }
    });

    const result = await response.json();
    return result.result === 'success';
  } catch (error) {
    console.error('Error submitting booking:', error);
    return false;
  }
}
