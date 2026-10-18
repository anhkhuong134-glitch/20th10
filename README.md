# 🌸 Dự Án Quà Tặng 20/10 Đặc Biệt Dành Cho Phương Thu 🐱✨

> **Dành tặng:** Phương Thu - Cô gái Năm 3 Kế Toán, Yêu Boss Mèo & Có Nụ Cười Rạng Rỡ.  
> **Hình thức:** Trang web tương tác nghệ thuật kết hợp phong cách Coder Gen Z dí dỏm, Minigame bắt mèo & hoa, Album ảnh 3D và Bức thư chúc 20/10 sâu lắng kèm âm nhạc du dương.

---

## 🌟 Điểm Nổi Bật Của Món Quà

1. **Phần 1 - Hacker Coder Intro:**
   - Màn hình terminal giả lập quét profile Phương Thu (Năm 3 Kế Toán, sở thích chó mèo, mức độ stress vì Bảng Cân Đối & Deadline).
   - Tự động gõ code sinh động, mở ra nhiệm vụ bí mật 20/10.

2. **Phần 2 - Minigame Bắt Boss Mèo & Quiz Kế Toán Gen Z:**
   - Boss mèo (`🐱`) và đóa hoa (`🌸`) bay bổng trên màn hình.
   - Nhấn/Chạm vào boss mèo sẽ phát ra tiếng kêu *"Meow meow~"* siêu dễ thương (được tổng hợp trực tiếp bằng Web Audio API).
   - Đạt đủ 5 điểm sẽ kích hoạt câu hỏi Kế toán trắc nghiệm: *"Khi Phương Thu mỉm cười thì số dư ghi nhận vào đâu?"* (Chọn câu nào cũng đúng và khiến cô ấy vui vẻ!).

3. **Phần 3 - Vườn Hoa Nở Rộ & Album Ảnh 3D Polaroid:**
   - **Đóa hoa hồng vĩnh cửu:** Vẽ bằng thuật toán toán học Parametric Canvas với ánh sáng neon lung linh, chạm vào sẽ nở bừng.
   - **Album ảnh Polaroid 3D:** Có sẵn ảnh đại diện của Phương Thu (`avatar.jpg`) và các slide ảnh mèo, cún, hoa tươi.
   - **Bức thư Báo cáo tài chính cảm xúc 20/10:** Câu từ duyên dáng, dí dỏm chuẩn dân Kế toán (Nợ TK nụ cười, Có TK hạnh phúc, nợ môn = 0) kết hợp tình cảm chân thành dành cho Crush.
   - **Hộp thông điệp bí mật:** Mở pop-up lời chúc dễ thương kèm nút *"Mình mỉm cười rồi nè!"*.

4. **Âm Nhạc Du Dương (Procedural Web Audio):**
   - Hộp nhạc phát giai điệu lãng mạn nhẹ nhàng, không sợ bị chặn bản quyền hoặc lỗi tải file âm thanh.

---

## 📸 Cách Thêm Thêm Ảnh Của Phương Thu Vào Album

Mặc định trang web đã tải sẵn ảnh đại diện chính của Phương Thu (`avatar.jpg`). Nếu bạn có thêm những tấm ảnh đẹp khác của cô ấy:

1. Copy các file ảnh của bạn vào cùng thư mục dự án và đặt tên ví dụ: `thu1.jpg`, `thu2.jpg`, `thu3.jpg`...
2. Mở file [index.html](file:///c:/Users/anhkh/OneDrive/Desktop/2010/index.html), tìm đến phần `<div class="album-slider">`.
3. Thay đường link ảnh trong thẻ `<img>` của từng slide thành tên ảnh của bạn:
   ```html
   <img src="thu1.jpg" alt="Phương Thu">
   ```
4. Lưu file lại là xong!

---

## 🚀 Hướng Dẫn Đẩy Lên GitHub & Bật Link Web (GitHub Pages)

Để cô ấy chỉ cần bấm vào một đường link trên điện thoại là xem được ngay lập tức:

### Bước 1: Tạo Repository trên GitHub
1. Đăng nhập vào [GitHub](https://github.com/) của bạn.
2. Bấm vào dấu **+** ở góc trên bên phải -> Chọn **New repository**.
3. Đặt tên Repo (ví dụ: `for-phuong-thu` hoặc `happy-2010`).
4. Để chế độ **Public** -> Bấm **Create repository**.

### Bước 2: Đẩy Code Lên GitHub
Mở Terminal trong thư mục này và gõ các lệnh sau (thay URL bằng link repo của bạn):

```bash
git remote add origin https://github.com/<tai-khoan-cua-ban>/for-phuong-thu.git
git branch -M main
git push -u origin main
```

### Bước 3: Bật GitHub Pages (Lấy Link Gửi Tặng)
1. Trên giao diện GitHub của Repo vừa tạo, vào mục **Settings** (Cài đặt) -> Chọn mục **Pages** ở thanh bên trái.
2. Ở phần **Build and deployment** > **Branch**:
   - Chọn nhánh **main** (hoặc `master`).
   - Thư mục chọn **/ (root)**.
   - Bấm **Save**.
3. Chờ khoảng 1 - 2 phút, GitHub sẽ hiển thị đường link dạng:
   👉 `https://<tai-khoan-cua-ban>.github.io/for-phuong-thu/`
4. Copy link này và gửi tặng Phương Thu qua tin nhắn Messenger / Zalo / Instagram!

---

## 💻 Xem Thử Ngay Trên Máy Tính Của Bạn
- Cách 1: Click đúp trực tiếp vào file [index.html](file:///c:/Users/anhkh/OneDrive/Desktop/2010/index.html) để mở bằng bất kỳ trình duyệt nào.
- Cách 2: Chạy lệnh `node server.js` và truy cập `http://localhost:3456`.
