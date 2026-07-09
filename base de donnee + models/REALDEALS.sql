-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql-realdeals
-- Generation Time: Jul 08, 2026 at 04:26 PM
-- Server version: 8.0.46
-- PHP Version: 8.3.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `realdeals`
--

-- --------------------------------------------------------

--
-- Table structure for table `adresse`
--

CREATE TABLE `adresse` (
  `id_adress` bigint NOT NULL,
  `id_utilisateur` bigint NOT NULL,
  `code_postal` varchar(20) DEFAULT NULL,
  `ville` varchar(150) NOT NULL,
  `rue` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id_categ` bigint NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id_categ`, `name`) VALUES
(2, 'f Capitalism'),
(1, 'halal');

-- --------------------------------------------------------

--
-- Table structure for table `chatconversations`
--

CREATE TABLE `chatconversations` (
  `date_creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_conversation` bigint NOT NULL,
  `id_utilisateur` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chatmessage`
--

CREATE TABLE `chatmessage` (
  `date_d_envoi` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_chatmessage` bigint NOT NULL,
  `id_conversation` bigint NOT NULL,
  `contenu` text NOT NULL,
  `expediteur` enum('BOT','USER') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id_contact_message` bigint NOT NULL,
  `date_creation` datetime(6) NOT NULL,
  `email` varchar(150) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `lu` bit(1) NOT NULL,
  `message` varchar(1000) NOT NULL,
  `subject` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id_contact_message`, `date_creation`, `email`, `full_name`, `lu`, `message`, `subject`) VALUES
(1, '2026-07-08 15:41:06.422257', 'yahya@test.com', 'Yahya Test', b'0', 'This is a test message from Postman.', 'Order support'),
(2, '2026-07-08 15:45:47.623429', 'afoui@test.com', 'yahya afouiq', b'0', 'test', 'Delivery tracking');

-- --------------------------------------------------------

--
-- Table structure for table `lignecommande`
--

CREATE TABLE `lignecommande` (
  `prix_unitaire` decimal(10,2) NOT NULL,
  `quantite` int NOT NULL,
  `id_ligne_commande` bigint NOT NULL,
  `id_order` bigint NOT NULL,
  `id_prod` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id_notification` bigint NOT NULL,
  `date_creation` datetime(6) NOT NULL,
  `lu` bit(1) NOT NULL,
  `message` varchar(255) NOT NULL,
  `titre` varchar(100) NOT NULL,
  `id_order` bigint DEFAULT NULL,
  `id_utilisateur` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id_notification`, `date_creation`, `lu`, `message`, `titre`, `id_order`, `id_utilisateur`) VALUES
(1, '2026-07-08 11:36:07.209872', b'1', 'Your order #6 has been cancelled.', 'Order update', 6, 2);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `total` decimal(10,2) NOT NULL,
  `date_creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_order` bigint NOT NULL,
  `id_utilisateur` bigint NOT NULL,
  `mode_paiement` varchar(25) DEFAULT NULL,
  `statut` enum('ANNULEE','CONFIRMEE','EN_ATTENTE','EXPEDIEE','LIVREE') NOT NULL,
  `PHONE_NUMBER` varchar(20) DEFAULT NULL,
  `SHIPPING_ADDRESS` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`total`, `date_creation`, `id_order`, `id_utilisateur`, `mode_paiement`, `statut`, `PHONE_NUMBER`, `SHIPPING_ADDRESS`) VALUES
