-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 13, 2022 at 06:43 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `zippostore`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `created_at`, `updated_at`, `name`, `description`) VALUES
(1, '2022-11-04 20:26:53', '2022-11-06 20:30:57', 'BẬT LỬA ZIPPO CAO CẤP', 'Bật lửa zippo cao cấp rất mắc tiền và sang trọng swdefw'),
(2, '2022-10-29 01:11:53', '2022-11-04 11:06:20', 'BẬT LỬA ZIPPO ARMOR', 'rf24f4dfgrfe'),
(3, '2022-10-29 01:12:08', '2022-11-04 09:01:46', 'BẬT LỬA ZIPPO PHỔ THÔNG', 'f4rfwfwgff'),
(4, '2022-11-04 02:02:16', '2022-11-04 08:58:30', 'Thương hiệu A', 'Rượu vang đỏ hay còn gọi là vang đỏ hay rượu nho đỏ là một dạng phổ biến của rượu vang được làm từ những loại nho đậm.'),
(5, '2022-11-04 02:02:19', '2022-11-04 08:59:19', 'Thương hiệu A', 'Rượu vang đỏ hay còn gọi là vang đỏ hay rượu nho đỏ là một dạng phổ biến của rượu vang được làm từ những loại nho.'),
(7, '2022-11-04 02:06:14', '2022-11-04 02:06:14', 'Thương hiệu A', 'Rượu vang đỏ hay còn gọi là vang đỏ hay rượu nho đỏ là một dạng phổ biến của rượu vang được làm từ những loại nho đậm màu.'),
(8, '2022-11-04 02:08:53', '2022-11-04 02:08:53', 'Thương hiệu A', 'Rượu vang đỏ hay còn gọi là vang đỏ hay rượu nho đỏ là một dạng phổ biến của rượu vang được làm từ những loại nho đậm màu.'),
(9, '2022-11-04 02:13:13', '2022-11-04 08:18:56', 'Thương hiệu AB', 'Rượu vang đỏ hay còn gọi là vang đỏ hay rượu nho đỏ là một dạng phổ biến của rượu vang được làm từ những loại nho đậm màu.'),
(10, '2022-11-04 02:14:01', '2022-11-04 02:14:01', 'Thương hiệu A', 'Rượu vang đỏ hay còn gọi là vang đỏ hay rượu nho đỏ là một dạng phổ biến của rượu vang được làm từ những loại nho đậm màu.'),
(11, '2022-11-04 02:14:31', '2022-11-04 02:14:31', 'Thương hiệu A', 'Rượu vang đỏ hay còn gọi là vang đỏ hay rượu nho đỏ là một dạng phổ biến của rượu vang được làm từ những loại nho đậm màu.'),
(12, '2022-11-04 02:15:51', '2022-11-04 02:15:51', 'Thương hiệu A', 'Rượu vang đỏ hay còn gọi là vang đỏ hay rượu nho đỏ là một dạng phổ biến của rượu vang được làm từ những loại nho đậm màu.'),
(16, '2022-11-12 02:14:19', '2022-11-12 02:14:19', 'Thương hiệu Adwfrtgw', 'Rượu vang đỏ hay còn gọi là vang đỏ hay rượu nho đỏ là một dạng phổ biến của rượu vang được làm từ những loại nho đậm màu.'),
(18, '2022-11-12 21:24:10', '2022-11-12 21:24:10', 'Thương hiệu A', 'Rượu vang đỏ hay còn gọi là vang đỏ hay rượu nho đỏ là một dạng phổ biến của rượu vang được làm từ những loại nho đậm màu.'),
(19, '2022-11-12 21:24:12', '2022-11-12 21:24:12', 'Thương hiệu A', 'Rượu vang đỏ hay còn gọi là vang đỏ hay rượu nho đỏ là một dạng phổ biến của rượu vang được làm từ những loại nho đậm màu.'),
(20, '2022-11-12 21:24:17', '2022-11-12 21:24:17', 'Thương hiệu A', 'Rượu vang đỏ hay còn gọi là vang đỏ hay rượu nho đỏ là một dạng phổ biến của rượu vang được làm từ những loại nho đậm màu.'),
(21, '2022-11-12 21:31:46', '2022-11-12 21:31:46', 'Thương hiệu A', 'Rượu vang đỏ hay còn gọi là vang đỏ hay rượu nho đỏ là một dạng phổ biến của rượu vang được làm từ những loại nho đậm màu.'),
(22, '2022-11-12 21:31:47', '2022-11-12 21:31:47', 'Thương hiệu A', 'Rượu vang đỏ hay còn gọi là vang đỏ hay rượu nho đỏ là một dạng phổ biến của rượu vang được làm từ những loại nho đậm màu.'),
(23, '2022-11-12 21:31:47', '2022-11-12 21:31:47', 'Thương hiệu A', 'Rượu vang đỏ hay còn gọi là vang đỏ hay rượu nho đỏ là một dạng phổ biến của rượu vang được làm từ những loại nho đậm màu.'),
(24, '2022-11-12 21:31:48', '2022-11-12 21:31:48', 'Thương hiệu A', 'Rượu vang đỏ hay còn gọi là vang đỏ hay rượu nho đỏ là một dạng phổ biến của rượu vang được làm từ những loại nho đậm màu.'),
(25, '2022-11-12 21:31:52', '2022-11-12 21:31:52', 'Thương hiệu A', 'Rượu vang đỏ hay còn gọi là vang đỏ hay rượu nho đỏ là một dạng phổ biến của rượu vang được làm từ những loại nho đậm màu.'),
(26, '2022-11-12 21:31:53', '2022-11-12 21:31:53', 'Thương hiệu A', 'Rượu vang đỏ hay còn gọi là vang đỏ hay rượu nho đỏ là một dạng phổ biến của rượu vang được làm từ những loại nho đậm màu.');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(5, '2014_10_12_000000_create_users_table', 1),
(6, '2014_10_12_100000_create_password_resets_table', 1),
(7, '2019_08_19_000000_create_failed_jobs_table', 1),
(8, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(9, '2022_10_16_161410_create_products_table', 2),
(10, '2022_10_16_181436_create_products_table', 3),
(11, '2022_10_19_181428_create_sales_table', 4),
(12, '2022_10_26_184102_create_orders_table', 5),
(13, '2022_10_26_184322_create_orderdetails_table', 6),
(14, '2022_10_24_012209_create_categories_table', 7),
(15, '2022_10_26_192930_create_orderdetails_table', 8),
(16, '2022_02_11_100000_create_password_resets_table', 9),
(17, '2022_11_02_135655_create_password_resets_table', 10);

-- --------------------------------------------------------

--
-- Table structure for table `orderdetails`
--

CREATE TABLE `orderdetails` (
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `product_price` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orderdetails`
--

INSERT INTO `orderdetails` (`order_id`, `product_id`, `quantity`, `product_price`, `updated_at`, `created_at`) VALUES
(3, 15, 3, 700000, '2022-11-04 13:33:25', '2022-11-04 13:33:25'),
(4, 14, 2, 900000, '2022-11-10 04:27:19', '2022-11-10 04:27:19'),
(4, 15, 1, 700000, '2022-11-10 04:27:19', '2022-11-10 04:27:19'),
(4, 16, 1, 700000, '2022-11-10 04:27:19', '2022-11-10 04:27:19'),
(4, 17, 1, 850000, '2022-11-10 04:27:19', '2022-11-10 04:27:19'),
(5, 14, 2, 900000, '2022-11-10 04:29:05', '2022-11-10 04:29:05'),
(5, 15, 1, 700000, '2022-11-10 04:29:05', '2022-11-10 04:29:05'),
(5, 16, 1, 700000, '2022-11-10 04:29:05', '2022-11-10 04:29:05'),
(5, 17, 1, 850000, '2022-11-10 04:29:05', '2022-11-10 04:29:05'),
(6, 14, 1, 900000, '2022-11-10 17:12:29', '2022-11-10 17:12:29'),
(6, 15, 1, 700000, '2022-11-10 17:12:29', '2022-11-10 17:12:29'),
(6, 16, 1, 700000, '2022-11-10 17:12:29', '2022-11-10 17:12:29'),
(7, 16, 1, 700000, '2022-11-13 17:12:24', '2022-11-13 17:12:24');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_date` datetime NOT NULL,
  `date_checked` datetime DEFAULT NULL,
  `fullname` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int(11) NOT NULL,
  `total_price` bigint(20) NOT NULL,
  `status` smallint(6) NOT NULL DEFAULT 0,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_date`, `date_checked`, `fullname`, `phone_number`, `address`, `quantity`, `total_price`, `status`, `user_id`, `updated_at`, `created_at`, `email`) VALUES
(3, '2022-11-05 03:15:31', '2022-11-07 03:48:06', 'Lê Ngọc Toàn', '0921123435', 'Thành phố Hồ Chí Minh Quận 10 Phường 05', 3, 2100000, 1, 37, '2022-11-13 14:45:42', '2022-11-04 13:30:57', 'tien23851@gmail.com'),
(4, '2022-11-10 11:27:19', NULL, 'Nguyễn Thị Minh Thư', '0921123435', 'Thành phố Hồ Chí Minh Quận Phú Nhuận Phường 11', 5, 3510000, 0, 37, '2022-11-13 14:45:52', '2022-11-10 04:27:19', 'hentaiktvn123@gmail.com'),
(5, '2022-11-10 11:29:05', NULL, 'Nguyễn Vĩnh Tiến', '0921123435', 'Thành phố Đà Nẵng Quận Cẩm Lệ Phường Hòa Phát', 5, 3510000, 0, 37, '2022-11-13 14:46:00', '2022-11-10 04:29:05', 'nguyenvinhtien431@gmail.com'),
(6, '2022-11-11 12:12:29', '2022-11-10 05:43:08', 'Nguyễn Thị Minh Thư', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Liên', 3, 2030000, 2, 37, '2022-11-13 14:46:15', '2022-11-10 17:12:29', 'tienn3605@gmail.com'),
(7, '2022-11-14 12:12:24', NULL, 'Nguyễn Thị Minh Thư', '0921123435', '------Thành phố------  ', 1, 700000, 0, 37, '2022-11-13 17:12:24', '2022-11-13 17:12:24', 'minhthu@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `selector` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire` bigint(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`id`, `email`, `token`, `selector`, `expire`, `created_at`, `updated_at`) VALUES
(11, 'starbutterfly652@gmail.com', '$2y$10$ourc0Jl3oC63N0YWsGwKZe6LtPWchd3ous6175TCgTSUR0OLkNcvu', '3fa457c47019d47f', 1667780793, '2022-11-06 17:21:33', '2022-11-06 17:21:33'),
(13, 'tien23851@gmail.com', '$2y$10$geX/48JPfzgEosgvt8TqJOShYlGuoYQHewXWdu/glwG/eaeVtfVni', '006840c4cff1df9d', 1667782814, '2022-11-06 17:55:14', '2022-11-06 17:55:14');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` int(11) NOT NULL,
  `price` bigint(20) NOT NULL,
  `category` bigint(20) UNSIGNED NOT NULL,
  `material` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `origin` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `created_at`, `updated_at`, `image`, `name`, `amount`, `price`, `category`, `material`, `origin`, `description`, `discount`) VALUES
(1, '2022-10-19 07:52:56', '2022-10-19 07:52:56', 'image_1666191176_Zippo Stigma Stoned Undeads ZA-1-137A.jpg', 'Zippo Stigma Stoned Undeads ZA-1-137A', 12, 3700000, 1, 'Đồng thau nguyên khối', 'Hàn Quốc', 'Bật lửa Zippo ASIA là một sản phẩm được hình thành và chế tác trên phôi Zippo được nhập khẩu chính hãng từ Mỹ với chất liệu vỏ đồng thau, ruột thép. Sau đó được thiết kế và trang trí theo nhiều công nghệ khác nhau bởi các nhà chế tác tại các nước Asia như Nhật Bản, Hàn Quốc… Phiên bản với các thiết kế đặc biệt được giới thiệu và chỉ phát hành tại các nước Châu Á. Được đóng gói trong một hộp quà tặng. Để có hiệu suất tối ưu, hãy đổ đầy nhiên liệu bật lửa Zippo.', 2),
(2, '2022-10-19 08:12:55', '2022-10-19 08:12:55', 'image_1666192375_Zippo Armor High Polish Brass 169.jpg', 'Zippo Armor High Polish Brass 169', 10, 750000, 2, 'Vỏ đồng thau, nền mạ đồng bóng', 'Mỹ', 'Zippo 169 mang trên mình vẻ ngoài với sắc vàng bóng loáng một cách đầy sa hoa và sang trọng. Nhưng đừng bị vẻ bóng bẩy bề ngoài của 169 đánh lừa rằng chúng mỏng manh dễ vỡ nhé, đây là một tỏng những dòng Armor cứng cáp nhất trong các dòng vỏ dày bình dân với lớp vỏ đồng nguyên khối được nhà sản xuất đúc cho mang độ dày lên tới 16mm, ấn tượng gấp 1,5 lần các dòng bình thường khác. Đây thực sự là một chiếc áo giáp giá trị mà 169 được khoác lên mình, vừa bóng bẩy điệu đà, vừa dày dặn với khả năng chịu lực tuyệt đối', NULL),
(3, '2022-10-19 08:16:38', '2022-10-19 08:16:38', 'image_1666192598_Zippo Armor Classic Chrome 167.jpg', 'Zippo Armor Classic Chrome 167', 13, 750000, 2, 'Vỏ đồng thau, nền mạ chrome bóng', 'Mỹ', 'Zippo là hãng bật lửa có tiếng nhất trên thế giới chính bởi chất lượng cũng như sự đa dạng của sản phẩm. Zippo Armor 167 Classic Chrome là một sản phẩm rất được các đấng anh hào ưa dùng. Sau đây chúng ta cùng đi tìm hiểu về loại bật lửa này. Sử dụng mẫu bật lửa zippo Armor 167 Classic Chrome bạn có thể tự khắc hình trên bật lửa thỏa sức sáng tạo', NULL),
(4, '2022-10-19 08:21:55', '2022-10-19 08:21:55', 'image_1666192915_Zippo Tumbled Brass Armor 28496.jpg', 'Zippo Tumbled Brass Armor 28496', 9, 850000, 2, 'Đồng thau nguyên khối', 'Mỹ', 'Là dòng sản phẩm bật lửa vỏ dày hơn tiêu chuẩn 1,5 lần nên sản phẩm năng và cầm rất chắc tay. Hàng mới, chính hãng Mỹ 100%, Hộp dạng quà tặng thân thiện môi trường đầy đủ (01 Bật lửa; 01 HDSD) Dùng phụ kiện chính hãng Zippo tumbled brass có trữ xăng hiệu quả, đánh lửa và chống gió tốt nhất.', NULL),
(5, '2022-10-19 08:26:02', '2022-10-19 08:26:02', 'image_1666193162_Zippo Eye of Providence.jpg', 'Zippo Eye of Providence', 18, 1700000, 2, 'Vỏ đồng thau, nền mạ vàng', 'Mỹ', 'Zippo eye of providence lại là một sản phẩm siêu cấp cho các tín đồ zippo yêu thích sự thiêng liêng ma mị thuộc dòng sản phẩm zippo cao cấp làm chất liệu đồng thau nguyên khối thuộc dòng armor vỏ dày cấu tạo của zippo Zippo eye of providence dày hơn 1,5 lần so với các loại bật nửa thông thường. Điểm đặc biệt của Zippo eye of providence là nằm ở con mắt của Providence hay tất cả những con mắt nhìn thấy đại diện cho sự quan phòng thiêng liêng, hoặc ý tưởng rằng ai đó luôn dõi theo bạn. Thiết kế này đưa ánh mắt thần thánh từ một viên pha lê Swarovski màu xanh lá cây vào một kim tự tháp được chạm khắc sâu trên chiếc bật lửa Brass High ®, và cũng có một miếng chèn vàng lóe lên.', 2),
(6, '2022-10-19 08:30:28', '2022-10-19 08:30:28', 'image_1666193428_Zippo Luxury Diamond Design 29671.jpg', 'Zippo Luxury Diamond Design 29671', 16, 3700000, 2, 'Đồng thau nguyên khối', 'Mỹ', 'Zippo Luxury Diamond Design là dòng vỏ dày mạ vàng, được hãng Zippo dùng công nghệ khắc cao cấp 360 độ xung quanh chiếc Zippo để tạo ra một chiếc Zippo cực kỳ độc đáo, bên cạnh đó là một viên đá hình thoi màu đỏ nổi bật trên tone vàng. Hộp giấy Zippo cao cấp đi kèm có thể sử dụng như hộp quà tặng. Điểm đặc biệt của chiếc bật lửa Zippo Luxury Diamond Design là trông giống như một hình dạng kim cương đỏ mờ được đặt vào trong chiếc bật lửa Một miếng chèn mạ vàng khen ngợi và hoàn thiện vẻ ngoài cao cấp và bao bì sang trọng làm nổi bật thiết kế bao bọc. Bật lửa Zippo Luxury Diamond Design dày khoảng 1,5 lần so với các dòng bật lửa zippo thông thường và có đá lửa và bấc cao cấp Zippo chính hãng.', NULL),
(7, '2022-10-19 08:33:38', '2022-10-19 08:33:38', 'image_1666193618_Zippo Hexagon Design 49021.jpg', 'Zippo Hexagon Design 49021', 16, 1700000, 2, 'Đồng thau nguyên khối', 'Mỹ', 'Zippo Hexagon Design 49021 siêu phẩm của thương hiệu mang đến cho các tín đồ yêu thích bật lửa. Sử dụng chất liệu đồng thau nền mạ Black Ice®. Chắc hẳn bạn sẽ bị lạc trong thiết kế Black Ice® đầy mê hoặc này! Sử dụng quy trình Deep Carve đặc trưng, các nghệ sĩ Zippo đã có thể tạo ra một thiết kế hình lục giác bên trong một thiết kế hình lục giác khác. Đối với dòng sản phẩm Zippo Hexagon Design 49021 làm đốn tim các tín đồ bằng sự tinh tế màu sắc thì đặc biệt Zippo Hexagon Design 49021 có khả năng kháng gió và hoạt động tốt trên mọi điều kiện thời tiết. Với thiết kế vỏ hộp giấy dạng quà tặng sẽ mang đến cho bạn sự lựa chọn tuyệt vời khi sở hữu Zippo Hexagon Design 49021', NULL),
(8, '2022-10-19 08:37:19', '2022-10-19 08:37:19', 'image_1666193839_Zippo ốp hình ngựa mạ vàng, nền men đỏ ZBT-5-3A.jpg', 'Zippo ốp hình ngựa mạ vàng, nền men đỏ ZBT-5-3A', 16, 2600000, 1, 'Đồng thau nguyên khối', 'Nhật bản', 'Một siêu phẩn thực sự với nghệ thuật đỉnh cao của nghệ nhân làng nghề và ý tưởng chế tác độc đáo từ văn hóa phương Đông bật lửa Zippo xuất Nhật supper cao cấp ZBT-5-3A sẽ là một món đồ mà gã đàn ông nào cũng mong muốn sở hữu. Vẻ quý phái của ZBT-5-3A được hiện hữu ngay từ lớp vỏ ngoài với hình ảnh ngựa lồng cực kỳ mạnh mẽ được ốp trên nền cẩm men đá đỏ rất rất sang trọng, không chỉ đơn thuần thế ngựa ốp và các cạnh của sản phẩm còn được các nghệ nhân Nhật Bản mạ lên một lớp vàng sáng bóng để tăng giá trị đẳng cấp của ZBT-5-3A', NULL),
(9, '2022-10-19 08:41:13', '2022-10-19 08:41:13', 'image_1666194073_Zippo Luxury Diamond Design 29671.jpg', 'Zippo Luxury Diamond Design 29671', 16, 3700000, 1, 'Đồng thau nguyên khối', 'Mỹ', 'Zippo Luxury Diamond Design là dòng vỏ dày mạ vàng, được hãng Zippo dùng công nghệ khắc cao cấp 360 độ xung quanh chiếc Zippo để tạo ra một chiếc Zippo cực kỳ độc đáo, bên cạnh đó là một viên đá hình thoi màu đỏ nổi bật trên tone vàng. Hộp giấy Zippo cao cấp đi kèm có thể sử dụng như hộp quà tặng. Điểm đặc biệt của chiếc bật lửa Zippo Luxury Diamond Design là trông giống như một hình dạng kim cương đỏ mờ được đặt vào trong chiếc bật lửa Một miếng chèn mạ vàng khen ngợi và hoàn thiện vẻ ngoài cao cấp và bao bì sang trọng làm nổi bật thiết kế bao bọc. Bật lửa  Zippo Luxury Diamond Design dày khoảng 1,5 lần so với các dòng bật lửa zippo thông thường và có đá lửa và bấc cao cấp Zippo chính hãng.', NULL),
(10, '2022-10-19 08:44:51', '2022-10-19 08:44:51', 'image_1666194291_Zippo Katamen Ryu Red - ZA-3-35A.jpg', 'Zippo Katamen Ryu Red - ZA-3-35A', 16, 2000000, 1, 'Đồng thau nguyên khối', 'Nhật bản', 'Bật lửa Zippo ASIA là một sản phẩm được hình thành và chế tác trên phôi Zippo được nhập khẩu chính hãng từ Mỹ với chất liệu vỏ đồng thau, ruột thép. Sau đó được thiết kế và trang trí theo nhiều công nghệ khác nhau bởi các nhà chế tác tại các nước Asia như Nhật Bản, Hàn Quốc… Phiên bản với các thiết kế đặc biệt được giới thiệu và chỉ phát hành tại các nước Châu Á. Được đóng gói trong một hộp quà tặng. Để có hiệu suất tối ưu, hãy đổ đầy nhiên liệu bật lửa Zippo. Bật lửa chống gió Zippo chính hãng với tiếng “click” đặc trưng của Zippo. Tất cả các cấu trúc bằng kim loại; thiết kế chống gió hoạt động hầu như ở mọi nơi. Có thể nạp lại cho suốt đời sử dụng; để có hiệu suất tối ưu, chúng tôi khuyên bạn nên sử dụng nhiên liệu, đá lửa và bấc Zippo chính hãng.', NULL),
(11, '2022-10-19 08:49:55', '2022-10-19 08:49:55', 'image_1666194595_Zippo Bolts Design 29672.jpg', 'Zippo Bolts Design 29672', 16, 2800000, 1, 'Đồng thau nguyên khối', 'Mỹ', 'Bật lửa Zippo Bolts có thiết kế vô cùng đặc biệt thuộc dòng zippo vỏ dày cao cấp dòng tiêu chuẩn 1.5 lần Zippo Bolts Design là dòng  mạ Chrome sáng bóng được hãng Zippo sử dụng công nghệ khắc cao cấp 360 độ xung quanh chiếc Zippo để tạo lên những đường khắc và logo Zippo đầy độc đáo ở 2 mặt, bên cạnh đó là ngọn lửa màu đỏ ở cạnh Zippo. Hộp giấy Zippo cao cấp đi kèm có thể sử dụng như hộp quà tặng. Zippo Zippo Bolts có âm thanh đặc trưng trầm ấm, tiếng đóng nắp mạnh mẽ. Chống gió tốt trong nhiều môi trường. Vỏ Zippo: Dòng vỏ đồng thau dày hơn 1.5 dòng tiêu chuẩn, đầu tròn, mộc đáy lồi. Bản lề 5 chấu. Ruột Zippo: Ruột thép không gỉ tiêu chuẩn với buồng đốt 16 lỗ (8 lỗ mỗi bên). Mộc Đáy Zippo: Mộc đáy có Logo Zippo, kí hiệu và tháng năm được sản xuất. Hộp Đựng Zippo: Hộp đựng cao cấp, hợp đựng màu đỏ, nắp hộp màu đen được trang trí logo Zippo và chữ “z”, trong hộp có 1 giấy hướng dẫn sử dụng, có ghi chính sách bảo hành của Zippo. Sau hộp có dán tem bảo hành của nhà phân phối.', NULL),
(12, '2022-10-19 09:29:39', '2022-10-19 09:29:39', 'image_1666196979_Zippo High Polish Green Elegant Dragon 49054.jpg', 'Zippo High Polish Green Elegant Dragon 49054', 16, 2800000, 1, 'Đồng thau nguyên khối', 'Mỹ', 'Bật lửa Zippo Bolts có thiết kế vô cùng đặc biệt thuộc dòng zippo vỏ dày cao cấp dòng tiêu chuẩn 1.5 lần Zippo Bolts Design là dòng  mạ Chrome sáng bóng được hãng Zippo sử dụng công nghệ khắc cao cấp 360 độ xung quanh chiếc Zippo để tạo lên những đường khắc và logo Zippo đầy độc đáo ở 2 mặt, bên cạnh đó là ngọn lửa màu đỏ ở cạnh Zippo. Hộp giấy Zippo cao cấp đi kèm có thể sử dụng như hộp quà tặng. Zippo Zippo Bolts có âm thanh đặc trưng trầm ấm, tiếng đóng nắp mạnh mẽ. Chống gió tốt trong nhiều môi trường. Vỏ Zippo: Dòng vỏ đồng thau dày hơn 1.5 dòng tiêu chuẩn, đầu tròn, mộc đáy lồi. Bản lề 5 chấu. Ruột Zippo: Ruột thép không gỉ tiêu chuẩn với buồng đốt 16 lỗ (8 lỗ mỗi bên). Mộc Đáy Zippo: Mộc đáy có Logo Zippo, kí hiệu và tháng năm được sản xuất. Hộp Đựng Zippo: Hộp đựng cao cấp, hợp đựng màu đỏ, nắp hộp màu đen được trang trí logo Zippo và chữ “z”, trong hộp có 1 giấy hướng dẫn sử dụng, có ghi chính sách bảo hành của Zippo. Sau hộp có dán tem bảo hành của nhà phân phối.', NULL),
(13, '2022-10-19 09:42:19', '2022-10-19 09:42:19', 'image_1666197739_Zippo Classic High Polish Chrome - 250.jpg', 'Zippo Classic High Polish Chrome - 250', 16, 650000, 3, 'Đồng thau nguyên khối', 'Mỹ', 'Bật lửa Zippo Classic High Polish Chrome - 250, sử dụng nguyên liệu đồng thau nguyên khối mạ chrome cao cấp, tạo cảm giác sang trọng, khả năng cằm nắm chắc tay. Sản phẩm nhập khẩu từ Mỹ đảm bảo chất lượng. Được thiết kế với nét đặc trưng chính là một sự hoàn thiện hoàn hảo và rực rỡ. Phiên bản High Polish Chrome là một trong những mẫu phổ biến nhất và dần trở thành một dòng sản phẩm chính của Zippo kể từ năm 1938.', NULL),
(14, '2022-10-19 09:56:47', '2022-10-19 09:56:47', 'image_1666198607_Zippo Brass Venetian Design - 352B.jpg', 'Zippo Brass Venetian Design - 352B', 16, 900000, 3, 'Đồng thau nguyên khối', 'Mỹ', 'Zippo Brass Venetian Design - 352B thuộc dòng bật lửa Zippo đồng vàng hoa văn phong cách Ý, hàng chính hãng Zippo Mỹ, bảo hành trọn đời, bán lẻ giá sỉ. Mẫu sản phẩm được giới thiệu vào năm 1974, mẫu họa tiết hoa văn ngược và vượt thời gian của mẫu bật lửa Venetian tiếp tục trở thành mẫu thiết kế bật lửa thu hút nhất toàn cầu mà Zippo từng ra mắt. Bật lửa Venetian High Polish Brass có bảng tùy chỉnh được đánh bóng cao có thể được khắc chữ cái đầu, một tin nhắn ngắn hoặc một ngày quan trọng làm món quà cho một người nào đó.', 2),
(15, '2022-10-19 10:03:28', '2022-11-12 11:58:32', 'image_1666199008_Zippo High Polish Solid Brass 254.jpg', 'Zippo High Polish Solid Brass 254', 16, 750000, 3, 'Đồng thau nguyên khối', 'Mỹ', 'Mẫu bật lửa Zippo High Polish Solid Brass 254 với chữ khắc solid brass tuy đơn giản nhưng rất tinh tế  và thu hút được nhiều khách hàng. Tuy là mẫu bật lửa phổ thông nhưng sản phẩm này vẫn được đánh giá rất cao về chất lượng cũng như kiểu dáng sản phẩm.', NULL),
(16, '2022-10-19 10:12:21', '2022-10-19 10:12:21', 'image_1666199541_Zippo Brushed Brass Vintage with Slashes - 240.jpg', 'Zippo Brushed Brass Vintage with Slashes - 240', 18, 700000, 3, 'Đồng thau nguyên khối', 'Mỹ', 'Zippo Brushed Brass Vintage with Slashes 240 với chất liệu vỏ đồng thau,nền mạ đồng xước ngang với thiết kế tái bản lại những mẫu Zippo sản xuất vào năm 1937. Thiết kế vuông độc đáo là một trong những mẫu được ưa chuộng nhất. Là dòng zippo phổ thông và được nhiều người mua nhất trong năm vừa qua tại zippovn.com. Tuy sản phẩm có giá rẻ nhưng chất liệu và thiết kế của sản phẩm thì cực tốt và chất lượng.', NULL),
(17, '2022-10-19 10:21:22', '2022-10-19 10:21:22', 'image_1666200082_Zippo Clover High Polish Chrome Design - 24699.jpg', 'Zippo Clover High Polish Chrome Design - 24699', 18, 850000, 3, 'Đồng thau nguyên khối', 'Mỹ', 'Zippo Clover High Polish Chrome Design - 24699 với chất liệu vỏ đồng thau ,nền mạ chrome bóng với thiết kế khắc trang trí, in cỏ 4 lá tượng trưng cho sự may mắn. Thiết kế cỏ bốn lá này được tạo ra bằng cách sử dụng cả hình ảnh màu và phương pháp khắc dấu khắc tự động..', NULL),
(18, '2022-10-19 10:30:09', '2022-10-19 10:30:09', 'image_1666200609_Zippo Classic Candy Apple Red - 21063.jpg', 'Zippo Classic Candy Apple Red - 21063', 18, 850000, 3, 'Đồng thau nguyên khối', 'Mỹ', 'Zippo Candy Apple Red - 21063 dòng bật lửa zippo classics, với màu sắc nổi bật lớp sơn mờ màu đỏ đậm trên thiết kế Zippo thu hút sự chú ý của người sử dụng. Sử dụng chất liệu đồng thau để làm vỏ cho chiếc bật lửa Zippo, nhằm đem đến sử trải nghiệm vô cùng đặt biệt Zippo đã mang đến công nghệ sơ tĩnh điện độc đáo và phủ bóng làm cho chiếc Zippo thêm phầm sang trọng và độc đáo.', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `salename` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `percent` int(11) NOT NULL,
  `end_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `created_at`, `updated_at`, `salename`, `percent`, `end_date`) VALUES
(2, '2022-10-23 07:24:52', '2022-10-23 07:24:52', 'summer_discount', 30, NULL),
(3, '2022-11-13 00:11:35', '2022-11-13 00:11:35', 'dfgrthre', 43, NULL),
(4, '2022-11-13 00:11:36', '2022-11-13 00:11:36', 'dfgrthre', 43, NULL),
(5, '2022-11-13 00:11:40', '2022-11-13 00:11:40', 'dfgrthre', 341, NULL),
(6, '2022-11-13 00:15:27', '2022-11-13 02:53:07', 'winter_discount', 35, '2022-11-30');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phonenumber` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `gender`, `phonenumber`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(37, 'tien23851', 'Nam', '0932430072', 'tien23851@gmail.com', NULL, 'tien1234', '9ABXlfG5TSEHfIOLznaWAj7jVAp3V1KkRMGHLSWv', '2022-10-29 12:39:07', '2022-11-13 07:50:53');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD PRIMARY KEY (`order_id`,`product_id`),
  ADD KEY `orderdetails_order_id_index` (`order_id`),
  ADD KEY `orderdetails_product_id_index` (`product_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_user_id_index` (`user_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `products_ibfk_1` (`discount`),
  ADD KEY `category` (`category`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_phonenumber_unique` (`phonenumber`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD CONSTRAINT `orderdetails_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orderdetails_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`discount`) REFERENCES `sales` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
