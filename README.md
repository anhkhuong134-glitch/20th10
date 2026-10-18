# 🌸 Dự Án Quà Tặng 20/10 Đặc Biệt Dành Cho Thu Phương 🐱✨

> **Dành tặng:** Thu Phương - Cô gái Năm 3 Kế Toán, Yêu Boss Mèo & Có Nụ Cười Rạng Rỡ.  
> **Tính năng đặc biệt:** Khóa bảo mật yêu cầu nhập đúng tên **Thu Phương** mới mở được món quà!  
> **Hình thức:** Web app tương tác nghệ thuật kết hợp phong cách Coder Gen Z dí dỏm, Minigame bắt boss mèo, Album ảnh 3D và Bức thư chúc 20/10 sâu lắng kèm âm nhạc du dương.

---

## 🔒 1. Màn Hình Khóa Bảo Mật (Gatekeeper Check)

Khi mở link web, trang đầu tiên hiện ra sẽ là **Màn hình xác thực danh tính**:
- Yêu cầu người xem nhập tên để mở khóa.
- Hệ thống hỗ trợ nhận diện linh hoạt: `Thu Phương`, `thu phuong`, `Phương`, `Thu`, `Phương Thu`... (chữ hoa/thường, có dấu hoặc không dấu đều nhận diện chính xác).
- Nếu người khác bấm vào hoặc nhập sai tên:
  - Khung nhập sẽ lắc lư (shake animation) kèm thông báo: *"Ủa ai dợ? Món quà này chỉ dành riêng cho Thu Phương thôi ó! Thử lại nha 🐾"*.
  - Có nút gợi ý: *"Tên một cô gái xinh đẹp sinh viên năm 3 Kế Toán siêu mê boss mèo ó!"*.
- Khi nhập đúng tên **Thu Phương**:
  - Phát âm thanh chuông phép thuật + bắn pháo hoa trái tim.
  - Chuyển tiếp mượt mà vào màn hình Coder Terminal và Minigame!

---

## 🌟 2. Các Màn Trải Nghiệm Tiếp Theo

1. **Terminal Coder Scan:**
   - Quét thông tin Thu Phương (Năm 3 Kế Toán, sở thích chó mèo, mức độ stress vì Bảng Cân Đối & Báo Cáo Tài Chính).
2. **Minigame Bắt Boss Mèo & Bảng Cân Đối:**
   - Chạm/click bắt 5 chú mèo & đóa hoa bay trên màn hình (phát tiếng kêu *"Meow meow~"* siêu dễ thương).
   - Câu hỏi trắc nghiệm Kế toán Gen Z: *"Khi Thu Phương mỉm cười thì số dư ghi nhận vào đâu?"* (Chọn câu nào cũng đúng và khiến cô ấy vui vẻ!).
3. **Đóa Hoa Nở Rộ & Album Ảnh 3D Polaroid:**
   - Đóa hoa hồng vĩnh cửu vẽ bằng thuật toán Canvas nở rộ khi chạm vào.
   - Album ảnh lật 3D có sẵn ảnh đại diện Facebook thật của Thu Phương (`avatar.jpg`) và các khung ảnh cưng chiều.
   - Bức thư *"Báo Cáo Tài Chính Cảm Xúc"* với ngôn ngữ Kế toán lãng mạn (Nợ TK nụ cười, Có TK hạnh phúc, nợ môn = 0).
   - Hộp quà bí mật với lời chúc bất ngờ.
   - Giai điệu hộp nhạc lofi du dương.

---

## 📸 Cách Thêm Thêm Ảnh Của Thu Phương Vào Album

1. Copy các file ảnh của bạn vào thư mục này (ví dụ: `phuong1.jpg`, `phuong2.jpg`...).
2. Mở file [index.html](file:///c:/Users/anhkh/OneDrive/Desktop/2010/index.html), tìm đến phần `<div class="album-slider">`.
3. Thay đường dẫn ảnh trong thẻ `<img>` của từng slide thành tên ảnh của bạn:
   ```html
   <img src="phuong1.jpg" alt="Thu Phương">
   ```
4. Lưu file lại là xong!

---

## 🚀 Hướng Dẫn Triển Khai Lên GitHub & Vercel (Lấy Link Gửi Tặng)

### Bước 1: Đẩy Code Lên GitHub
1. Vào [github.com/new](https://github.com/new) tạo một Repo mới (ví dụ đặt tên: `for-thu-phuong`), để chế độ **Public**.
2. Mở Terminal trong thư mục này và chạy các lệnh:
   ```bash
   git add .
   git commit -m "Update: Lock screen name verification for Thu Phuong"
   git remote add origin https://github.com/<tai-khoan-cua-ban>/for-thu-phuong.git
   git branch -M main
   git push -u origin main
   ```

### Bước 2: Triển Khai Sang Vercel (Cực Nhanh & Đẹp)
1. Truy cập [vercel.com](https://vercel.com/) và đăng nhập bằng tài khoản **GitHub**.
2. Tại trang Dashboard, bấm nút **Add New...** góc trên bên phải -> Chọn **Project**.
3. Bạn sẽ thấy danh sách Repo trên GitHub của mình, tìm repo `for-thu-phuong` vừa đẩy lên và bấm **Import**.
4. Ở màn hình cấu hình, giữ nguyên tất cả mặc định -> Bấm nút **Deploy**.
5. Chờ khoảng 15 - 30 giây, Vercel sẽ hoàn tất và cấp cho bạn một đường link cực đẹp dạng:  
   👉 **`https://for-thu-phuong.vercel.app`**
6. Copy link này và gửi tặng Thu Phương qua Messenger / Zalo / Instagram!
