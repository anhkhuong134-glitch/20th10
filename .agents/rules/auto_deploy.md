# Quy Tắc Tự Động Triển Khai (Auto Deploy Rule)

Mỗi khi người dùng yêu cầu sửa đổi hoặc bổ sung bất kỳ nội dung nào trong dự án:
1. **Đồng bộ toàn bộ file**:
   - Luôn đồng bộ các file `index.html`, `style.css`, `script.js` và tài nguyên media sang thư mục `public/`.
2. **Tự động đẩy lên GitHub & Vercel**:
   - Tự động `git add` và `git commit` với thông điệp rõ ràng.
   - Tự động đẩy lên cả hai remote GitHub:
     - `origin`: `git push origin main` (repo `20th10`)
     - `cloned`: `git push cloned main` (repo `for-thu-phuong` - liên kết trực tiếp với Vercel)
   - Đảm bảo trang web [https://for-thu-phuong.vercel.app/](https://for-thu-phuong.vercel.app/) luôn cập nhật mới nhất.
