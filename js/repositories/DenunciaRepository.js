import { Database } from "../models/Database.js";
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Professor, este é o DenunciaRepository aplicando o padrão Repository.
// Ele encapsula os acessos à coleção "denuncias" no Cloud Firestore usando chamadas assíncronas.

export class DenunciaRepository {
  constructor() {
    this.db = Database.getInstancia().getConexao();
    this.colecao = collection(this.db, "denuncias");
  }

  async buscarTodas() {
    try {
      const q = query(this.colecao, orderBy("data_registro", "desc"));
      const querySnapshot = await getDocs(q);
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      return lista;
    } catch (erro) {
      console.error("Erro ao buscar denúncias no Firebase:", erro);
      return [];
    }
  }

  async salvar(denuncia) {
    try {
      // Garante que a data seja salva em formato ISO string para ordenação no Firebase
      if (!denuncia.data_registro) {
        denuncia.data_registro = new Date().toISOString();
      }
      const docRef = await addDoc(this.colecao, denuncia);
      console.log("Denúncia salva com ID: ", docRef.id);
      return docRef.id;
    } catch (erro) {
      console.error("Erro ao salvar denúncia no Firebase: ", erro);
      throw erro;
    }
  }

  async atualizarStatus(id, novoStatus) {
    try {
      const docRef = doc(this.db, "denuncias", id);
      await updateDoc(docRef, { status_denuncia: novoStatus });
      console.log(`Status da denúncia ${id} atualizado para ${novoStatus} no Firebase.`);
      return true;
    } catch (erro) {
      console.error("Erro ao atualizar status da denúncia no Firebase:", erro);
      return false;
    }
  }

  async obterMetricas() {
    const todas = await this.buscarTodas();
    return {
      total: todas.length,
      pendentes: todas.filter((d) => d.status_denuncia === "pendente").length,
      emAndamento: todas.filter((d) => d.status_denuncia === "em_andamento").length,
      resolvidas: todas.filter((d) => d.status_denuncia === "resolvida").length,
      abandono: todas.filter((d) => d.tipo_denuncia === "abandono").length,
      mausTratos: todas.filter((d) => d.tipo_denuncia === "maus_tratos").length,
      animalFerido: todas.filter((d) => d.tipo_denuncia === "animal_ferido").length
    };
  }
}

export default DenunciaRepository;