(450.00, '2026-07-04 12:03:52', 6, 2, NULL, 'ANNULEE', NULL, NULL),
(600.00, '2026-07-04 12:10:50', 7, 4, NULL, 'EN_ATTENTE', NULL, NULL),
(250.00, '2026-07-04 21:38:01', 8, 4, NULL, 'EN_ATTENTE', NULL, NULL),
(600.00, '2026-07-04 21:39:15', 9, 5, NULL, 'EN_ATTENTE', NULL, NULL),
(600.00, '2026-07-04 22:35:01', 10, 5, 'CASH', 'EN_ATTENTE', NULL, NULL),
(0.00, '2026-07-04 22:35:15', 11, 5, 'CARTE', 'EN_ATTENTE', NULL, NULL),
(650.00, '2026-07-05 10:16:52', 12, 5, 'CARTE', 'EN_ATTENTE', NULL, NULL),
(550.00, '2026-07-05 17:18:16', 13, 4, 'CARTE', 'LIVREE', '0772832716', 'oulfa'),
(0.00, '2026-07-07 12:31:33', 14, 4, 'cash', 'LIVREE', '0612345678', '123 Rue Test, Casablanca'),
(0.00, '2026-07-07 12:36:30', 15, 4, 'cash', 'EN_ATTENTE', '0612345678', '123 Rue Test, Casablanca'),
(350.00, '2026-07-07 12:44:41', 16, 5, 'CASH', 'CONFIRMEE', '345678956', 'wertyuiodfghj');

-- --------------------------------------------------------

--
-- Table structure for table `produits`
--

