# Nâng cấp thiệp 20/10 cho Nguyễn Thu Phương

Mục tiêu: thể hiện tay nghề lập trình bằng một món quà đẹp, mượt, cá nhân hóa theo ngành Kế toán. Giọng ấm áp, thả thính nhẹ. Yêu cầu bổ sung của chủ dự án: giữ đầy đủ form thông tin, hai câu hỏi, ảnh và cuốn album, tự cuộn, điều hướng, vuốt, nhạc, chibi, hoa, thư tự viết, thông điệp bí mật, vé và hiệu ứng cũ.

## Kiến trúc

Giữ HTML/CSS/JavaScript thuần và toàn bộ ID đang dùng. `studio.css` là lớp thiết kế mới trên `style.css`. `studio.js` bổ sung sổ tương tác, album xem lớn, ảnh thêm và phím tắt. `gift-core.js` chứa logic thuần được kiểm thử. `script.js` giữ các luồng cũ, sửa những điểm tích hợp album và khả năng giảm chuyển động. Không chuyển framework. Đồng bộ toàn bộ bản chạy sang `public/` trước khi đẩy hai remote theo cấu hình dự án.

## Các phần thực hiện

- [ ] Bảo toàn bản gốc ở commit `04bd45c`; bổ sung kiểm thử trước cho sổ, album, tạm dừng và ảnh thêm.
- [ ] Làm màn hình nhập thông tin/quiz theo chất giấy và cuốn sổ; giữ nguyên nội dung riêng.
- [ ] Làm hero, album ở vị trí nổi bật, sổ Nợ/Có, hoa và thư cùng một hệ thiết kế.
- [ ] Giữ đủ tính năng cũ; hoàn thiện nút thêm ảnh vốn có giao diện nhưng chưa có xử lý.
- [ ] Kiểm tra nhập sai/đúng, quiz sai/đúng, album và tự cuộn, modal, vé, nhạc, hoa, sổ, xuất kỷ niệm, bàn phím, màn hình nhỏ.
- [ ] Đồng bộ root/public; kiểm thử; kiểm tra độc lập; cập nhật đúng hai remote; xác minh trang Vercel đã đổi.

## Nguyên tắc thị giác

Mận trầm `#402536`, giấy `#fbf7f2`, hồng bụi `#bb7e8b`, xanh xô thơm `#879a88`. Tiêu đề serif thanh, thân bài dễ đọc, số liệu tabular. Dùng ảnh Phương nguyên gốc. Bốn ảnh `references/` là định hướng chất liệu/bố cục; nội dung thật và các chức năng gốc luôn ưu tiên cao hơn hình mockup. Ngày 2024 trong mockup sổ là lỗi của ảnh tham chiếu, không được đưa lên sản phẩm.

## Điểm cần rà kỹ

Không mất câu hỏi hoặc bỏ qua mở khóa. Album hiển thị ảnh trực tiếp, không chỉ có một nút mở. Tạm dừng phải giữ khi rời chuột. Ảnh thêm phải thực sự vào vòng điều hướng. Khôi phục dữ liệu hỏng không làm treo trang. Tắt chuyển động vẫn dùng được tất cả chức năng. Không khẳng định ghi file trên máy khi chạy Vercel: API ở đó chỉ ghi log/đáp ứng, bản Node cục bộ mới ghi file.

## Theo dõi

Đã xác minh Desktop thật là `C:\Users\anhkh\OneDrive\Desktop\2010`, sạch ở commit `04bd45c`, root/public đồng nhất. Remote `cloned` là kho liên kết domain yêu cầu; `origin` là `20th10`. Thực hiện trong nhánh `codex/2010-keepsake` tại thư mục người dùng chỉ định.
