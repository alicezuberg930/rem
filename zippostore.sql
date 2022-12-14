-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 13, 2022 at 03:55 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 7.4.33

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
  `category_name` varchar(100) NOT NULL,
  `category_description` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `category_name`, `category_description`) VALUES
(1, 'BẬT LỬA ZIPPO CAO CẤP', 'Bật lửa zippo cao cấp rất mắc tiền và sang trọng'),
(2, 'BẬT LỬA ZIPPO ARMOR', 'bật lửa armor có vỏ rất dày'),
(3, 'BẬT LỬA ZIPPO PHỔ THÔNG', 'zippo phỗ thông thường dành cho tầng lớp trung lưu'),
(7, 'Danh mục A', 'danh mục a rất là A'),
(8, 'Danh mục B', 'danh mục B rất là b'),
(9, 'Danh mục C', 'danh mục C rất là C'),
(35, 'Danh mục D', 'Danh mục D rất là D'),
(36, 'Danh mục E', 'Danh mục E rất là E'),
(37, 'Danh mục F', 'Danh mục F rất là F'),
(38, 'Danh mục G', 'Danh mục G rất là G'),
(39, 'Danh mục I', 'Danh mục I rất là I'),
(40, 'Danh mục J', 'Danh mục J rất là J'),
(41, 'Thương hiệu AB', 'Danh mục AB');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `phonenumber` varchar(10) NOT NULL,
  `email` varchar(255) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_as` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `username`, `phonenumber`, `email`, `gender`, `password`, `role_as`) VALUES
(1, 'Lê Văn Tiến', '0932430072', 'tien51@gmail.com', 'Nam', 'tien1234', 3),
(2, 'Nguyễn Văn Tình', '0932430071', 'tinh235@gmail.com', 'Nam', 'tinh1234', 1),
(3, 'Lê Thị Hoa', '0939711713', 'hoaktvn@gmail.com', 'Nữ', 'hoa1234', 1),
(4, 'Lê Ngọc Toàn', '0932451234', 'toanktvn@gmail.com', 'Nam', 'toan1234', 2),
(5, 'Nguyễn Văn Tiến', '0932433244', 'tienktvn@gmail.com', 'Nam', 'tien1234', 4),
(6, 'Nguyễn Giáp Tài', '0932248511', 'taiktvn2@gmail.com', 'Nam', 'tai1234', 2),
(8, 'Bùi Minh Trí', '0923455532', 'minhtri423@gmail.com', 'Nam', 'tai1234', 1),
(9, 'Nguyễn Đình Trí', '0923434212', 'dinhtri382@gmail.com', 'Nam', 'dinhtri123', 2),
(10, 'Lâm Doanh Sâm', '0923453321', 'doanhsam432@gmail.com', 'Nữ', 'sam1234', 2),
(12, 'Nguyễn Minh Thư', '0234839281', 'minhthu942@gmail.com', 'Nữ', 'sam1234', 3);

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `role_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id`, `role_name`) VALUES
(1, 'Quản lý bán hàng'),
(2, 'Quản lý kho'),
(3, 'Quản lý admin'),
(4, 'Quản lý giao hàng');

-- --------------------------------------------------------

--
-- Table structure for table `import_slips`
--

CREATE TABLE `import_slips` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `supplier_id` bigint(20) UNSIGNED NOT NULL,
  `employee_id` bigint(20) UNSIGNED NOT NULL,
  `import_date` datetime NOT NULL,
  `total_price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `import_slips`
--

INSERT INTO `import_slips` (`id`, `supplier_id`, `employee_id`, `import_date`, `total_price`) VALUES
(1, 1, 1, '2022-11-20 11:13:35', 6500000),
(2, 1, 2, '2022-11-20 11:14:09', 6000000),
(3, 2, 2, '2022-11-20 11:16:59', 15000000),
(4, 2, 1, '2022-11-20 11:17:23', 17600000),
(5, 2, 1, '2022-11-20 11:23:07', 19000000),
(6, 3, 1, '2022-11-22 09:38:48', 21000000),
(7, 2, 1, '2022-11-30 12:00:00', 5550000),
(8, 4, 1, '2022-11-28 12:00:00', 5250000),
(9, 1, 1, '2022-11-30 12:00:00', 2750000),
(10, 4, 1, '2022-11-29 12:00:00', 1150000),
(11, 4, 1, '2022-11-20 12:00:00', 23100000),
(12, 4, 1, '2022-11-26 12:00:00', 12000000),
(13, 1, 4, '2022-11-29 12:00:00', 1750000),
(14, 1, 4, '2022-11-29 12:00:00', 1250000),
(15, 2, 4, '2022-11-30 12:00:00', 10500000),
(16, 2, 4, '2022-11-30 12:00:00', 12600000);

-- --------------------------------------------------------

--
-- Table structure for table `import_slip_details`
--

CREATE TABLE `import_slip_details` (
  `import_slip_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `import_quantity` int(11) NOT NULL,
  `import_price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `import_slip_details`
--

INSERT INTO `import_slip_details` (`import_slip_id`, `product_id`, `import_quantity`, `import_price`) VALUES
(1, 1, 20, 340000),
(2, 2, 20, 340000),
(3, 3, 20, 340000),
(4, 4, 20, 340000),
(5, 5, 20, 340000),
(6, 1, 15, 1400000),
(7, 13, 15, 370000),
(8, 1, 14, 375000),
(9, 4, 11, 250000),
(10, 18, 5, 230000),
(11, 8, 21, 1100000),
(12, 18, 10, 1200000),
(13, 37, 7, 250000),
(14, 13, 5, 250000),
(15, 8, 5, 2100000),
(16, 16, 6, 2100000);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, 'aaa', 1);

-- --------------------------------------------------------

--
-- Table structure for table `orderdetails`
--

