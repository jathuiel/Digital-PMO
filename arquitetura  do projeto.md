Digital PMO
Uma plataforma integrada para planejar, executar, monitorar e analisar projetos de capital.

O foco deixa de ser apenas acompanhar atividades. A plataforma passa a conectar pessoas, processos, documentos e dados.

** Organização do Projeto

PHP + MySQL
HTML

↓

PHP

↓

MySQL

Foi o padrão por muitos anos.

Vantagens
Fácil hospedagem
Baixo custo
Grande quantidade de exemplos


**Estrutura dos módulos

Projeto
│
├── Dashboard
│
├── Backlog
│
├── Sprint
│
├── Calendário
│
├── Gantt
│
├── Kanban
│
├── Entregas de Valor
│
├── Entregáveis
│
├── Tarefas
│
├── Legado
│
├── Indicadores
│
├── Documentos
│
└── Administração

** Modelo hierárquico

Inspirado no Azure DevOps porém adaptado para Engenharia.

Projeto

│

├── Legado
│      │
│      ├── Entrega de Valor
│      │         │
│      │         ├── Entregável
│      │         │        │
│      │         │        ├── Tarefa
│      │         │        │      │
│      │         │        │      └── Subtarefas
│      │         │
│      │         └── Backlog
│
└── Sprint

**Banco de Dados

*Projeto

ProjectID
Nome
Cliente
Status
Início
Fim

*Legado
LegacyID

ProjetoID

Código

Nome

Descrição

Responsável

Status

Prioridade

Data Criação

Data Atualização

*Entrega de Valor
ValueDeliveryID

LegacyID

Código

Nome

Objetivo

Valor Esperado

Owner

Status

Peso

Data Início

Data Fim

*Entregáveis
DeliverableID

EntregaValorID

Código

Nome

Disciplina

Percentual

Status

Responsável

Data Início

Data Fim

Dependências

*Tarefas

Aqui fica o equivalente ao Work Item do Azure DevOps.

TaskID

DeliverableID

SprintID

Título

Descrição

Tipo

Prioridade

Story Points

Horas

Responsável

Status

Data Início

Data Fim

Estimativa

Realizado

ParentTask

Ordem

*Backlog
BacklogID

TaskID

SprintID

Ranking

Story Points

Business Value

Risk

WSJF

Status
Sprint
SprintID

Nome

Objetivo

Data Início

Data Fim

Status

*Calendário

Não precisa existir tabela.

É uma VIEW.

SELECT

Início

Fim

Responsável

Tipo

Título

Status

Cor

** Gantt

Também é uma VIEW.

Nome

Pai

Início

Fim

Progresso

Dependência

Responsável

Tipo

**Fluxo Kanban

Novo

↓

Backlog

↓

Refinamento

↓

Pronto Sprint

↓

Em Desenvolvimento

↓

Em Revisão

↓

Concluído

↓

Arquivado

**Dashboard

Semelhante ao Azure DevOps.

Projetos

Sprint Atual

BurnDown

BurnUp

Throughput

Lead Time

Cycle Time

Backlog

Entregas atrasadas

** Calendário

Gantt

Kanban

Horas

Indicadores

Pendências

**Calendário

Visualização semelhante ao Outlook.

Mês

Semana

Dia

Agenda

Cada atividade vira um evento.

Cor por Status.

Cor por Disciplina.

Cor por Responsável.

**Gantt

Estrutura

Projeto

├── Legado

│

├── Entrega Valor

│      │

│      ├── Entregável

│      │      │

│      │      ├── Tarefa

Cada nível pode ser expandido.

Dependências.

Linha crítica.

Progresso.

Baseline.

** Página de uma Tarefa
Título

Descrição

Status

Sprint

Responsável

Data Início

Data Fim

Checklist

Comentários

Arquivos

Histórico

Dependências

Tempo gasto

Links

Muito semelhante ao Azure DevOps.

** Pesquisa Global

Pesquisar por:

Código
Nome
Responsável
Status
Disciplina
Sprint
Datas
Tags