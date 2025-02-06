# 🍃 **Disconnectly API**

**Disconnectly API** é uma aplicação backend projetada para ajudar pessoas a se desconectar da tecnologia e focar em momentos offline.  
Oferece funcionalidades como:
- Planejamento de tempos offline.
- Integração com contatos de emergência.
- Estatísticas de progresso.
- Sugestões personalizadas de atividades offline.  

---

### ✅ **Requisitos funcionais**
- Cadastro de usuários (nome, e-mail, senha).
- Login e autenticação de usuários.
- Recuperação de senha.
- Planejamento de desconexão (definir horários de tempo offline).
- Gerenciamento de contatos de emergência (adicionar, editar, remover).
- Relatórios de progresso (mostrar o quanto o usuário se desconectou).
- Sugestões de atividades offline.

---

### 🔧 **Rotas da API**

#### **🔐 Autenticação e Usuários**
- [X] **POST /auth/register**  
  Registra um novo usuário.

- [X] **POST /auth/login**  
  Realiza o login de um usuário.

- [] **POST /auth/forgot-password**  
  Inicia o processo de recuperação de senha.

---

#### **📅 Planejamento de Desconexão**
- [] **POST /disconnect/plan**  
  Cria um novo plano de desconexão.

- [] **GET /disconnect/plans**  
  Retorna todos os planos de desconexão cadastrados.

- [] **DELETE /disconnect/plan/{plan_id}**  
  Cancela um plano de desconexão específico.

---

#### **📞 Contatos de Emergência**
- [] **POST /emergency/contacts**  
  Adiciona um novo contato de emergência.

- [] **GET /emergency/contacts**  
  Retorna os contatos de emergência cadastrados.

- [] **DELETE /emergency/contacts/{contact_id}**  
  Remove um contato de emergência.

---

#### **📊 Estatísticas e Relatórios**
- [] **GET /stats/progress**  
  Retorna o progresso do usuário no tempo offline.

- [] **GET /stats/reports**  
  Gera um relatório detalhado sobre o impacto do tempo offline.

---

#### **📝 Sugestões de Atividades**
- [] **GET /activities/suggestions**  
  Retorna sugestões de atividades offline baseadas nas preferências do usuário.

---

### 🚀 **Próximos Passos**
- Expandir as sugestões de atividades com base em dados de preferências do usuário.
- Implementar notificações automáticas para lembrar os usuários de seus planos de desconexão.
