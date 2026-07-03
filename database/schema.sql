-- Digital PMO 

CREATE DATABASE IF NOT EXISTS digital_pmo CHARACTER SET utf8mb4;
USE digital_pmo;

CREATE TABLE Projeto (
    ProjectID   INT AUTO_INCREMENT PRIMARY KEY,
    Nome        VARCHAR(150) NOT NULL,
    Cliente     VARCHAR(150),
    Status      VARCHAR(50),
    Inicio      DATE,
    Fim         DATE
);

CREATE TABLE Legado (
    LegacyID        INT AUTO_INCREMENT PRIMARY KEY,
    ProjetoID       INT NOT NULL,
    Codigo          VARCHAR(50),
    Nome            VARCHAR(150) NOT NULL,
    Descricao       TEXT,
    Responsavel     VARCHAR(150),
    Status          VARCHAR(50),
    Prioridade      VARCHAR(50),
    DataCriacao     DATETIME DEFAULT CURRENT_TIMESTAMP,
    DataAtualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ProjetoID) REFERENCES Projeto(ProjectID)
);

CREATE TABLE EntregaValor (
    ValueDeliveryID INT AUTO_INCREMENT PRIMARY KEY,
    LegacyID        INT NOT NULL,
    Codigo          VARCHAR(50),
    Nome            VARCHAR(150) NOT NULL,
    Objetivo        TEXT,
    ValorEsperado   VARCHAR(150),
    Owner           VARCHAR(150),
    Status          VARCHAR(50),
    Peso            INT,
    DataInicio      DATE,
    DataFim         DATE,
    FOREIGN KEY (LegacyID) REFERENCES Legado(LegacyID)
);

CREATE TABLE Entregavel (
    DeliverableID   INT AUTO_INCREMENT PRIMARY KEY,
    EntregaValorID  INT NOT NULL,
    Codigo          VARCHAR(50),
    Nome            VARCHAR(150) NOT NULL,
    Disciplina      VARCHAR(100),
    Percentual      DECIMAL(5,2) DEFAULT 0,
    Status          VARCHAR(50),
    Responsavel     VARCHAR(150),
    DataInicio      DATE,
    DataFim         DATE,
    Dependencias    VARCHAR(255),
    FOREIGN KEY (EntregaValorID) REFERENCES EntregaValor(ValueDeliveryID)
);

CREATE TABLE Sprint (
    SprintID    INT AUTO_INCREMENT PRIMARY KEY,
    Nome        VARCHAR(100) NOT NULL,
    Objetivo    TEXT,
    DataInicio  DATE,
    DataFim     DATE,
    Status      VARCHAR(50)
);

-- Tarefa = equivalente ao Work Item do Azure DevOps
CREATE TABLE Tarefa (
    TaskID        INT AUTO_INCREMENT PRIMARY KEY,
    DeliverableID INT,
    SprintID      INT,
    Titulo        VARCHAR(200) NOT NULL,
    Descricao     TEXT,
    Tipo          VARCHAR(50),
    Prioridade    VARCHAR(50),
    StoryPoints   INT,
    Horas         DECIMAL(6,2),
    Responsavel   VARCHAR(150),
    Status        VARCHAR(50),
    DataInicio    DATE,
    DataFim       DATE,
    Estimativa    DECIMAL(6,2),
    Realizado     DECIMAL(6,2),
    ParentTask    INT,
    Ordem         INT,
    FOREIGN KEY (DeliverableID) REFERENCES Entregavel(DeliverableID),
    FOREIGN KEY (SprintID) REFERENCES Sprint(SprintID),
    FOREIGN KEY (ParentTask) REFERENCES Tarefa(TaskID)
);

CREATE TABLE Backlog (
    BacklogID     INT AUTO_INCREMENT PRIMARY KEY,
    TaskID        INT NOT NULL,
    SprintID      INT,
    Ranking       INT,
    StoryPoints   INT,
    BusinessValue INT,
    Risk          INT,
    WSJF          DECIMAL(6,2),
    Status        VARCHAR(50),
    FOREIGN KEY (TaskID) REFERENCES Tarefa(TaskID),
    FOREIGN KEY (SprintID) REFERENCES Sprint(SprintID)
);

-- Calendario e Gantt sao VIEWs, nao tabelas (conforme documento).

CREATE VIEW ViewCalendario AS
SELECT
    t.TaskID,
    t.DataInicio AS Inicio,
    t.DataFim    AS Fim,
    t.Responsavel,
    t.Tipo,
    t.Titulo,
    t.Status,
    CASE t.Status
        WHEN 'Concluido' THEN 'green'
        WHEN 'Em Desenvolvimento' THEN 'blue'
        WHEN 'Atrasado' THEN 'red'
        ELSE 'gray'
    END AS Cor
FROM Tarefa t;

CREATE VIEW ViewGantt AS
SELECT
    t.TaskID,
    t.Titulo   AS Nome,
    t.ParentTask AS Pai,
    t.DataInicio AS Inicio,
    t.DataFim    AS Fim,
    IFNULL(t.Realizado / NULLIF(t.Estimativa, 0) * 100, 0) AS Progresso,
    t.ParentTask AS Dependencia,
    t.Responsavel,
    t.Tipo
FROM Tarefa t;
