export const HOSTINGER_SCHEMA_SQL = `-- ========================================================
-- BANCO DE DADOS FITPULSE - HOSTINGER MYSQL
-- Compatível com phpMyAdmin / MySQL 5.7+ / MariaDB 10.3+
-- ========================================================

CREATE DATABASE IF NOT EXISTS \`u123456789_fitpulse\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`u123456789_fitpulse\`;

-- 1. TABELA DE PERSONAL TRAINERS
CREATE TABLE IF NOT EXISTS \`trainers\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nome\` VARCHAR(120) NOT NULL,
  \`email\` VARCHAR(120) NOT NULL UNIQUE,
  \`senha_hash\` VARCHAR(255) NOT NULL,
  \`chave_pix\` VARCHAR(150) NOT NULL,
  \`banco_pix\` VARCHAR(80) DEFAULT 'Itaú Unibanco',
  \`foto_url\` TEXT,
  \`criado_em\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. TABELA DE ALUNOS
CREATE TABLE IF NOT EXISTS \`alunos\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`trainer_id\` INT NOT NULL DEFAULT 1,
  \`nome\` VARCHAR(120) NOT NULL,
  \`email\` VARCHAR(120),
  \`telefone\` VARCHAR(30),
  \`foto_url\` TEXT,
  \`status\` ENUM('active', 'pending', 'inactive') DEFAULT 'active',
  \`plano\` VARCHAR(80) NOT NULL,
  \`objetivo\` VARCHAR(150),
  \`mensalidade\` DECIMAL(10,2) NOT NULL DEFAULT 350.00,
  \`em_dia\` TINYINT(1) DEFAULT 1,
  \`ultimo_treino\` VARCHAR(80),
  \`renovacao\` VARCHAR(80),
  \`idade\` INT DEFAULT 28,
  \`altura\` VARCHAR(20) DEFAULT '1.68m',
  \`peso_atual\` DECIMAL(5,2) DEFAULT 63.40,
  \`adesao_pct\` INT DEFAULT 94,
  \`volume_total_kg\` INT DEFAULT 14800,
  \`criado_em\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. TABELA DE COBRANÇAS E PIX
CREATE TABLE IF NOT EXISTS \`cobrancas_pix\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`aluno_id\` INT NOT NULL,
  \`valor\` DECIMAL(10,2) NOT NULL,
  \`status\` ENUM('pagos', 'pendentes', 'atrasados') DEFAULT 'pendentes',
  \`plano_referencia\` VARCHAR(100),
  \`chave_pix\` TEXT,
  \`vencimento\` DATE NOT NULL,
  \`data_pagamento\` DATETIME NULL,
  \`comprovante_id\` VARCHAR(100) NULL,
  \`criado_em\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`aluno_id\`) REFERENCES \`alunos\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. TABELA DE PLANILHAS E TREINOS
CREATE TABLE IF NOT EXISTS \`treinos\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`aluno_id\` INT NOT NULL,
  \`nome_plano\` VARCHAR(150) NOT NULL,
  \`versao\` VARCHAR(30) DEFAULT 'v2.4 Ativa',
  \`duracao_semanas\` INT DEFAULT 8,
  \`frequencia_semanal\` VARCHAR(40) DEFAULT '4x/sem',
  \`nivel\` VARCHAR(40) DEFAULT 'Interm.',
  \`status\` ENUM('ativo', 'rascunho', 'arquivado') DEFAULT 'ativo',
  \`criado_em\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`aluno_id\`) REFERENCES \`alunos\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. TABELA DE EXERCÍCIOS
CREATE TABLE IF NOT EXISTS \`exercicios\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`treino_id\` INT NOT NULL,
  \`dia_semana\` VARCHAR(50) NOT NULL DEFAULT 'Seg • Treino A',
  \`ordem\` INT NOT NULL DEFAULT 1,
  \`nome\` VARCHAR(120) NOT NULL,
  \`grupo_muscular\` VARCHAR(100),
  \`equipamento\` VARCHAR(100),
  \`imagem_url\` TEXT,
  \`instrucao_tecnica\` TEXT,
  \`tag\` VARCHAR(50) NULL,
  FOREIGN KEY (\`treino_id\`) REFERENCES \`treinos\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. TABELA DE SÉRIES
CREATE TABLE IF NOT EXISTS \`series\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`exercicio_id\` INT NOT NULL,
  \`numero_serie\` INT NOT NULL,
  \`tipo\` VARCHAR(30) DEFAULT 'Trabalho',
  \`repeticoes\` INT NOT NULL DEFAULT 10,
  \`peso_kg\` DECIMAL(6,2) NOT NULL DEFAULT 20.00,
  \`pausa_segundos\` INT NOT NULL DEFAULT 90,
  FOREIGN KEY (\`exercicio_id\`) REFERENCES \`exercicios\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. TABELA DE SESSÕES CONCLUÍDAS (FEEDBACK / PSE)
CREATE TABLE IF NOT EXISTS \`treinos_concluidos\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`aluno_id\` INT NOT NULL,
  \`treino_id\` INT NULL,
  \`tempo_min\` INT DEFAULT 52,
  \`calorias_kcal\` INT DEFAULT 435,
  \`carga_total_kg\` INT DEFAULT 3840,
  \`exercicios_concluidos\` VARCHAR(30) DEFAULT '6/6',
  \`pse_intensidade\` INT DEFAULT 8,
  \`recado_coach\` TEXT,
  \`selfie_url\` TEXT,
  \`data_conclusao\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`aluno_id\`) REFERENCES \`alunos\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================================
-- DADOS INICIAIS (SEED)
-- ========================================================
INSERT INTO \`trainers\` (\`id\`, \`nome\`, \`email\`, \`senha_hash\`, \`chave_pix\`, \`banco_pix\`, \`foto_url\`)
VALUES (1, 'Carlos Rossi', 'carlos@fitpulse.com.br', '$2y$10$abcdefghijklmnopqrstuvwxyz0123456789', 'fitpulse-carlos-trainer@pix.com.br', 'Itaú Unibanco', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8hnhzM6XugqrFM4lq5x-hPRYfCZU5quw_V_Bvs8ZtAU4eVZneCW7DghUUH50lYD13yhOIlDrVluLjP0dKvFEA2zJktktkG0M70uBkVC7VWWuTLUpwJU-xG13htHiABQPfKREKO-kQcZ9S6XXgOXo4_zWuwdQeUxDz_W_PFUjNCdAXxqhdyiZKF4jKTKP9Yb1DoWVZ0Gm_peWtN0D5W6_hD-Qov-0y3yqdOxH7hZfuieIh7EU6JVwLwA');

INSERT INTO \`alunos\` (\`id\`, \`nome\`, \`email\`, \`foto_url\`, \`status\`, \`plano\`, \`objetivo\`, \`mensalidade\`, \`em_dia\`, \`ultimo_treino\`, \`renovacao\`, \`idade\`, \`altura\`, \`peso_atual\`, \`adesao_pct\`, \`volume_total_kg\`) VALUES
(1, 'Mariana Silva', 'mariana@email.com', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvGNwfQFp3b2oX6sS2FiIGOHjBw8ClolBnnw4rvnYJLuMD1U1gz60HjbFQrtu2JlyEORPQXzul7BhuGrwYMeRIdx1hHcogsCUxLHNiLqmSR0fxJoAI6u24Yln1h1HdAItFsnFi2tBFXivi230Rvjid_IOdISTkkj1G5zM2-6J0Xuovn0ZnPTLVWyrTRp-S7mUIa8lUX1sKHMSdx-jBty3Ks-pbXQYVSDC0_SJoFyqFqs_h_1TwXiWkPw', 'active', 'Premium Trimestral', 'Emagrecimento & Definição', 350.00, 1, 'Hoje às 07:30', '15/11/2026', 28, '1.68m', 63.40, 94, 14800),
(2, 'João Pedro', 'joao@email.com', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3pa4LZc0oxLd9wyDyRvbys7SK1yOanWRSdHtmZ5dx7QJreMzTdX64CjeMWBdlG1Vf-ve1tz0NZ2NSh7uRGPbsPJegI89GGkFbQbXyfhOo2-gBsYepxBbqmAJdgPpiPz5hs-kRh6LZxPSJnFipIWH3zaOp3xxEjmsnSOHp9q5M67Exc6czEyYjjpl-ffgB2QoXNiwZ6T11sjRNFZWYFfsBpvvJerEpzGmxQJ3ob0bxU-cgj4TEhHf8NQ', 'active', 'Consultoria Online', 'Hipertrofia - Upper/Lower', 220.00, 1, 'Ontem', '10/11/2026', 24, '1.78m', 76.50, 88, 18200),
(3, 'Ana Carolina', 'ana@email.com', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFqNGnmApQjppfb2TTsJMDxOQvne86KKXGgkW5apVM_pc-B1d67oFcrsCxKz7JP7QdfMxtjAHnBLBUXQi0y3V_h4h715CrCBwmjHhOP_DIkA6HW-EnCDTl0_1AIJ0-tMlptKlR0BiJgPW29Z9oj9HM5ULQFVprarpXZeJgoVjwQHhS8mHP635RVgCuMloiK8nW7yXRUjBvGfXMulECBPVTd01bcbzGvqhI-wSQNcMhTM4AdAbWBNStCA', 'pending', 'Personal Híbrido', 'Condicionamento & Postura', 450.00, 0, '14/10 às 18:00', '18/10/2026', 31, '1.64m', 58.20, 75, 8900),
(4, 'Lucas Oliveira', 'lucas@email.com', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBej2pVjcf0nLQLS2D_MMp72EfaclwrlMMAhcVpNucc5sjgz1Jy5RWg4UiMb7pc3oEK2DInI_ZNwkk43B5aKg2xzrFG5No7Gk8YYIrGlNbx3fEdoS1kkeG-QhDISfsCzIskGY9ehKf35eTr0k6t5bE9OzgI_RefAMqzMWeL-aTm19DT0c_dpCKuBdFweF_82WbLCsEsiMjAdqiFQUOXMgjlCVprItq0exVVGwR8eU__oXBLyPLhxcj1rw', 'active', 'Mensal', 'Força & Powerlifting', 300.00, 1, 'Hoje às 06:00', '12/11/2026', 27, '1.82m', 88.00, 96, 28500),
(5, 'Rafael Costa', 'rafael@email.com', 'https://lh3.googleusercontent.com/aida/AEtjO1X-3hVyv7XoKy0IKTie8i_Gr6FG3pLMJ9SrzykiBfICfMFtkSi1--5Gn6GngXOtYhQKRXPlKXyyG8zF2FpjllneCPkV8Y2iNOSJK4sHd7o17LWZpaBlxNqt2xTZi6icPfuRMwLYo_jD7n267N8e6bjefw3zMTYvSjr0MMnxTgJTvppsm5DZ4yZuTTTfJHd_Ij3_AT4EeqSiegYmzFqLSK0WWmEjRIvzQiMHyhIEqLP247FDxxNBgRg-0qg', 'pending', 'Consultoria Trimestral', 'Reabilitação & Ganho', 320.00, 0, '10/10', '14/10/2026', 34, '1.75m', 79.00, 70, 12400);

INSERT INTO \`cobrancas_pix\` (\`id\`, \`aluno_id\`, \`valor\`, \`status\`, \`plano_referencia\`, \`chave_pix\`, \`vencimento\`, \`data_pagamento\`, \`comprovante_id\`) VALUES
(1, 5, 320.00, 'atrasados', 'Consultoria Trimestral Presencial', '00020126580014br.gov.bcb.pix0136fitpulse-carlos-trainer@pix.com.br5204000053039865406320.005802BR5913Carlos Trainer6009Sao Paulo62070503***6304E8A2', '2026-10-14', NULL, NULL),
(2, 3, 450.00, 'pendentes', 'Personal Híbrido 2x/sem', '00020126580014br.gov.bcb.pix0136fitpulse-carlos-trainer@pix.com.br5204000053039865406450.005802BR5913Carlos Trainer6009Sao Paulo62070503***6304D1B9', '2026-10-16', NULL, NULL),
(3, 1, 350.00, 'pagos', 'Premium Semestral', '00020126580014br.gov.bcb.pix0136fitpulse-carlos-trainer@pix.com.br5204000053039865406350.005802BR5913Carlos Trainer6009Sao Paulo62070503***6304C741', '2026-10-15', '2026-10-15 09:24:00', 'TID #FP-9982421');
`;

