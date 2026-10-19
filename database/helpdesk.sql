-- 1. Criar o banco de dados do projeto
CREATE DATABASE IF NOT EXISTS helpdesk_db;
USE helpdesk_db;

-- 2. Criar a tabela de SOLICITANTES
CREATE TABLE IF NOT EXISTS solicitantes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    setor VARCHAR(50) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Criar a tabela de CATEGORIAS
CREATE TABLE IF NOT EXISTS categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL UNIQUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Criar a tabela de TECNICOS
CREATE TABLE IF NOT EXISTS tecnicos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    especialidade VARCHAR(50),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Criar a tabela central de CHAMADOS
CREATE TABLE IF NOT EXISTS chamados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    prioridade VARCHAR(20) DEFAULT 'MEDIA',
    status VARCHAR(20) DEFAULT 'ABERTO',
    solucao TEXT,
    solicitante_id INT NOT NULL,
    categoria_id INT NOT NULL,
    tecnico_id INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (solicitante_id) REFERENCES solicitantes(id) ON DELETE RESTRICT,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
    FOREIGN KEY (tecnico_id) REFERENCES tecnicos(id) ON DELETE SET NULL
);

-- 6. Inserir categorias padrão
INSERT IGNORE INTO categorias (nome) VALUES ('Hardware'), ('Software'), ('Redes'), ('Acessos');

-- 7. Inserir técnicos de exemplo
INSERT IGNORE INTO tecnicos (nome, email, especialidade) VALUES
('Carlos Silva', 'carlos.silva@empresa.com', 'Hardware'),
('Marina Costa', 'marina.costa@empresa.com', 'Software'),
('Rafael Lima', 'rafael.lima@empresa.com', 'Redes');