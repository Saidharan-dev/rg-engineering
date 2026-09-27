-- ============================================
-- RG Engineering Excellence - Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS rg_engineering;
USE rg_engineering;

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category ENUM('institutional', 'residential', 'commercial', 'religious', 'bungalow', 'industrial') NOT NULL,
  architect VARCHAR(255),
  description TEXT,
  image_url VARCHAR(500),
  featured TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Architect profiles are matched to projects by the existing architect name.
CREATE TABLE IF NOT EXISTS architects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  location VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  logo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  project_type VARCHAR(100),
  message TEXT NOT NULL,
  status ENUM('pending', 'answered') DEFAULT 'pending',
  admin_reply TEXT,
  replied_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Seed: default admin user
-- password: admin123 (change this in production!)
-- bcrypt hash of "admin123"
-- ============================================
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', '$2a$10$ZvcTO/RLVaxUtwF4UJL4iulg9XPQN4BeC/R1YiDWwixyTi91PCyHu')
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);

-- ============================================
-- Seed: sample projects from company profile
-- ============================================
INSERT INTO projects (title, category, architect, description, featured) VALUES
('Indoor Auditorium, St. Joseph College of Engineering', 'institutional', 'Sumana Dinesh Associates, Chennai', 'Large-span auditorium structural design for an engineering college campus.', 1),
('Teaching Block, NIT Mangalore, Karnataka', 'institutional', 'AAD India Pvt. Ltd., Chennai', 'Multi-storey teaching block with seismic-resistant structural design.', 1),
('Library cum Archives, Immaculate Heart of Mary College, Pondicherry', 'institutional', 'Diarchy Architects, Trichy', 'Institutional library with archival facilities and modern structural system.', 0),
('Kamalaniketan Montessori School, Trichy', 'institutional', 'AAD India Pvt Ltd, Chennai', 'School building structural design with child-safe construction standards.', 0),
('Indira Ganesan Engineering College, Trichy', 'institutional', 'AAD India Pvt Ltd, Chennai', 'Campus buildings structural consultancy for engineering college.', 0),
('Hostel Buildings, K. Ramakrishnan College of Engineering, Trichy', 'institutional', 'K. Ramakrishnan College', 'Separate girls and boys hostel structural design with load analysis.', 0),
('Rohini Ramji Residential Apartment, Trichy', 'residential', 'Sajith & Vivek Architects LLP, Chennai', 'Multi-storey residential apartment structural design and supervision.', 1),
('ETA Jasmine Court Residential Apartments, Chennai', 'residential', 'AAD India Pvt. Ltd., Chennai', 'Large residential complex with detailed structural analysis.', 1),
('M/s. Isha Homes, Trichy', 'residential', 'Beavers Architects, Chennai', 'Residential apartment project with complete structural drawings.', 0),
('RMK Construction & Housing, Thiruverkadu Chennai', 'residential', 'Harini & Nandalal, Chennai', 'Residential housing project structural consultancy.', 0),
('M/s. Morais Tower, Trichy', 'commercial', 'DIASTYLE Interior & Exterior Designer, Chennai', 'Commercial tower structural design with high-rise load calculations.', 1),
('M/s. Morais Mart, Trichy', 'commercial', 'Mutram Architects, Trichy', 'Commercial retail space structural design.', 0),
('Hotel Le Temps Fort, Trichy', 'commercial', 'OCI Architect, Chennai', 'Boutique hotel structural design with basement parking.', 0),
('City Union Bank Building, Kumbakonam', 'commercial', 'Venugopal Associates, Chennai', 'Bank building with secure structural requirements.', 0),
('Maruthi Hospital, Namakkal', 'commercial', 'Harini & Nandalal, Chennai', 'Hospital structural design with vibration control and safety compliance.', 0),
('Proposed Church, Mahabalipuram', 'religious', 'Diarchy Architects, Trichy', 'Church structural design with long-span roof system.', 0),
('Saibaba Temple, Trichy', 'religious', 'Diarchy Architects, Trichy', 'Temple structural design incorporating traditional architecture.', 0),
('Murugan Statue, Salem', 'religious', 'Sculptor: R. Thiyagarajan, Thiruvarur', 'Structural base and support design for a large religious statue.', 0),
('Mr. Somasundaram House, Trichy', 'bungalow', 'AAD India Pvt. Ltd., Chennai', 'Individual bungalow with customised structural design.', 0),
('Mr. Radhakrishnan House, Pondicherry', 'bungalow', 'MS Design House, Trichy', 'Residential bungalow structural design and drawings.', 0),
('Mr. Suresh Krishn Residence, Chennai', 'bungalow', 'Kembhavi Architecture Foundation, Bangalore', 'Premium bungalow structural consultancy with basement.', 0);
