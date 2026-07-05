/**
 * ============================================
 * SIMPATINHAS — Seed Data (Dados Iniciais Mock)
 * ============================================
 * 
 * Dados pré-carregados para demonstração do sistema.
 * Em produção, estes dados viriam do banco de dados real (Supabase/Firebase).
 */

export const SEED_DATA = {
  // ═══════════════════════════════════════════
  // TABELA: USUARIOS
  // ═══════════════════════════════════════════
  usuarios: [
    {
      id: 'usr_001',
      nome_completo: 'Maria Silva Santos',
      email: 'maria@email.com',
      senha_hash: 'maria123', // Em produção: hash bcrypt
      tipo_perfil: 'cidadao',
      telefone: '(83) 99999-1234',
      created_at: '2025-01-15T10:30:00Z'
    },
    {
      id: 'usr_002',
      nome_completo: 'Dr. Carlos Ferreira',
      email: 'agente@ccz.pb.gov.br',
      senha_hash: 'admin123', // Em produção: hash bcrypt
      tipo_perfil: 'admin',
      telefone: '(83) 3218-5000',
      cargo: 'Médico Veterinário — CCZ João Pessoa',
      created_at: '2024-11-01T08:00:00Z'
    },
    {
      id: 'usr_003',
      nome_completo: 'João Pedro Oliveira',
      email: 'joao@email.com',
      senha_hash: 'joao123',
      tipo_perfil: 'cidadao',
      telefone: '(83) 98888-5678',
      created_at: '2025-03-20T14:15:00Z'
    }
  ],

  // ═══════════════════════════════════════════
  // TABELA: ANIMAIS
  // ═══════════════════════════════════════════
  animais: [
    {
      id: 'ani_001',
      nome: 'Thor',
      especie: 'cachorro',
      raca: 'SRD',
      porte: 'grande',
      sexo: 'macho',
      idade_estimada: '3 anos',
      peso_kg: 28.5,
      status_atual: 'disponivel',
      castrado: true,
      vacinado: true,
      teste_zoonose: 'negativo',
      observacoes: 'Dócil, brincalhão, ótimo com crianças. Resgatado em Mangabeira.',
      foto_emoji: '🐕',
      data_cadastro: '2025-04-10T09:00:00Z'
    },
    {
      id: 'ani_002',
      nome: 'Luna',
      especie: 'gato',
      raca: 'Siamês',
      porte: 'pequeno',
      sexo: 'femea',
      idade_estimada: '1 ano',
      peso_kg: 3.2,
      status_atual: 'disponivel',
      castrado: true,
      vacinado: true,
      teste_zoonose: 'negativo',
      observacoes: 'Carinhosa, calma, ideal para apartamento.',
      foto_emoji: '🐱',
      data_cadastro: '2025-05-02T11:30:00Z'
    },
    {
      id: 'ani_003',
      nome: 'Pipoca',
      especie: 'cachorro',
      raca: 'SRD',
      porte: 'pequeno',
      sexo: 'femea',
      idade_estimada: '6 meses',
      peso_kg: 4.8,
      status_atual: 'em_tratamento',
      castrado: false,
      vacinado: false,
      teste_zoonose: 'pendente',
      observacoes: 'Filhote resgatada com desnutrição. Em recuperação no CCZ.',
      foto_emoji: '🐶',
      data_cadastro: '2025-06-15T08:45:00Z'
    },
    {
      id: 'ani_004',
      nome: 'Simba',
      especie: 'gato',
      raca: 'SRD',
      porte: 'medio',
      sexo: 'macho',
      idade_estimada: '2 anos',
      peso_kg: 5.1,
      status_atual: 'disponivel',
      castrado: true,
      vacinado: true,
      teste_zoonose: 'negativo',
      observacoes: 'Independente, já adaptado à rotina de casa.',
      foto_emoji: '🐈',
      data_cadastro: '2025-03-28T16:00:00Z'
    },
    {
      id: 'ani_005',
      nome: 'Mel',
      especie: 'cachorro',
      raca: 'Labrador Mix',
      porte: 'grande',
      sexo: 'femea',
      idade_estimada: '5 anos',
      peso_kg: 32.0,
      status_atual: 'adotado',
      castrado: true,
      vacinado: true,
      teste_zoonose: 'negativo',
      observacoes: 'Adotada em Maio/2025. Família muito feliz!',
      foto_emoji: '🦮',
      data_cadastro: '2025-02-14T10:00:00Z'
    },
    {
      id: 'ani_006',
      nome: 'Bolt',
      especie: 'cachorro',
      raca: 'SRD',
      porte: 'medio',
      sexo: 'macho',
      idade_estimada: '4 anos',
      peso_kg: 18.3,
      status_atual: 'disponivel',
      castrado: true,
      vacinado: false,
      teste_zoonose: 'negativo',
      observacoes: 'Energético, precisa de espaço para correr. Aguardando vacinação.',
      foto_emoji: '🐕‍🦺',
      data_cadastro: '2025-06-01T13:20:00Z'
    },
    {
      id: 'ani_007',
      nome: 'Mia',
      especie: 'gato',
      raca: 'Persa Mix',
      porte: 'pequeno',
      sexo: 'femea',
      idade_estimada: '8 meses',
      peso_kg: 2.7,
      status_atual: 'em_tratamento',
      castrado: false,
      vacinado: false,
      teste_zoonose: 'positivo',
      observacoes: 'Em tratamento para dermatite. Teste de FIV positivo.',
      foto_emoji: '🐱',
      data_cadastro: '2025-06-20T07:30:00Z'
    },
    {
      id: 'ani_008',
      nome: 'Rex',
      especie: 'cachorro',
      raca: 'Pastor Alemão',
      porte: 'grande',
      sexo: 'macho',
      idade_estimada: '7 anos',
      peso_kg: 35.0,
      status_atual: 'disponivel',
      castrado: false,
      vacinado: true,
      teste_zoonose: 'negativo',
      observacoes: 'Dócil apesar do porte. Ex-cão de guarda, bem socializado.',
      foto_emoji: '🐕',
      data_cadastro: '2025-05-18T15:45:00Z'
    }
  ],

  // ═══════════════════════════════════════════
  // TABELA: DENUNCIAS
  // ═══════════════════════════════════════════
  denuncias: [
    {
      id: 'den_001',
      id_usuario: 'usr_001',
      tipo_denuncia: 'abandono',
      local_ocorrencia: 'Praça da Independência, Centro — João Pessoa',
      descricao: 'Cachorro de porte médio, cor caramelo, amarrado a um poste sem água ou comida. Aparenta estar há dias no local.',
      foto_url: null,
      status_denuncia: 'em_andamento',
      data_registro: '2025-06-28T09:15:00Z'
    },
    {
      id: 'den_002',
      id_usuario: 'usr_003',
      tipo_denuncia: 'maus_tratos',
      local_ocorrencia: 'Rua das Trincheiras, 450 — Tambiá, João Pessoa',
      descricao: 'Vizinho mantém 5 gatos em espaço minúsculo, sem alimentação adequada. Animais visivelmente debilitados.',
      foto_url: null,
      status_denuncia: 'pendente',
      data_registro: '2025-07-01T14:30:00Z'
    },
    {
      id: 'den_003',
      id_usuario: 'usr_001',
      tipo_denuncia: 'animal_ferido',
      local_ocorrencia: 'BR-230, próximo ao viaduto de Mangabeira',
      descricao: 'Cachorro atropelado na beira da estrada. Está vivo mas não consegue andar. Precisa de resgate urgente.',
      foto_url: null,
      status_denuncia: 'resolvida',
      data_registro: '2025-06-15T18:45:00Z'
    },
    {
      id: 'den_004',
      id_usuario: 'usr_003',
      tipo_denuncia: 'abandono',
      local_ocorrencia: 'Parque Solon de Lucena (Lagoa) — Centro, João Pessoa',
      descricao: 'Ninhada de filhotes abandonados dentro de uma caixa de papelão perto dos quiosques. Aproximadamente 4 filhotes.',
      foto_url: null,
      status_denuncia: 'em_andamento',
      data_registro: '2025-07-02T08:00:00Z'
    },
    {
      id: 'den_005',
      id_usuario: 'usr_001',
      tipo_denuncia: 'maus_tratos',
      local_ocorrencia: 'Bairro dos Novais — João Pessoa',
      descricao: 'Cavalo utilizado para carroça em condições precárias. Animal com feridas visíveis e extremamente magro.',
      foto_url: null,
      status_denuncia: 'pendente',
      data_registro: '2025-07-04T11:20:00Z'
    }
  ]
};

export default SEED_DATA;
