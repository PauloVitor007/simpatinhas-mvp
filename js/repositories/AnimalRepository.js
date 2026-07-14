import { Database } from "../models/Database.js";
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export class AnimalRepository {
  constructor() {
    this.db = Database.getInstancia().getConexao();
    this.colecao = collection(this.db, "animais");
  }

  async buscarTodos() {
    try {
      const q = query(this.colecao, orderBy("data_cadastro", "desc"));
      const querySnapshot = await getDocs(q);
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      return lista;
    } catch (erro) {
      console.error("Erro ao buscar animais no Firebase:", erro);
      return [];
    }
  }

  async buscarPorId(id) {
    const lista = await this.buscarTodos();
    return lista.find((animal) => animal.id === id) || null;
  }

  async buscarDisponiveisParaAdocao(filtros = {}) {
    let lista = await this.buscarTodos();
    
    // Filtra apenas os animais com status "disponivel"
    lista = lista.filter((animal) => animal.status_atual === "disponivel");

    // Aplica filtro opcional de espécie (Cão/Gato)
    if (filtros.especie && filtros.especie !== "todos") {
      lista = lista.filter((animal) => animal.especie === filtros.especie);
    }

    // Aplica filtro opcional de porte (Pequeno/Médio/Grande)
    if (filtros.porte && filtros.porte !== "todos") {
      lista = lista.filter((animal) => animal.porte === filtros.porte);
    }

    return lista;
  }

  async cadastrar(dadosAnimal) {
    try {
      const novoAnimal = {
        nome: dadosAnimal.nome || "Sem Nome",
        especie: dadosAnimal.especie || "outro",
        raca: dadosAnimal.raca || "SRD",
        porte: dadosAnimal.porte || "medio",
        sexo: dadosAnimal.sexo || "indefinido",
        idade_estimada: dadosAnimal.idade_estimada || "Não informada",
        peso_kg: parseFloat(dadosAnimal.peso_kg) || 0,
        status_atual: dadosAnimal.status_atual || "em_tratamento",
        castrado: !!dadosAnimal.castrado,
        vacinado: !!dadosAnimal.vacinado,
        teste_zoonose: dadosAnimal.teste_zoonose || "pendente",
        observacoes: dadosAnimal.observacoes || "",
        foto_emoji: dadosAnimal.especie === "gato" ? "🐈" : "🐕",
        data_cadastro: new Date().toISOString(),
      };

      const docRef = await addDoc(this.colecao, novoAnimal);
      console.log("Animal salvo com ID: ", docRef.id);
      return docRef.id;
    } catch (erro) {
      console.error("Erro ao salvar animal no Firebase: ", erro);
      throw erro;
    }
  }

  async atualizar(id, novosDados) {
    try {
      const docRef = doc(this.db, "animais", id);
      const atualizacoes = {
        ...novosDados,
        data_atualizacao: new Date().toISOString()
      };
      await updateDoc(docRef, atualizacoes);
      console.log(`Animal ${id} atualizado com sucesso no Firebase.`);
      return true;
    } catch (erro) {
      console.error("Erro ao atualizar animal no Firebase:", erro);
      return false;
    }
  }

  async obterMetricas() {
    const todos = await this.buscarTodos();
    
    const castrados = todos.filter((a) => a.castrado).length;
    const vacinados = todos.filter((a) => a.vacinado).length;
    const zoonosesAtivas = todos.filter((a) => a.teste_zoonose === "positivo").length;
    const disponiveis = todos.filter((a) => a.status_atual === "disponivel").length;
    const emTratamento = todos.filter((a) => a.status_atual === "em_tratamento").length;
    const adotados = todos.filter((a) => a.status_atual === "adotado").length;

    return {
      total: todos.length,
      castrados,
      vacinados,
      zoonosesAtivas,
      disponiveis,
      emTratamento,
      adotados,
      caes: todos.filter((a) => a.especie === "cachorro").length,
      gatos: todos.filter((a) => a.especie === "gato").length,
      outros: todos.filter((a) => a.especie === "outro").length
    };
  }
}

export default AnimalRepository;