export const HOSTINGER_CONFIG_PHP = `<?php
/**
 * FitPulse - Configuração de Conexão com Banco de Dados Hostinger
 * Salve este arquivo como: config.php na raiz ou na pasta /api do seu servidor Hostinger
 */

// DEFINIÇÕES DO BANCO DE DADOS NA HOSTINGER (Obtenha em: hPanel -> Bancos de Dados MySQL)
define('DB_HOST', 'localhost');                  // Geralmente 'localhost' na Hostinger
define('DB_NAME', 'u123456789_fitpulse');        // Nome do banco criado no hPanel
define('DB_USER', 'u123456789_admin');           // Usuário do banco criado no hPanel
define('DB_PASS', 'SuaSenhaSeguraAqui123!');     // Senha do usuário do banco
define('DB_CHARSET', 'utf8mb4');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'sucesso' => false,
        'erro'    => 'Falha na conexão com banco de dados Hostinger: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit();
}
?>
`;

export const HOSTINGER_API_PHP = `<?php
/**
 * FitPulse - API RESTful PHP para Hostinger
 * Salve este arquivo como: api.php na pasta /api ou na raiz do seu site
 * Exemplo de chamadas:
 * GET  api.php?acao=listar_alunos
 * GET  api.php?acao=listar_cobrancas
 * POST api.php?acao=nova_cobranca_pix
 * POST api.php?acao=concluir_treino
 */

require_once __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');

$acao = $_GET['acao'] ?? '';
$metodo = $_SERVER['REQUEST_METHOD'];
$corpoInput = json_decode(file_get_contents('php://input'), true) ?? [];

switch ($acao) {
    // 1. LISTAR ALUNOS
    case 'listar_alunos':
        try {
            $stmt = $pdo->query("SELECT * FROM alunos ORDER BY id ASC");
            $alunos = $stmt->fetchAll();
            echo json_encode(['sucesso' => true, 'total' => count($alunos), 'dados' => $alunos]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
        }
        break;

    // 2. LISTAR COBRANÇAS PIX
    case 'listar_cobrancas':
        try {
            $sql = "SELECT c.*, a.nome as aluno_nome, a.foto_url as aluno_foto 
                    FROM cobrancas_pix c 
                    INNER JOIN alunos a ON a.id = c.aluno_id 
                    ORDER BY c.vencimento ASC";
            $stmt = $pdo->query($sql);
            $cobrancas = $stmt->fetchAll();
            echo json_encode(['sucesso' => true, 'dados' => $cobrancas]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
        }
        break;

    // 3. CRIAR NOVA COBRANÇA PIX
    case 'nova_cobranca_pix':
        if ($metodo !== 'POST') {
            http_response_code(405);
            echo json_encode(['sucesso' => false, 'erro' => 'Método inválido']);
            exit;
        }
        $alunoId = $corpoInput['aluno_id'] ?? 1;
        $valor = $corpoInput['valor'] ?? 0;
        $vencimento = $corpoInput['vencimento'] ?? date('Y-m-d', strtotime('+3 days'));
        $plano = $corpoInput['plano'] ?? 'Mensalidade FitPulse';

        // Gera payload Pix simulado
        $chavePix = "00020126580014br.gov.bcb.pix0136fitpulse-carlos-trainer@pix.com.br520400005303986540" . number_format($valor, 2, '.', '') . "5802BR5913Carlos Trainer6009Sao Paulo62070503***6304" . strtoupper(substr(md5(uniqid()), 0, 4));

        try {
            $stmt = $pdo->prepare("INSERT INTO cobrancas_pix (aluno_id, valor, status, plano_referencia, chave_pix, vencimento) VALUES (?, ?, 'pendentes', ?, ?, ?)");
            $stmt->execute([$alunoId, $valor, $plano, $chavePix, $vencimento]);
            $novoId = $pdo->lastInsertId();
            echo json_encode([
                'sucesso' => true,
                'mensagem' => 'Cobrança Pix criada com sucesso!',
                'cobranca_id' => $novoId,
                'chave_pix' => $chavePix
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
        }
        break;

    // 4. CONCLUIR TREINO (SALVAR FEEDBACK PSE)
    case 'concluir_treino':
        if ($metodo !== 'POST') {
            http_response_code(405);
            echo json_encode(['sucesso' => false, 'erro' => 'Método inválido']);
            exit;
        }
        $alunoId = $corpoInput['aluno_id'] ?? 1;
        $tempoMin = $corpoInput['tempo_min'] ?? 52;
        $calorias = $corpoInput['calorias_kcal'] ?? 435;
        $cargaTotal = $corpoInput['carga_total_kg'] ?? 3840;
        $pse = $corpoInput['pse_intensidade'] ?? 8;
        $recado = $corpoInput['recado_coach'] ?? '';
        $selfieUrl = $corpoInput['selfie_url'] ?? '';

        try {
            $stmt = $pdo->prepare("INSERT INTO treinos_concluidos (aluno_id, tempo_min, calorias_kcal, carga_total_kg, pse_intensidade, recado_coach, selfie_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$alunoId, $tempoMin, $calorias, $cargaTotal, $pse, $recado, $selfieUrl]);
            echo json_encode(['sucesso' => true, 'mensagem' => 'Treino registrado com sucesso!']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
        }
        break;

    default:
        echo json_encode([
            'sucesso' => true,
            'api' => 'FitPulse Hostinger REST API v1.0',
            'rotas_disponiveis' => [
                'GET  ?acao=listar_alunos',
                'GET  ?acao=listar_cobrancas',
                'POST ?acao=nova_cobranca_pix',
                'POST ?acao=concluir_treino'
            ]
        ]);
        break;
}
?>
`;
