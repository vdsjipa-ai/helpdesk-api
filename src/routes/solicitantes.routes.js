const express = require('express');
const router = express.Router();
const db = require('../database/connection');

// GET /solicitantes - Listar todos
router.get('/solicitantes', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM solicitantes');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// GET /solicitantes/:id - Buscar um
router.get('/solicitantes/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM solicitantes WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ mensagem: 'Solicitante não encontrado.' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

// POST /solicitantes - Cadastrar
router.post('/solicitantes', async (req, res) => {
    const { nome, email, setor } = req.body;

    if (!nome || !email || !setor) {
        return res.status(400).json({ mensagem: 'Nome, email e setor são obrigatórios.' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO solicitantes (nome, email, setor) VALUES (?, ?, ?)',
            [nome, email, setor]
        );
        res.status(201).json({ id: result.insertId, nome, email, setor });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ mensagem: 'Já existe um solicitante com esse email.' });
        }
        res.status(500).json({ erro: err.message });
    }
});

// PUT /solicitantes/:id - Atualizar
router.put('/solicitantes/:id', async (req, res) => {
    const { nome, email, setor } = req.body;

    if (!nome || !email || !setor) {
        return res.status(400).json({ mensagem: 'Nome, email e setor são obrigatórios.' });
    }

    try {
        const [result] = await db.query(
            'UPDATE solicitantes SET nome = ?, email = ?, setor = ? WHERE id = ?',
            [nome, email, setor, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ mensagem: 'Solicitante não encontrado.' });
        res.json({ id: Number(req.params.id), nome, email, setor });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ mensagem: 'Já existe um solicitante com esse email.' });
        }
        res.status(500).json({ erro: err.message });
    }
});

// DELETE /solicitantes/:id - Excluir
router.delete('/solicitantes/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM solicitantes WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ mensagem: 'Solicitante não encontrado.' });
        res.json({ mensagem: 'Solicitante excluído com sucesso.' });
    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ mensagem: 'Não é possível excluir: o solicitante possui chamados.' });
        }
        res.status(500).json({ erro: err.message });
    }
});

module.exports = router;