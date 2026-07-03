USE digital_pmo;

INSERT INTO Projeto (Nome, Cliente, Status, Inicio, Fim) VALUES
('Expansão Planta Industrial', 'Cliente Alfa', 'Em Andamento', '2026-01-05', '2026-12-20');

INSERT INTO Legado (ProjetoID, Codigo, Nome, Descricao, Responsavel, Status, Prioridade) VALUES
(1, 'LEG-01', 'Modernização Linha 2', 'Substituição de equipamentos legados da linha 2', 'Carlos Mendes', 'Em Andamento', 'Alta');

INSERT INTO EntregaValor (LegacyID, Codigo, Nome, Objetivo, ValorEsperado, Owner, Status, Peso, DataInicio, DataFim) VALUES
(1, 'EV-01', 'Automação da Esteira', 'Reduzir tempo de ciclo em 20%', 'Redução de custo operacional', 'Ana Souza', 'Em Andamento', 8, '2026-02-01', '2026-06-30');

INSERT INTO Entregavel (EntregaValorID, Codigo, Nome, Disciplina, Percentual, Status, Responsavel, DataInicio, DataFim, Dependencias) VALUES
(1, 'ENT-01', 'Projeto Elétrico', 'Elétrica', 60, 'Em Desenvolvimento', 'Bruno Lima', '2026-02-01', '2026-04-15', NULL),
(1, 'ENT-02', 'Projeto Mecânico', 'Mecânica', 30, 'Em Desenvolvimento', 'Fernanda Alves', '2026-02-15', '2026-05-01', 'ENT-01');

INSERT INTO Sprint (Nome, Objetivo, DataInicio, DataFim, Status) VALUES
('Sprint 1', 'Levantamento e projeto elétrico', '2026-07-01', '2026-07-14', 'Concluído'),
('Sprint 2', 'Projeto mecânico e revisão', '2026-07-15', '2026-07-28', 'Em Andamento');

INSERT INTO Tarefa (DeliverableID, SprintID, Titulo, Descricao, Tipo, Prioridade, StoryPoints, Horas, Responsavel, Status, DataInicio, DataFim, Estimativa, Realizado, ParentTask, Ordem) VALUES
(1, 1, 'Levantar cargas elétricas', 'Mapear consumo dos motores', 'Tarefa', 'Alta', 5, 16, 'Bruno Lima', 'Concluído', '2026-07-01', '2026-07-05', 16, 16, NULL, 1),
(1, 1, 'Revisar diagrama unifilar', 'Atualizar diagrama com novas cargas', 'Tarefa', 'Média', 3, 8, 'Bruno Lima', 'Em Revisão', '2026-07-06', '2026-07-10', 8, 6, NULL, 2),
(2, 2, 'Dimensionar esteira', 'Calcular capacidade e motor', 'Tarefa', 'Alta', 8, 24, 'Fernanda Alves', 'Em Desenvolvimento', '2026-07-15', '2026-07-22', 24, 10, NULL, 3),
(2, 2, 'Especificar rolamentos', 'Selecionar componentes mecânicos', 'Tarefa', 'Baixa', 2, 6, 'Fernanda Alves', 'Pronto Sprint', '2026-07-20', '2026-07-24', 6, 0, NULL, 4),
(1, NULL, 'Validar fornecedor de painel', 'Cotação e homologação', 'Tarefa', 'Média', 3, 10, 'Bruno Lima', 'Refinamento', NULL, NULL, 10, 0, NULL, 5),
(2, NULL, 'Testar protótipo de esteira', 'Ensaio em bancada', 'Tarefa', 'Alta', 5, 20, 'Fernanda Alves', 'Backlog', NULL, NULL, 20, 0, NULL, 6),
(1, NULL, 'Ideia: sensor de vibração', 'Avaliar viabilidade', 'Ideia', 'Baixa', 1, 4, 'Carlos Mendes', 'Novo', NULL, NULL, 4, 0, NULL, 7);

INSERT INTO Backlog (TaskID, SprintID, Ranking, StoryPoints, BusinessValue, Risk, WSJF, Status) VALUES
(5, NULL, 1, 3, 8, 2, 4.0, 'Refinamento'),
(6, NULL, 2, 5, 13, 5, 3.6, 'Backlog'),
(7, NULL, 3, 1, 5, 1, 5.0, 'Novo');