CREATE TABLE `produits` (
  `prix` decimal(10,2) NOT NULL,
  `stock` int NOT NULL,
  `date_creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_categ` bigint DEFAULT NULL,
  `id_prod` bigint NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `description_seo` text,
  `image_url` varchar(255) DEFAULT NULL,
  `TAILLES` varchar(100) DEFAULT NULL,
  `IMAGE_URLS` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `produits`
--

INSERT INTO `produits` (`prix`, `stock`, `date_creation`, `id_categ`, `id_prod`, `name`, `description`, `description_seo`, `image_url`, `TAILLES`, `IMAGE_URLS`) VALUES
(250.00, 20, '2026-07-07 17:25:31', 2, 9, 'REALDEALS Oversized Tee', 'Brown oversized REALDEALS tee with a white contrast collar, bold front logo, and chest graphic details. A clean streetwear piece made for comfort, everyday styling, and a relaxed fit.', NULL, 'http://localhost:8080/uploads/products/0cdf4520-c4ac-4717-bf39-c472866c46fb.png', 'M,L,XL', 'http://localhost:8080/uploads/products/0cdf4520-c4ac-4717-bf39-c472866c46fb.png,http://localhost:8080/uploads/products/ac640c3e-7005-4fff-83dc-101a6c079201.png,http://localhost:8080/uploads/products/65d6fd31-3ff7-4a9e-9d5b-d18aed266e82.png,http://localhost:8080/uploads/products/031a1467-836c-4f27-9556-2bde02ff889f.png'),
(300.00, 20, '2026-07-07 17:36:06', 1, 12, 'REALDEALS 333 Oversized Tee', 'Black oversized REALDEALS tee with white 333 chest graphics and contrast stitching. A relaxed streetwear essential with a bold front design and clean everyday fit.', NULL, 'http://localhost:8080/uploads/products/59417374-e033-45f9-93dc-25bb8f9cedf0.png', 'M,L,XL', 'http://localhost:8080/uploads/products/59417374-e033-45f9-93dc-25bb8f9cedf0.png,http://localhost:8080/uploads/products/93f5ad41-3905-4ec8-a046-9b10f438dd75.png,http://localhost:8080/uploads/products/b8ebaf92-f226-47da-b6e1-df683a038c7e.png,http://localhost:8080/uploads/products/db3ba18d-463f-4f73-b88b-1edda093302d.png'),
(350.00, 20, '2026-07-07 17:37:39', 2, 15, 'REALDEALS Resist Shirt', 'Light blue oversized button-up shirt with subtle red REALDEALS chest branding, short sleeves, and a relaxed streetwear fit. Clean, minimal, and easy to style for everyday summer wear.', NULL, 'http://localhost:8080/uploads/products/c64ab3e6-f014-4096-9f0d-ea1a8fb6791d.png', 'M,L,XL', 'http://localhost:8080/uploads/products/c64ab3e6-f014-4096-9f0d-ea1a8fb6791d.png,http://localhost:8080/uploads/products/9f8d0045-410b-4c4e-9f6b-cf7a341b73a0.png,http://localhost:8080/uploads/products/5b5a53c0-962a-432e-93e7-9bf6e868bc7b.png,http://localhost:8080/uploads/products/1a89cc3a-ec0d-4153-8364-6c3de327c7a0.png'),
(300.00, 20, '2026-07-07 17:55:54', 1, 16, 'REALDEALS Halal Oversized Tee', 'Black oversized REALDEALS tee with minimal chest branding and a relaxed streetwear fit. Clean, simple, and made for everyday styling.', NULL, 'http://localhost:8080/uploads/products/1f9ccb4a-76b9-44c1-a133-a584eecc451f.png', 'M,L,XL', 'http://localhost:8080/uploads/products/1f9ccb4a-76b9-44c1-a133-a584eecc451f.png,http://localhost:8080/uploads/products/e244a84c-04f6-4238-9175-bfe2343dfc72.png,http://localhost:8080/uploads/products/4dfe47e2-ad32-4248-903c-4d3e551a0263.png,http://localhost:8080/uploads/products/978000dd-2d94-48f7-bc6f-c76485364121.png'),
(200.00, 20, '2026-07-07 17:58:42', 2, 17, 'REALDEALS Red Polo', 'Red oversized REALDEALS polo with white chest branding, a three-button collar, and a relaxed streetwear fit. Bold, clean, and easy to style.', NULL, 'http://localhost:8080/uploads/products/adafb71e-23b2-48c3-a76c-a253b7b135a1.png', 'M,L,XL', 'http://localhost:8080/uploads/products/adafb71e-23b2-48c3-a76c-a253b7b135a1.png,http://localhost:8080/uploads/products/23ea543f-d357-4c3d-a2ee-417f3a59818b.png,http://localhost:8080/uploads/products/54eebd93-1893-4df9-a2f6-094846a0296e.png'),
(200.00, 10, '2026-07-07 18:01:14', 2, 18, 'REALDEALS R Snapback Cap', 'Brown REALDEALS snapback cap with a flat brim and embroidered “R” front patch. A clean streetwear accessory with varsity-inspired details.', NULL, 'http://localhost:8080/uploads/products/37bdcddf-80ce-46b7-9351-3cbb7786e7c8.png', 'M,L,XL', 'http://localhost:8080/uploads/products/37bdcddf-80ce-46b7-9351-3cbb7786e7c8.png,http://localhost:8080/uploads/products/9720a0b3-95ab-4b3c-ae36-4c6ec34c9deb.png,http://localhost:8080/uploads/products/a2ab0048-92eb-4236-b8e0-ac80d3afd80c.png');

-- --------------------------------------------------------

--
-- Table structure for table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `date_creation` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_utilisateur` bigint NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','CUSTOMER') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `utilisateurs`
--

INSERT INTO `utilisateurs` (`date_creation`, `id_utilisateur`, `name`, `email`, `password`, `role`) VALUES
('2026-07-04 11:02:19', 1, 'Admin', 'admin@realdeals.com', '$2a$10$NSma4IF5ELOS.bHeX5XuUeG/F2k9fLI6h3XIWHA4FDWC3pn8lgRqe', 'ADMIN'),
('2026-07-04 11:08:37', 2, 'Yahya Afoui', 'afoui@test.com', '$2a$10$2mwzNOUfrpPdiIKh6m4RsezoXVmc1bRjOHE4sTz9yXxnu6lwYpW1y', 'CUSTOMER'),
('2026-07-04 12:06:07', 4, 'walid chadli', 'chadli@test.com', '$2a$10$BUBLEzr/6qBhco66FVDb6uzIl6MAS4VCc7B0gVDvKDuD/egspEH3e', 'CUSTOMER'),
('2026-07-04 21:38:45', 5, 'hamza bentriaia', 'hamza@test.com', '$2a$10$uQGt2VzJGuCKYFFbA.u7CeDMzYjXG3yYfxSVJ/zKvrCPF/HOcmXb2', 'CUSTOMER');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adresse`
--
ALTER TABLE `adresse`
  ADD PRIMARY KEY (`id_adress`),
  ADD KEY `FK32j2hiuafl0ugl62loer245aq` (`id_utilisateur`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id_categ`),
  ADD UNIQUE KEY `UKt8o6pivur7nn124jehx7cygw5` (`name`);

--
-- Indexes for table `chatconversations`
--
ALTER TABLE `chatconversations`
  ADD PRIMARY KEY (`id_conversation`),
  ADD KEY `FK85r0cts2f73jo9atdoskaclng` (`id_utilisateur`);

--
-- Indexes for table `chatmessage`
--
ALTER TABLE `chatmessage`
  ADD PRIMARY KEY (`id_chatmessage`),
  ADD KEY `FKnmji5ce1cc1q6xtlsmtqxylau` (`id_conversation`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id_contact_message`);

--
-- Indexes for table `lignecommande`
--
ALTER TABLE `lignecommande`
  ADD PRIMARY KEY (`id_ligne_commande`),
  ADD KEY `FK8xo76ont4d0dog8s11resr52r` (`id_order`),
  ADD KEY `FKbs8sxqsyrdi7hkvpli2ajn80m` (`id_prod`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id_notification`),
  ADD KEY `FKoo38wwelh175sbs4ja264xc9h` (`id_order`),
  ADD KEY `FKowjn3junnh8rx94d2rrnl7bc` (`id_utilisateur`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id_order`),
  ADD KEY `FK6hqyng9dc3skxg77rvoode6fe` (`id_utilisateur`);

--
-- Indexes for table `produits`
--
ALTER TABLE `produits`
  ADD PRIMARY KEY (`id_prod`),
  ADD KEY `FKoo1xjflds4hrvgkaosif6y1gh` (`id_categ`);

--
-- Indexes for table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id_utilisateur`),
  ADD UNIQUE KEY `UK6ldvumu3hqvnmmxy1b6lsxwqy` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adresse`
--
ALTER TABLE `adresse`
  MODIFY `id_adress` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id_categ` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `chatconversations`
--
ALTER TABLE `chatconversations`
  MODIFY `id_conversation` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chatmessage`
--
ALTER TABLE `chatmessage`
  MODIFY `id_chatmessage` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id_contact_message` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `lignecommande`
--
ALTER TABLE `lignecommande`
  MODIFY `id_ligne_commande` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id_notification` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id_order` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `produits`
--
ALTER TABLE `produits`
  MODIFY `id_prod` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id_utilisateur` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `adresse`
--
ALTER TABLE `adresse`
  ADD CONSTRAINT `FK32j2hiuafl0ugl62loer245aq` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id_utilisateur`);

--
-- Constraints for table `chatconversations`
--
ALTER TABLE `chatconversations`
  ADD CONSTRAINT `FK85r0cts2f73jo9atdoskaclng` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id_utilisateur`);

