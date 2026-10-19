const express = require('express');
const router = express.Router();
const db = require('../database/connection');

// POST /chamados - Registrar um novo chamado (Regra: Status inicial ABERTO automático)
router.post('/chamados', async (req, res) => {
    const { titulo, descricao, prioridade, solicitante_id, categoria_id } = req.body;

    // Validação de dados obrigatórios
    if (!titulo || !descricao || !prioridade || !solicitante_id || !categoria_id) {
        return res.status(400).json({ mensagem: "Título, descrição, prioridade, solicitante_id e categoria_id são obrigatórios." });
    }

    // Validação das prioridades aceitas
    if (!['BAIXA', 'MEDIA', 'ALTA'].includes(prioridade.toUpperCase())) {
        return res.status(400).json({ mensagem: "A prioridade deve ser BAIXA, MEDIA ou ALTA." });
    }

    try {
        // Regra de Negócio: Verificar se o solicitante existe no banco
        const [solicitante] = await db.query('SELECT id FROM solicitantes WHERE id = ?', [solicitante_id]);
        if (solicitante.length === 0) return res.status(404).json({ mensagem: "Solicitante informado não existe." });

        // Regra de Negócio: Verificar se a categoria existe no banco
        const [categoria] = await db.query('SELECT id FROM categorias WHERE id = ?', [categoria_id]);
        if (categoria.length === 0) return res.status(404).json({ mensagem: "Categoria informada não existe." });

        // Insere o chamado forçando o status inicial como 'ABERTO'
        const query = `INSERT INTO chamados (titulo, descricao, prioridade, status, solicitante_id, categoria_id) VALUES (?, ?, ?, 'ABERTO', ?, ?)`;
        const [result] = await db.query(query, [titulo, descricao, prioridade.toUpperCase(), solicitante_id, categoria_id]);

        res.status(201).json({ id: result.insertId, titulo, status: "ABERTO", prioridade });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// PUT /chamados/:id/atendimento - Atribuir Técnico (Regra: só muda para EM_ATENDIMENTO se houver técnico)
router.put('/chamados/:id/atendimento', async (req, res) => {
    const { id } = req.params;
    const { tecnico_id } = req.body;

    if (!tecnico_id) return res.status(400).json({ mensagem: "O técnico_id é obrigatório para iniciar o atendimento." });

    try {
        // Regra de Negócio: Verificar se o técnico está cadastrado no sistema
        const [tecnico] = await db.query('SELECT id FROM tecnicos WHERE id = ?', [tecnico_id]);
        if (tecnico.length === 0) return res.status(404).json({ mensagem: "Técnico informado não está cadastrado." });

        const query = `UPDATE chamados SET tecnico_id = ?, status = 'EM_ATENDIMENTO' WHERE id = ?`;
        const [result] = await db.query(query, [tecnico_id, id]);

        if (result.affectedRows === 0) return res.status(404).json({ mensagem: "Chamado não encontrado." });
        res.json({ mensagem: "Técnico atribuído e chamado alterado para EM_ATENDIMENTO com sucesso." });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// PUT /chamados/:id/concluir - Concluir Chamado (Regra: só conclui com solução informada)
router.put('/chamados/:id/concluir', async (req, res) => {
    const { id } = req.params;
    const { solucao } = req.body;

    if (!solucao || solucao.trim() === "") {
        return res.status(400).json({ mensagem: "É obrigatório informar a solução para concluir o chamado." });
    }

    try {
        const query = `UPDATE chamados SET solucao = ?, status = 'CONCLUIDO' WHERE id = ?`;
        const [result] = await db.query(query, [solucao, id]);

        if (result.affectedRows === 0) return res.status(404).json({ mensagem: "Chamado não encontrado." });
        res.json({ mensagem: "Chamado concluído com sucesso." });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// GET /chamados - Listar todos os chamados com Filtros Simples e Consulta Resumida (INNER JOINs)
router.get('/chamados', async (req, res) => {
    const { status, prioridade } = req.query;
    let query = `
        SELECT c.id, c.titulo, c.descricao, c.prioridade, c.status, c.solucao,
               s.nome AS solicitante, s.setor, cat.nome AS categoria, t.nome AS tecnico
        FROM chamados c
        INNER JOIN solicitantes s ON c.solicitante_id = s.id
        INNER JOIN categorias cat ON c.categoria_id = cat.id
        LEFT JOIN tecnicos t ON c.tecnico_id = t.id
        WHERE 1=1
    `;
    const params = [];

    if (status) {
        query += " AND c.status = ?";
        params.push(status.toUpperCase());
    }
    if (prioridade) {
        query += " AND c.prioridade = ?";
        params.push(prioridade.toUpperCase());
    }

    try {
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;