CREATE TABLE `orderdetails` (
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `product_price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orderdetails`
--

INSERT INTO `orderdetails` (`order_id`, `product_id`, `quantity`, `product_price`) VALUES
(3, 15, 3, 700000),
(4, 14, 2, 900000),
(4, 15, 1, 700000),
(4, 16, 1, 700000),
(4, 17, 1, 850000),
(5, 14, 2, 900000),
(5, 15, 1, 700000),
(5, 16, 1, 700000),
(5, 17, 1, 850000),
(6, 14, 1, 900000),
(6, 15, 1, 700000),
(6, 16, 1, 700000),
(7, 16, 1, 700000),
(8, 13, 1, 650000),
(8, 14, 2, 900000),
(10, 18, 1, 850000),
(11, 18, 1, 850000),
(18, 13, 1, 650000),
(18, 14, 1, 900000),
(18, 15, 1, 750000),
(18, 16, 1, 700000),
(19, 13, 1, 650000),
(19, 14, 1, 900000),
(19, 15, 1, 750000),
(19, 16, 1, 700000),
(20, 13, 1, 650000),
(20, 14, 1, 900000),
(20, 15, 1, 750000),
(20, 16, 1, 700000),
(21, 13, 1, 650000),
(21, 14, 1, 900000),
(21, 15, 1, 750000),
(21, 16, 1, 700000),
(24, 13, 1, 650000),
(24, 14, 1, 900000),
(24, 15, 1, 750000),
(24, 16, 1, 700000),
(25, 13, 1, 650000),
(25, 14, 1, 900000),
(25, 15, 1, 750000),
(25, 16, 1, 700000),
(26, 13, 1, 650000),
(26, 14, 1, 900000),
(26, 15, 1, 750000),
(26, 16, 1, 700000),
(27, 13, 1, 650000),
(27, 14, 1, 900000),
(27, 15, 1, 750000),
(27, 16, 1, 700000),
(28, 13, 1, 650000),
(28, 14, 1, 900000),
(28, 15, 1, 750000),
(28, 16, 1, 700000),
(29, 13, 1, 650000),
(29, 14, 1, 900000),
(29, 15, 1, 750000),
(29, 16, 1, 700000),
(30, 13, 1, 650000),
(30, 14, 1, 900000),
(30, 15, 1, 750000),
(30, 16, 1, 700000),
(31, 13, 1, 650000),
(31, 14, 1, 900000),
(31, 15, 1, 750000),
(31, 16, 1, 700000),
(32, 13, 1, 650000),
(32, 14, 1, 900000),
(32, 15, 1, 750000),
(32, 16, 1, 700000),
(33, 13, 1, 650000),
(33, 14, 1, 900000),
(33, 15, 1, 750000),
(33, 16, 1, 700000),
(34, 13, 1, 650000),
(34, 14, 1, 900000),
(34, 15, 1, 750000),
(34, 16, 1, 700000),
(35, 13, 1, 650000),
(35, 14, 1, 900000),
(35, 15, 1, 750000),
(35, 16, 1, 700000),
(36, 13, 1, 650000),
(36, 14, 1, 900000),
(36, 15, 1, 750000),
(36, 16, 1, 700000),
(37, 13, 1, 650000),
(37, 14, 1, 900000),
(37, 15, 1, 750000),
(37, 16, 1, 700000),
(38, 13, 1, 650000),
(38, 14, 1, 900000),
(38, 15, 1, 750000),
(38, 16, 1, 700000),
(39, 15, 1, 750000),
(39, 16, 1, 700000),
(40, 15, 1, 750000),
(40, 16, 1, 700000),
(41, 15, 1, 750000),
(41, 16, 1, 700000),
(42, 15, 1, 750000),
(42, 16, 1, 700000),
(43, 15, 1, 750000),
(43, 16, 1, 700000),
(44, 15, 1, 750000),
(44, 16, 1, 700000),
(45, 15, 1, 750000),
(45, 16, 1, 700000),
(46, 15, 1, 750000),
(46, 16, 1, 700000),
(47, 16, 1, 700000),
(48, 16, 2, 700000),
(51, 16, 2, 700000),
(52, 16, 2, 700000),
(53, 18, 1, 850000),
(53, 37, 1, 1700000),
(54, 18, 1, 850000),
(54, 37, 1, 1700000),
(55, 1, 1, 3800000),
(56, 1, 1, 3800000),
(57, 16, 1, 700000),
(57, 17, 1, 850000),
(57, 37, 1, 1700000),
(58, 15, 1, 750000),
(58, 16, 1, 700000),
(58, 17, 1, 850000),
(59, 17, 1, 850000),
(59, 37, 1, 1700000),
(60, 16, 2, 700000),
(60, 17, 1, 850000),
(61, 16, 1, 700000),
(61, 17, 1, 850000),
(61, 37, 1, 1700000),
(62, 18, 2, 850000),
(62, 37, 1, 1700000),
(63, 18, 21, 850000),
(63, 37, 1, 1700000),
(64, 18, 1, 850000),
(64, 37, 1, 1700000),
(65, 9, 1, 3700000),
(65, 10, 3, 2000000),
(66, 16, 1, 700000),
(66, 17, 1, 850000),
(67, 18, 1, 850000),
(67, 37, 1, 1650000),
(68, 18, 1, 850000),
(68, 37, 1, 1650000),
(69, 11, 1, 2800000),
(69, 12, 1, 2800000),
(70, 9, 1, 3700000),
(70, 11, 1, 2800000),
(71, 16, 1, 700000),
(71, 37, 1, 1650000),
(72, 9, 1, 3700000),
(72, 16, 4, 700000),
(72, 17, 1, 850000),
(73, 9, 1, 3700000),
(73, 16, 4, 700000),
(73, 17, 1, 850000),
(74, 8, 1, 2600000),
(74, 9, 1, 3700000),
(74, 11, 1, 2800000);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_date` datetime NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `phone_number` varchar(10) NOT NULL,
  `address` text NOT NULL,
  `quantity` int(11) NOT NULL,
  `total_price` bigint(20) NOT NULL,
  `status` smallint(6) NOT NULL DEFAULT 0,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(100) NOT NULL,
  `employee_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_date`, `fullname`, `phone_number`, `address`, `quantity`, `total_price`, `status`, `user_id`, `email`, `employee_id`) VALUES
(3, '2022-11-26 02:53:12', 'Lê Ngọc Toàn', '0921123435', 'Thành phố Hồ Chí Minh Quận 10 Phường 05', 3, 2100000, 4, 37, 'tien23851@gmail.com', NULL),
(4, '2022-11-26 13:05:50', 'Nguyễn Thị Minh Thư', '0921123435', 'Thành phố Hồ Chí Minh Quận Phú Nhuận Phường 11', 5, 3510000, 4, 37, 'hentaiktvn123@gmail.com', NULL),
(5, '2022-11-26 13:05:37', 'Nguyễn Vĩnh Tiến', '0921123435', 'Thành phố Đà Nẵng Quận Cẩm Lệ Phường Hòa Phát', 5, 3510000, 3, 39, 'nguyenvinhtien431@gmail.com', NULL),
(6, '2022-11-26 03:37:52', 'Nguyễn Thị Minh Thư', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Liên', 3, 2030000, 4, 37, 'tienn3605@gmail.com', NULL),
(7, '2022-11-26 03:54:51', 'Nguyễn Thị Minh Thư', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Bắc', 1, 700000, 1, 37, 'minhthu@gmail.com', NULL),
(8, '2022-10-26 02:35:49', 'Nguyễn Thị Minh Thư', '0921123435', 'Tỉnh An Giang Huyện An Phú Xã Đa Phước', 3, 1910000, 1, 39, 'minhthu@gmail.com', NULL),
(10, '2022-09-26 03:54:49', 'Nguyễn Thị Minh Thư', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Bắc', 1, 850000, 1, 37, 'minhthu@gmail.com', NULL),
(11, '2022-11-26 03:54:47', 'Nguyễn Thị Minh Thư', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Bắc', 1, 850000, 1, 37, 'minhthu@gmail.com', NULL),
(18, '2022-10-26 04:04:17', 'Lê Ngọc Toàn', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Bắc', 4, 2730000, 1, 37, 'toanktvn@gmail.com', NULL),
(19, '2022-08-26 04:04:19', 'Lê Ngọc Toàn', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Bắc', 4, 2730000, 1, 37, 'toanktvn@gmail.com', NULL),
(20, '2022-11-26 13:10:45', 'Lê Ngọc Toàn', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Bắc', 4, 2730000, 1, 37, 'toanktvn@gmail.com', 3),
(21, '2022-11-26 11:47:47', 'Lê Ngọc Toàn', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Bắc', 4, 2730000, 1, 37, 'toanktvn@gmail.com', NULL),
(24, '2022-11-26 11:52:14', 'Lê Ngọc Toàn', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Bắc', 4, 2730000, 2, 37, 'toanktvn@gmail.com', NULL),
(25, '2022-11-26 11:52:21', 'Lê Ngọc Toàn', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Bắc', 4, 2730000, 2, 37, 'toanktvn@gmail.com', NULL),
(26, '2022-06-26 12:54:18', 'Lê Ngọc Toàn', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Bắc', 4, 2730000, 1, 37, 'toanktvn@gmail.com', NULL),
(27, '2022-06-26 12:57:35', 'Lê Ngọc Toàn', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Bắc', 4, 2730000, 1, 37, 'toanktvn@gmail.com', NULL),
(28, '2022-11-25 11:21:27', 'Lê Ngọc Toàn', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Bắc', 4, 2730000, 2, 37, 'toanktvn@gmail.com', NULL),
(29, '2022-11-25 11:21:28', 'Lê Ngọc Toàn', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Bắc', 4, 2730000, 2, 37, 'toanktvn@gmail.com', NULL),
(30, '2022-11-25 11:21:44', 'Lê Ngọc Toàn', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Bắc', 4, 2730000, 1, 37, 'toanktvn@gmail.com', NULL),
(31, '2022-11-19 03:41:35', 'Lê Ngọc Toàn', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Bắc', 4, 2730000, 0, 37, 'toanktvn@gmail.com', NULL),
(32, '2022-11-19 03:41:48', 'Lê Ngọc Toàn', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Bắc', 4, 2730000, 0, 37, 'toanktvn@gmail.com', NULL),
(33, '2022-11-19 03:41:57', 'Lê Ngọc Toàn', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Bắc', 4, 2730000, 0, 37, 'toanktvn@gmail.com', NULL),
(34, '2022-11-19 03:42:41', 'Lê Ngọc Toàn', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Bắc', 4, 2730000, 0, 37, 'toanktvn@gmail.com', NULL),
(35, '2022-11-19 03:43:00', 'Lê Ngọc Toàn', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Bắc', 4, 2730000, 0, 37, 'toanktvn@gmail.com', NULL),
(36, '2022-11-19 03:43:23', 'Lê Ngọc Toàn', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Bắc', 4, 2730000, 0, 37, 'toanktvn@gmail.com', NULL),
(37, '2022-11-19 03:43:40', 'Lê Ngọc Toàn', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Bắc', 4, 2730000, 0, 37, 'toanktvn@gmail.com', NULL),
(38, '2022-11-19 03:44:50', 'Lê Ngọc Toàn', '0921123435', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Bắc', 4, 2730000, 0, 37, 'toanktvn@gmail.com', NULL),
(39, '2022-01-26 12:57:17', 'Nguyen Vinh Tien', '0932430072', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Khương', 2, 1450000, 1, 37, 'tien23851@gmail.com', NULL),
(40, '2022-11-19 03:57:10', 'Nguyen Vinh Tien', '0932430072', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Khương', 2, 1450000, 0, 37, 'tien23851@gmail.com', NULL),
(41, '2022-11-19 03:57:27', 'Nguyen Vinh Tien', '0932430072', 'Thành phố Đà Nẵng Huyện Hòa Vang Xã Hòa Khương', 2, 1450000, 0, 37, 'tien23851@gmail.com', NULL),
(42, '2022-11-26 03:57:30', 'Nguyễn Giáp Tài', '0932134435', 'Tỉnh Điện Biên Huyện Điện Biên Xã Pom Lót', 2, 1450000, 0, 37, 'tien23851@gmail.com', NULL),
(43, '2022-11-26 03:57:32', 'Nguyễn Giáp Tài', '0932134435', 'Tỉnh Điện Biên Huyện Điện Biên Xã Pom Lót', 2, 1450000, 0, 37, 'tien23851@gmail.com', NULL),
(44, '2022-11-26 03:57:34', 'Nguyễn Giáp Tài', '0932134435', 'Tỉnh Điện Biên Huyện Điện Biên Xã Pom Lót', 2, 1450000, 0, 37, 'tien23851@gmail.com', NULL),
(45, '2022-11-21 00:39:24', 'Nguyễn Giáp Tài', '0932134435', 'Tỉnh Điện Biên Huyện Điện Biên Xã Pom Lót', 2, 1450000, 0, 37, 'minhthu@gmail.com', NULL),
(46, '2022-11-26 03:57:36', 'Nguyễn Giáp Tài', '0932134435', 'Tỉnh Điện Biên Huyện Điện Biên Xã Pom Lót', 2, 1450000, 0, 37, 'tien23851@gmail.com', NULL),
(47, '2022-11-26 03:57:38', 'Nguyễn Thị Minh Thư', '0921123435', 'Tỉnh Điện Biên Huyện Điện Biên Xã Pom Lót', 1, 700000, 0, 37, 'tien23851@gmail.com', NULL),
(48, '2022-11-23 07:47:19', 'Nguyễn Thị Minh Thư', '0921134223', 'Thành phố Cần Thơ Quận Ninh Kiều Phường An Cư', 2, 1400000, 0, 37, 'tien23851@gmail.com', NULL),
(51, '2022-11-26 03:57:52', 'Lê Ngọc Toàn', '0921123322', 'Thành phố Hà Nội Huyện Quốc Oai Xã Sài Sơn', 2, 1400000, 0, 37, 'toanktvn123@gmail.com', NULL),
(52, '2022-11-26 13:39:13', 'Lê Ngọc Toàn', '0921123322', 'Tỉnh Bình Thuận Huyện Bắc Bình Xã Phan Thanh', 2, 1400000, 4, 37, 'toanktvn123@gmail.com', NULL),
(53, '2022-11-26 03:57:54', 'Nguyễn Giáp Tài', '0921123435', 'Thành phố Cần Thơ Huyện Cờ Đỏ Thị trấn Cờ Đỏ', 2, 2550000, 0, 45, 'toanktvn123@gmail.com', NULL),
(54, '2022-11-26 03:57:55', 'Nguyễn Thị Minh Thư', '0921123435', '  Thành phố Cần Thơ Huyện Cờ Đỏ Thị trấn Cờ Đỏ', 2, 2550000, 0, 45, 'toanktvn123@gmail.com', NULL),
(55, '2022-11-26 03:57:56', 'Nguyễn Thị Minh Thư', '0921123435', 'Thành phố Cần Thơ Huyện Cờ Đỏ Thị trấn Cờ Đỏ', 1, 2470000, 0, 37, 'toanktvn123@gmail.com', NULL),
(56, '2022-11-26 03:57:59', 'Nguyễn Thị Minh Thư', '0921123435', 'Thành phố Hà Nội Huyện Thường Tín Xã Quất Động', 1, 2470000, 0, 37, 'toanktvn123@gmail.com', NULL),
(57, '2022-11-26 03:57:03', 'Nguyễn Duy Tân', '0921123435', 'Thành phố Đà Nẵng Quận Cẩm Lệ Phường Hòa An', 3, 3250000, 0, 37, 'minhthu@gmail.com', NULL),
(58, '2022-11-26 03:58:08', 'Nguyễn Thị Minh Thư', '0921123435', 'Tỉnh Bình Dương Huyện Phú Giáo Xã An Thái', 3, 2300000, 0, 37, 'tien23851@gmail.com', NULL),
(59, '2022-11-26 03:58:04', 'Nguyễn Duy Tân', '0921123435', 'Thành phố Đà Nẵng Quận Cẩm Lệ Phường Hòa Phát', 2, 2550000, 0, 37, 'tien23851@gmail.com', NULL),
(60, '2022-11-24 08:03:23', 'Nguyen Vinh Tien', '0932430072', 'Thành phố Hồ Chí Minh Quận Bình Tân Phường Bình Hưng Hòa', 3, 2250000, 0, 37, 'tien23851@gmail.com', NULL),
(61, '2022-11-25 01:53:05', 'Nguyễn Thị Minh Thư', '0921123435', 'Thành phố Cần Thơ Huyện Phong Điền Xã Giai Xuân', 3, 3250000, 0, 37, 'tien23851@gmail.com', NULL),
(62, '2022-11-25 03:17:41', 'Nguyễn Vĩnh Tiến', '0921123910', 'Thành phố Hồ Chí Minh Quận Gò Vấp Phường 10', 3, 3400000, 0, 48, 'tien23851@gmail.com', NULL),
(63, '2022-11-26 15:04:35', 'Nguyen Vinh Tien', '0932430072', 'Thành phố Hồ Chí Minh Quận Tân Phú Phường Hòa Thạnh', 22, 19550000, 1, 48, 'tien23851@gmail.com', 3),
(64, '2022-11-26 15:04:22', 'Nguyen Vinh Tien', '0932430072', 'Thành phố Hồ Chí Minh Quận Bình Tân Phường Tân Tạo A', 2, 2550000, 1, 48, 'tien23851@gmail.com', 3),
(65, '2022-11-26 14:55:58', 'Lê Ngọc Toàn', '0921123435', '  Thành phố Hồ Chí Minh Quận Bình Tân Phường Tân Tạo A', 4, 9700000, 2, 39, 'minhthu@gmail.com', 3),
(66, '2022-11-26 14:55:57', 'Lê Ngọc Toàn', '0932453292', 'Tỉnh Kon Tum Thành phố Kon Tum Phường Duy Tân', 2, 1550000, 2, 50, 'toanktkkt@gmail.com', 3),
(67, '2022-11-26 14:55:57', 'Nguyễn Vĩnh Tiến', '0932430072', 'Tỉnh Bình Dương Huyện Bắc Tân Uyên Xã Tân Lập', 2, 2500000, 2, 37, 'tien23851@gmail.com', 3),
(68, '2022-11-26 14:55:56', 'Nguyễn Vĩnh Tiến', '0932430072', 'Tỉnh Bình Dương Huyện Bắc Tân Uyên Xã Tân Lập', 2, 2500000, 2, 37, 'tien23851@gmail.com', 3),
(69, '2022-11-26 14:55:55', 'Nguyễn Vĩnh Tiến', '0932430072', 'Tỉnh An Giang Huyện Tri Tôn Xã Tân Tuyến', 2, 5600000, 2, 37, 'tien23851@gmail.com', 3),
(70, '2022-11-26 14:55:54', 'Nguyễn Vĩnh Tiến', '0932430072', 'Tỉnh Cà Mau Huyện Cái Nước Xã Tân Hưng Đông', 2, 6500000, 2, 37, 'tien23851@gmail.com', 3),
(71, '2022-11-26 14:56:01', 'Nguyễn Vĩnh Tiến', '0932430072', '  ', 2, 2350000, 2, 37, 'tien23851@gmail.com', 3),
(72, '2022-11-26 15:03:13', 'Nguyễn Vĩnh Tiến', '0932430072', '  ', 6, 7350000, 1, 37, 'tien23851@gmail.com', 3),
(73, '2022-11-26 15:00:56', 'Nguyễn Vĩnh Tiến', '0932430072', '  ', 6, 7350000, 1, 37, 'tien23851@gmail.com', 3),
(74, '2022-11-26 20:33:24', 'Nguyễn Vĩnh Tiến', '0932430072', 'Thành phố Đà Nẵng Quận Cẩm Lệ Phường Hòa An', 3, 9100000, 0, 37, 'tien23851@gmail.com', 3);

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(60) NOT NULL,
  `selector` varchar(16) NOT NULL,
  `expire` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`id`, `email`, `token`, `selector`, `expire`) VALUES
(11, 'starbutterfly652@gmail.com', '$2y$10$ourc0Jl3oC63N0YWsGwKZe6LtPWchd3ous6175TCgTSUR0OLkNcvu', '3fa457c47019d47f', 1667780793),
(17, 'tienn3605@gmail.com', '$2y$10$XTWqQMRAOjKPi76i4xAgqedHLoZ7HTRWL0KffnhGnzy3d9aE6Sxd.', '2936c9495560ce11', 1669276778);

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(134, 'App\\Models\\employee', 3, 'access-token', '79a187c8a6af9fb1c761cd580b2f29dfdc5bf3915060b93504771262cdbb3642', '[\"products:manage\",\"categories:manage\",\"statistic:manage\",\"orders:manage\",\"sales:manage\",\"customers:manage\"]', NULL, NULL, '2022-11-26 01:02:15', '2022-11-26 01:02:15'),
(135, 'App\\Models\\employee', 3, 'access-token', '866528217c60cac6e41c46de368e26505f2795e27ec508e5e7f72c047e06255d', '[\"products:manage\",\"categories:manage\",\"statistic:manage\",\"orders:manage\",\"sales:manage\",\"customers:manage\"]', NULL, NULL, '2022-11-26 01:02:16', '2022-11-26 01:02:16'),
(136, 'App\\Models\\employee', 3, 'access-token', '4726d0b710cb31e9939453491ba8eff3eb0d6de6a9c59435142ddf4ff3f7fe96', '[\"products:manage\",\"categories:manage\",\"statistic:manage\",\"orders:manage\",\"sales:manage\",\"customers:manage\"]', NULL, NULL, '2022-11-26 06:23:45', '2022-11-26 06:23:45'),
(137, 'App\\Models\\employee', 3, 'access-token', 'f7c2dd214de2ac28e1097cfa61d9d7f3fb243c876a9a22b4e730097393a1a2b2', '[\"products:manage\",\"categories:manage\",\"statistic:manage\",\"orders:manage\",\"sales:manage\",\"customers:manage\"]', NULL, NULL, '2022-11-26 06:23:46', '2022-11-26 06:23:46');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `price` bigint(20) NOT NULL,
  `category` bigint(20) UNSIGNED NOT NULL,
  `material` varchar(40) NOT NULL,
  `origin` varchar(40) NOT NULL,
  `product_description` text NOT NULL,
  `discount` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `created_at`, `updated_at`, `image`, `product_name`, `amount`, `price`, `category`, `material`, `origin`, `product_description`, `discount`) VALUES
(1, '2022-10-19 07:52:56', '2022-11-24 08:21:17', 'image_1666191176_Zippo Stigma Stoned Undeads ZA-1-137A.jpg', 'Zippo Stigma Stoned Undeads ZA-1-137A', 35, 3800000, 1, 'Đồng thau nguyên khối', 'Hàn Quốc', 'Bật lửa Zippo ASIA là một sản phẩm được hình thành và chế tác trên phôi Zippo được nhập khẩu chính hãng từ Mỹ với chất liệu vỏ đồng thau, ruột thép. Sau đó được thiết kế và trang trí theo nhiều công nghệ khác nhau bởi các nhà chế tác tại các nước Asia như Nhật Bản, Hàn Quốc… Phiên bản với các thiết kế đặc biệt được giới thiệu và chỉ phát hành tại các nước Châu Á. Được đóng gói trong một hộp quà tặng. Để có hiệu suất tối ưu, hãy đổ đầy nhiên liệu bật lửa Zippo.', 6),
(2, '2022-10-19 08:12:55', '2022-11-25 06:51:53', 'image_1669229571.jpg', 'Zippo Armor Flag Armor 28974', 10, 1800000, 2, 'Vỏ đồng thau, nền mạ vàng', 'Mỹ', 'Zippo Armor Flag Armor 28974 – giáp bằng bạc giáp cổ này được khắc sâu bằng cờ Mỹ. Mô hình độc đáo này có thiết kế đẹp với kết cấu khổng lồ.', 11),
(3, '2022-10-19 08:16:38', '2022-11-25 07:08:55', 'image_1666200609_Zippo Classic Candy Apple Red - 21063.jpg', 'Zippo Armor Freedom Skull Antique Brass – 49035', 13, 2500000, 2, 'Đồng thau nguyên khối', 'Mỹ', 'Bật lửa chống gió Zippo chính hãng với tiếng “click” đặc trưng của Zippo. Có thể nạp lại cho suốt đời sử dụng; Để có hiệu suất tối ưu, chúng tôi khuyên bạn nên sử dụng xăng, đá lửa và bấc cao cấp của Zippo chính hãng.', 2),
(4, '2022-10-19 08:21:55', '2022-11-23 21:40:15', 'image_1666192915_Zippo Tumbled Brass Armor 28496.jpg', 'Zippo Tumbled Brass Armor 28496', 20, 850000, 2, 'Đồng thau nguyên khối', 'Mỹ', 'Là dòng sản phẩm bật lửa vỏ dày hơn tiêu chuẩn 1,5 lần nên sản phẩm năng và cầm rất chắc tay. Hàng mới, chính hãng Mỹ 100%, Hộp dạng quà tặng thân thiện môi trường đầy đủ (01 Bật lửa; 01 HDSD) Dùng phụ kiện chính hãng Zippo tumbled brass có trữ xăng hiệu quả, đánh lửa và chống gió tốt nhất.', NULL),
(5, '2022-10-19 08:26:02', '2022-10-19 08:26:02', 'image_1666193162_Zippo Eye of Providence.jpg', 'Zippo Eye of Providence', 18, 1700000, 2, 'Vỏ đồng thau, nền mạ vàng', 'Mỹ', 'Zippo eye of providence lại là một sản phẩm siêu cấp cho các tín đồ zippo yêu thích sự thiêng liêng ma mị thuộc dòng sản phẩm zippo cao cấp làm chất liệu đồng thau nguyên khối thuộc dòng armor vỏ dày cấu tạo của zippo Zippo eye of providence dày hơn 1,5 lần so với các loại bật nửa thông thường. Điểm đặc biệt của Zippo eye of providence là nằm ở con mắt của Providence hay tất cả những con mắt nhìn thấy đại diện cho sự quan phòng thiêng liêng, hoặc ý tưởng rằng ai đó luôn dõi theo bạn. Thiết kế này đưa ánh mắt thần thánh từ một viên pha lê Swarovski màu xanh lá cây vào một kim tự tháp được chạm khắc sâu trên chiếc bật lửa Brass High ®, và cũng có một miếng chèn vàng lóe lên.', 2),
(6, '2022-10-19 08:30:28', '2022-10-19 08:30:28', 'image_1666193428_Zippo Luxury Diamond Design 29671.jpg', 'Zippo Luxury Diamond Design 29671', 16, 3700000, 2, 'Đồng thau nguyên khối', 'Mỹ', 'Zippo Luxury Diamond Design là dòng vỏ dày mạ vàng, được hãng Zippo dùng công nghệ khắc cao cấp 360 độ xung quanh chiếc Zippo để tạo ra một chiếc Zippo cực kỳ độc đáo, bên cạnh đó là một viên đá hình thoi màu đỏ nổi bật trên tone vàng. Hộp giấy Zippo cao cấp đi kèm có thể sử dụng như hộp quà tặng. Điểm đặc biệt của chiếc bật lửa Zippo Luxury Diamond Design là trông giống như một hình dạng kim cương đỏ mờ được đặt vào trong chiếc bật lửa Một miếng chèn mạ vàng khen ngợi và hoàn thiện vẻ ngoài cao cấp và bao bì sang trọng làm nổi bật thiết kế bao bọc. Bật lửa Zippo Luxury Diamond Design dày khoảng 1,5 lần so với các dòng bật lửa zippo thông thường và có đá lửa và bấc cao cấp Zippo chính hãng.', NULL),
(8, '2022-10-19 08:37:19', '2022-11-26 13:22:27', 'image_1666193839_Zippo ốp hình ngựa mạ vàng, nền men đỏ ZBT-5-3A.jpg', 'Zippo ốp hình ngựa mạ vàng, nền men đỏ ZBT-5-3A', 41, 2600000, 1, 'Đồng thau nguyên khối', 'Nhật bản', 'Một siêu phẩn thực sự với nghệ thuật đỉnh cao của nghệ nhân làng nghề và ý tưởng chế tác độc đáo từ văn hóa phương Đông bật lửa Zippo xuất Nhật supper cao cấp ZBT-5-3A sẽ là một món đồ mà gã đàn ông nào cũng mong muốn sở hữu. Vẻ quý phái của ZBT-5-3A được hiện hữu ngay từ lớp vỏ ngoài với hình ảnh ngựa lồng cực kỳ mạnh mẽ được ốp trên nền cẩm men đá đỏ rất rất sang trọng, không chỉ đơn thuần thế ngựa ốp và các cạnh của sản phẩm còn được các nghệ nhân Nhật Bản mạ lên một lớp vàng sáng bóng để tăng giá trị đẳng cấp của ZBT-5-3A', NULL),
(9, '2022-10-19 08:41:13', '2022-11-26 13:22:27', 'image_1666194073_Zippo Luxury Diamond Design 29671.jpg', 'Zippo Luxury Diamond Design 29671', 13, 3700000, 1, 'Đồng thau nguyên khối', 'Mỹ', 'Zippo Luxury Diamond Design là dòng vỏ dày mạ vàng, được hãng Zippo dùng công nghệ khắc cao cấp 360 độ xung quanh chiếc Zippo để tạo ra một chiếc Zippo cực kỳ độc đáo, bên cạnh đó là một viên đá hình thoi màu đỏ nổi bật trên tone vàng. Hộp giấy Zippo cao cấp đi kèm có thể sử dụng như hộp quà tặng. Điểm đặc biệt của chiếc bật lửa Zippo Luxury Diamond Design là trông giống như một hình dạng kim cương đỏ mờ được đặt vào trong chiếc bật lửa Một miếng chèn mạ vàng khen ngợi và hoàn thiện vẻ ngoài cao cấp và bao bì sang trọng làm nổi bật thiết kế bao bọc. Bật lửa  Zippo Luxury Diamond Design dày khoảng 1,5 lần so với các dòng bật lửa zippo thông thường và có đá lửa và bấc cao cấp Zippo chính hãng.', NULL),
(10, '2022-10-19 08:44:51', '2022-11-26 00:55:58', 'image_1666194291_Zippo Katamen Ryu Red - ZA-3-35A.jpg', 'Zippo Katamen Ryu Red - ZA-3-35A', 16, 2000000, 1, 'Đồng thau nguyên khối', 'Nhật bản', 'Bật lửa Zippo ASIA là một sản phẩm được hình thành và chế tác trên phôi Zippo được nhập khẩu chính hãng từ Mỹ với chất liệu vỏ đồng thau, ruột thép. Sau đó được thiết kế và trang trí theo nhiều công nghệ khác nhau bởi các nhà chế tác tại các nước Asia như Nhật Bản, Hàn Quốc… Phiên bản với các thiết kế đặc biệt được giới thiệu và chỉ phát hành tại các nước Châu Á. Được đóng gói trong một hộp quà tặng. Để có hiệu suất tối ưu, hãy đổ đầy nhiên liệu bật lửa Zippo. Bật lửa chống gió Zippo chính hãng với tiếng “click” đặc trưng của Zippo. Tất cả các cấu trúc bằng kim loại; thiết kế chống gió hoạt động hầu như ở mọi nơi. Có thể nạp lại cho suốt đời sử dụng; để có hiệu suất tối ưu, chúng tôi khuyên bạn nên sử dụng nhiên liệu, đá lửa và bấc Zippo chính hãng.', NULL),
(11, '2022-10-19 08:49:55', '2022-11-26 13:22:27', 'image_1666194595_Zippo Bolts Design 29672.jpg', 'Zippo Bolts Design 29672', 15, 2800000, 1, 'Đồng thau nguyên khối', 'Mỹ', 'Bật lửa Zippo Bolts có thiết kế vô cùng đặc biệt thuộc dòng zippo vỏ dày cao cấp dòng tiêu chuẩn 1.5 lần Zippo Bolts Design là dòng  mạ Chrome sáng bóng được hãng Zippo sử dụng công nghệ khắc cao cấp 360 độ xung quanh chiếc Zippo để tạo lên những đường khắc và logo Zippo đầy độc đáo ở 2 mặt, bên cạnh đó là ngọn lửa màu đỏ ở cạnh Zippo. Hộp giấy Zippo cao cấp đi kèm có thể sử dụng như hộp quà tặng. Zippo Zippo Bolts có âm thanh đặc trưng trầm ấm, tiếng đóng nắp mạnh mẽ. Chống gió tốt trong nhiều môi trường. Vỏ Zippo: Dòng vỏ đồng thau dày hơn 1.5 dòng tiêu chuẩn, đầu tròn, mộc đáy lồi. Bản lề 5 chấu. Ruột Zippo: Ruột thép không gỉ tiêu chuẩn với buồng đốt 16 lỗ (8 lỗ mỗi bên). Mộc Đáy Zippo: Mộc đáy có Logo Zippo, kí hiệu và tháng năm được sản xuất. Hộp Đựng Zippo: Hộp đựng cao cấp, hợp đựng màu đỏ, nắp hộp màu đen được trang trí logo Zippo và chữ “z”, trong hộp có 1 giấy hướng dẫn sử dụng, có ghi chính sách bảo hành của Zippo. Sau hộp có dán tem bảo hành của nhà phân phối.', NULL),
(12, '2022-10-19 09:29:39', '2022-11-26 00:55:55', 'image_1666196979_Zippo High Polish Green Elegant Dragon 49054.jpg', 'Zippo High Polish Green Elegant Dragon 49054', 16, 2800000, 1, 'Đồng thau nguyên khối', 'Mỹ', 'Bật lửa Zippo Bolts có thiết kế vô cùng đặc biệt thuộc dòng zippo vỏ dày cao cấp dòng tiêu chuẩn 1.5 lần Zippo Bolts Design là dòng  mạ Chrome sáng bóng được hãng Zippo sử dụng công nghệ khắc cao cấp 360 độ xung quanh chiếc Zippo để tạo lên những đường khắc và logo Zippo đầy độc đáo ở 2 mặt, bên cạnh đó là ngọn lửa màu đỏ ở cạnh Zippo. Hộp giấy Zippo cao cấp đi kèm có thể sử dụng như hộp quà tặng. Zippo Zippo Bolts có âm thanh đặc trưng trầm ấm, tiếng đóng nắp mạnh mẽ. Chống gió tốt trong nhiều môi trường. Vỏ Zippo: Dòng vỏ đồng thau dày hơn 1.5 dòng tiêu chuẩn, đầu tròn, mộc đáy lồi. Bản lề 5 chấu. Ruột Zippo: Ruột thép không gỉ tiêu chuẩn với buồng đốt 16 lỗ (8 lỗ mỗi bên). Mộc Đáy Zippo: Mộc đáy có Logo Zippo, kí hiệu và tháng năm được sản xuất. Hộp Đựng Zippo: Hộp đựng cao cấp, hợp đựng màu đỏ, nắp hộp màu đen được trang trí logo Zippo và chữ “z”, trong hộp có 1 giấy hướng dẫn sử dụng, có ghi chính sách bảo hành của Zippo. Sau hộp có dán tem bảo hành của nhà phân phối.', NULL),
(13, '2022-10-19 09:42:19', '2022-11-25 13:18:18', 'image_1666197739_Zippo Classic High Polish Chrome - 250.jpg', 'Zippo Classic High Polish Chrome - 250', 83, 650000, 3, 'Đồng thau nguyên khối', 'Mỹ', 'Bật lửa Zippo Classic High Polish Chrome - 250, sử dụng nguyên liệu đồng thau nguyên khối mạ chrome cao cấp, tạo cảm giác sang trọng, khả năng cằm nắm chắc tay. Sản phẩm nhập khẩu từ Mỹ đảm bảo chất lượng. Được thiết kế với nét đặc trưng chính là một sự hoàn thiện hoàn hảo và rực rỡ. Phiên bản High Polish Chrome là một trong những mẫu phổ biến nhất và dần trở thành một dòng sản phẩm chính của Zippo kể từ năm 1938.', NULL),
(14, '2022-10-19 09:56:47', '2022-11-25 14:03:53', 'image_1666198607_Zippo Brass Venetian Design - 352B.jpg', 'Zippo Brass Venetian Design - 352B', 14, 900000, 3, 'Đồng thau nguyên khối', 'Mỹ', 'Zippo Brass Venetian Design - 352B thuộc dòng bật lửa Zippo đồng vàng hoa văn phong cách Ý, hàng chính hãng Zippo Mỹ, bảo hành trọn đời, bán lẻ giá sỉ. Mẫu sản phẩm được giới thiệu vào năm 1974, mẫu họa tiết hoa văn ngược và vượt thời gian của mẫu bật lửa Venetian tiếp tục trở thành mẫu thiết kế bật lửa thu hút nhất toàn cầu mà Zippo từng ra mắt. Bật lửa Venetian High Polish Brass có bảng tùy chỉnh được đánh bóng cao có thể được khắc chữ cái đầu, một tin nhắn ngắn hoặc một ngày quan trọng làm món quà cho một người nào đó.', 3),
(15, '2022-10-19 10:03:28', '2022-11-24 21:21:28', 'image_1666199008_Zippo High Polish Solid Brass 254.jpg', 'Zippo High Polish Solid Brass 254', 20, 750000, 3, 'Đồng thau nguyên khối', 'Mỹ', 'Mẫu bật lửa Zippo High Polish Solid Brass 254 với chữ khắc solid brass tuy đơn giản nhưng rất tinh tế  và thu hút được nhiều khách hàng. Tuy là mẫu bật lửa phổ thông nhưng sản phẩm này vẫn được đánh giá rất cao về chất lượng cũng như kiểu dáng sản phẩm.', NULL),
(16, '2022-10-19 10:12:21', '2022-11-26 07:58:14', 'image_1666199541_Zippo Brushed Brass Vintage with Slashes - 240.jpg', 'Zippo Brushed Brass Vintage with Slashes - 240', 3, 700000, 3, 'Đồng thau nguyên khối', 'Mỹ', 'Zippo Brushed Brass Vintage with Slashes 240 với chất liệu vỏ đồng thau,nền mạ đồng xước ngang với thiết kế tái bản lại những mẫu Zippo sản xuất vào năm 1937. Thiết kế vuông độc đáo là một trong những mẫu được ưa chuộng nhất. Là dòng zippo phổ thông và được nhiều người mua nhất trong năm vừa qua tại zippovn.com. Tuy sản phẩm có giá rẻ nhưng chất liệu và thiết kế của sản phẩm thì cực tốt và chất lượng.', NULL),
(17, '2022-10-19 10:21:22', '2022-11-26 07:58:14', 'image_1666200082_Zippo Clover High Polish Chrome Design - 24699.jpg', 'Zippo Clover High Polish Chrome Design - 24699', 3, 850000, 3, 'Đồng thau nguyên khối', 'Mỹ', 'Zippo Clover High Polish Chrome Design - 24699 với chất liệu vỏ đồng thau ,nền mạ chrome bóng với thiết kế khắc trang trí, in cỏ 4 lá tượng trưng cho sự may mắn. Thiết kế cỏ bốn lá này được tạo ra bằng cách sử dụng cả hình ảnh màu và phương pháp khắc dấu khắc tự động.', NULL),
(18, '2022-10-19 10:30:09', '2022-11-26 00:55:57', 'image_1666200609_Zippo Classic Candy Apple Red - 21063.jpg', 'Zippo Classic Candy Apple Red - 21063', 10, 850000, 3, 'Đồng thau nguyên khối', 'Mỹ', 'Zippo Candy Apple Red - 21063 dòng bật lửa zippo classics, với màu sắc nổi bật lớp sơn mờ màu đỏ đậm trên thiết kế Zippo thu hút sự chú ý của người sử dụng. Sử dụng chất liệu đồng thau để làm vỏ cho chiếc bật lửa Zippo, nhằm đem đến sử trải nghiệm vô cùng đặt biệt Zippo đã mang đến công nghệ sơ tĩnh điện độc đáo và phủ bóng làm cho chiếc Zippo thêm phầm sang trọng và độc đáo.', NULL),
(37, '2022-10-19 10:30:09', '2022-11-26 00:56:01', 'image_1669229571.jpg', 'Zippo Armor Flag Armor 28974', 14, 1650000, 2, 'Đồng thau nguyên khối', 'Anh', 'Zippo Armor Flag Armor 28974 – giáp bằng bạc giáp cổ này được khắc sâu bằng cờ Mỹ. Mô hình độc đáo này có thiết kế đẹp với kết cấu khổng lồ.', 11);

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sale_name` varchar(100) NOT NULL,
  `percent` int(11) NOT NULL,
  `end_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `sale_name`, `percent`, `end_date`) VALUES
(2, 'summer_discount', 30, NULL),
(3, 'spring_discount', 40, NULL),
(5, 'valentine_discount', 15, NULL),
(6, 'winter_discount', 35, '2022-11-30'),
(11, 'no_discount', 0, NULL),
(12, 'independence_day_discount', 25, NULL),
(13, 'chirstmas_discount', 35, NULL),
(14, 'special_discount', 45, NULL),
(15, 'thanksgiving_discount', 34, NULL),
(16, 'easter_discount', 40, NULL),
(17, 'fall_discount', 15, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `supplier_name` varchar(255) NOT NULL,
  `address` varchar(50) NOT NULL,
  `phone_number` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id`, `supplier_name`, `address`, `phone_number`) VALUES
