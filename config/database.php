<?php
/**
 * Configuração de banco de dados
 *
 * Utiliza variáveis de ambiente (recomendado) ou valores padrão para desenvolvimento.
 * Em produção, sempre configure via variáveis de ambiente.
 *
 * Variáveis de ambiente:
 * - DB_HOST: host do MySQL (padrão: 127.0.0.1)
 * - DB_NAME: nome do banco (padrão: digital_pmo)
 * - DB_USER: usuário MySQL (padrão: root)
 * - DB_PASS: senha MySQL (padrão: vazio)
 */

return [
    'host' => getenv('DB_HOST') ?: '127.0.0.1',
    'name' => getenv('DB_NAME') ?: 'digital_pmo',
    'user' => getenv('DB_USER') ?: 'root',
    'pass' => getenv('DB_PASS') ?: '',
];
