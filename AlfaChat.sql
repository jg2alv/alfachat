-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 24, 2020 at 08:42 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `AlfaChat`
--

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `members` text DEFAULT NULL,
  `created` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id`, `name`, `members`, `created`) VALUES
(1, '1° Ano - Ensino Fundamental', NULL, 0),
(2, '2° Ano - Ensino Fundamental', NULL, 0),
(3, '3° Ano - Ensino Fundamental', NULL, 0),
(4, '4° Ano - Ensino Fundamental', NULL, 0),
(5, '5° Ano - Ensino Fundamental', NULL, 0),
(6, '6° Ano - Ensino Fundamental', NULL, 0),
(7, '7° Ano - Ensino Fundamental', NULL, 0),
(8, '8° Ano - Ensino Fundamental', NULL, 0),
(9, '9° Ano - Ensino Fundamental', NULL, 0),
(10, '1° Ano - Ensino Médio', NULL, 0),
(11, '2° Ano - Ensino Médio', '1,2', 0),
(12, '3° Ano - Ensino Médio', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender` int(11) NOT NULL,
  `reciever` text NOT NULL,
  `content` text NOT NULL,
  `seen` tinyint(1) DEFAULT NULL,
  `time` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender`, `reciever`, `content`, `seen`, `time`) VALUES
(1, 1, 'group:11', 'dGVzdGFuZG8=', 1, 1582478432),
(2, 1, '2', 'b2ksIEVyaWMh', 1, 1582478633),
(3, 2, 'group:11', 'b2ksIEpvYW8=', 1, 1582478719),
(4, 1, 'group:11', 'YXF1aSBlaCBvIEpvYW8sIHRlc3RhbmRvIHBlbG8gbW96aWxsYSBmaXJlZm94', 1, 1582478781),
(5, 2, 'group:11', 'YXF1aSBlaCBvIEVyaWMsIHBlbG8gQnJhdmU=', 1, 1582478832),
(6, 1, 'group:11', 'cGFyZWNlIHF1ZSBlc3RhIHR1ZG8gZnVuY2lvbmFuZG8=', 1, 1582478850),
(7, 2, 'group:11', 'Y3JlaW8gcXVlIHNpbQ==', 1, 1582478862),
(8, 2, '1', 'b2ksIEpvYW8h', 1, 1582479819),
(9, 1, 'group:11', 'Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0', 1, 1582480143),
(10, 1, '2', 'Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dA==', 1, 1582480380),
(11, 1, '2', 'Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHRnaWFudCB0ZXh0Z2lhbnQgdGV4dGdpYW50IHRleHQ=', 1, 1582480386),
(12, 1, 'group:11', 'dGVzdGluZy4uLg==', 1, 1582547976),
(13, 1, '2', 'dGVzdGFuZG8=', 1, 1582547991),
(14, 1, 'group:11', 'MTIz', 1, 1582558725),
(15, 1, 'group:11', 'MTIzNA==', 1, 1582558763);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(7) NOT NULL,
  `rg` int(8) NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `password` varchar(32) NOT NULL,
  `class` int(2) NOT NULL,
  `chats` text DEFAULT NULL,
  `bio` varchar(256) DEFAULT NULL,
  `photo` text DEFAULT NULL,
  `status` text NOT NULL DEFAULT 'offline',
  `joined` int(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `rg`, `name`, `email`, `password`, `class`, `chats`, `bio`, `photo`, `status`, `joined`) VALUES
(1, 10155597, 'Joao Vaz', 'joao@gmail.com', 'e19d5cd5af0378da05f63f891c7467af', 11, '2', NULL, 'assets/avatars/user/uploads/11/10155597/profile_pic.png', 'Visto pela última vez há 6 minutos', 1581809654),
(2, 10155598, 'Eric', 'eric@gmail.com', 'e19d5cd5af0378da05f63f891c7467af', 11, '1', NULL, 'assets/avatars/user/uploads/11/10155598/profile_pic.png', 'online', 1581809680);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