(1, 'Nhà máy á châu', 'Thành phố Hồ Chí Minh', '0932028182'),
(2, 'Công ty Cổ phần Hưng Phú', 'Hưng Yên', '0928332112'),
(3, 'Công ty TNHH Trấu việt ', 'Thành phố Hồ Chí Minh', '0934553821'),
(4, 'Công ty cổ phần Ngọc Diệp ', 'Hưng Yên', '0901929344'),
(6, 'Công Ty TNHH Vĩnh Tiến', 'Tỉnh Điện Biên', '0932134435'),
(7, 'Công Ty TNHH A', 'Tỉnh Bình Dương', '0348249283'),
(13, 'Công Ty TNHH B', 'Thành phố Hồ Chí Minh', '0927429322'),
(14, 'Công Ty TNHH C', 'Tỉnh Bà Rịa - Vũng Tàu', '0927422322'),
(15, 'Công Ty TNHH D', 'Thành phố Hà Nội', '0927423984'),
(16, 'Công Ty TNHH E', 'Tỉnh Bạc Liêu', '0292423123'),
(18, 'Công Ty TNHH F', 'Thành phố Hồ Chí Minh', '0932430072'),
(19, 'Công Ty TNHH G', 'Thành phố Hồ Chí Minh', '0927482931');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `phonenumber` varchar(10) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `gender`, `phonenumber`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(37, 'Nguyễn Vĩnh Tiến', 'Nam', '0932430071', 'tien23851@gmail.com', '2022-11-17 08:27:02', 'vinhtien1234', '', '2022-10-29 12:39:07', '2022-11-26 06:23:41'),
(39, 'Lê Ngọc Toàn', 'Nam', '0544668876', 'nguyenvinhtien431@gmail.com', NULL, 'toan1234', 'SB6M9CK73d8vO9AFPvbU3y9rEJ3S243M67sEuRF6', '2022-11-14 10:59:01', '2022-11-14 10:59:01'),
(45, 'Lê Văn Tiến', 'Nam', '0942738492', 'starbutterfly652@gmail.com', '2022-11-24 00:43:48', 'tien1234', '', '2022-11-24 00:43:27', '2022-11-24 00:49:04'),
(48, 'Nguyen vinh tien', 'Nam', '0932430034', 'tienn3605@gmail.com', '2022-11-24 19:50:59', 'tien12345', '', '2022-11-24 19:50:37', '2022-11-24 20:23:34'),
(49, 'le ngoc toan', 'Nam', '0585372128', 'toanktkkt@gmial.com', NULL, 'Lengoctoan0437', 'zQH13FFASaZVo39dLjRhjZgDFx7swkFOOgyTInCh', '2022-11-25 23:34:25', '2022-11-25 23:34:25'),
(50, 'le ngoc toan', 'Nam', '0585212129', 'toanktkkt@gmail.com', '2022-11-25 23:35:20', 'Lengoctoan0437', '', '2022-11-25 23:35:08', '2022-11-25 23:36:56');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employees_role_as_index` (`role_as`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `import_slips`
--
ALTER TABLE `import_slips`
  ADD PRIMARY KEY (`id`),
  ADD KEY `import_slips_employee_id_index` (`employee_id`),
  ADD KEY `import_slips_supplier_id_index` (`supplier_id`);

--
-- Indexes for table `import_slip_details`
--
ALTER TABLE `import_slip_details`
  ADD PRIMARY KEY (`import_slip_id`,`product_id`),
  ADD KEY `import_slip_details_import_slip_id_index` (`import_slip_id`),
  ADD KEY `import_slip_details_product_id_index` (`product_id`);

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
  ADD KEY `orders_user_id_index` (`user_id`),
  ADD KEY `orders_ibfk_1` (`employee_id`);

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
  ADD KEY `products_ibfk_2` (`category`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `import_slips`
--
ALTER TABLE `import_slips`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=138;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_role_as_foreign` FOREIGN KEY (`role_as`) REFERENCES `groups` (`id`);

--
-- Constraints for table `import_slips`
--
ALTER TABLE `import_slips`
  ADD CONSTRAINT `import_slips_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `import_slips_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`);

--
-- Constraints for table `import_slip_details`
--
ALTER TABLE `import_slip_details`
  ADD CONSTRAINT `import_slip_details_import_slip_id_foreign` FOREIGN KEY (`import_slip_id`) REFERENCES `import_slips` (`id`),
  ADD CONSTRAINT `import_slip_details_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD CONSTRAINT `orderdetails_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `orderdetails_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON UPDATE NO ACTION;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE NO ACTION;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`discount`) REFERENCES `sales` (`id`) ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category`) REFERENCES `categories` (`id`) ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