--
-- Constraints for table `chatmessage`
--
ALTER TABLE `chatmessage`
  ADD CONSTRAINT `FKnmji5ce1cc1q6xtlsmtqxylau` FOREIGN KEY (`id_conversation`) REFERENCES `chatconversations` (`id_conversation`);

--
-- Constraints for table `lignecommande`
--
ALTER TABLE `lignecommande`
  ADD CONSTRAINT `FK8xo76ont4d0dog8s11resr52r` FOREIGN KEY (`id_order`) REFERENCES `orders` (`id_order`),
  ADD CONSTRAINT `FKbs8sxqsyrdi7hkvpli2ajn80m` FOREIGN KEY (`id_prod`) REFERENCES `produits` (`id_prod`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `FKoo38wwelh175sbs4ja264xc9h` FOREIGN KEY (`id_order`) REFERENCES `orders` (`id_order`),
  ADD CONSTRAINT `FKowjn3junnh8rx94d2rrnl7bc` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id_utilisateur`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `FK6hqyng9dc3skxg77rvoode6fe` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id_utilisateur`);

--
-- Constraints for table `produits`
--
ALTER TABLE `produits`
  ADD CONSTRAINT `FKoo1xjflds4hrvgkaosif6y1gh` FOREIGN KEY (`id_categ`) REFERENCES `categories` (`id_categ`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
