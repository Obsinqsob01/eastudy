<template>
  <div>
    <h1 class="h1 title is-1 has-text-centered">Añadir Pregunta</h1>
    <div class="container">
      <label class="label">Titulo</label>
      <input
        type="text"
        class="input"
        v-model="title"
        placeholder="De que color es el caballo de napoleon?"
      >
      <br>
      <br>
      <label class="label">Categoria</label>
      <div class="select">
        <select v-model="category">
          <option value="ciencias-naturales">Ciencias Naturales</option>
          <option value="matematicas">Matemáticas</option>
        </select>
      </div>
      <br>
      <br>
      <label class="label">Contenido</label>
      <textarea v-model="content" class="textarea" placeholder="Habia un caballo bonito..."></textarea>
    </div>
    <hr>
    <h2 class="subtitle is-2 has-text-centered">Respuestas</h2>

    <div class="container">
      <div v-for="answer in answers" :key="answer.id">
        <input
          type="text"
          class="input"
          v-model="answer.name"
          placeholder="El caballo se llama viernes"
        >
        <br>
        <label class="checkbox">
          <input type="checkbox" @change="onChangeIsTrue(answer.id)" v-model="answer.isTrue">
          Es la respuesta correcta?
        </label>
        <br>
        <br>
      </div>
    </div>
    <button @click="uploadQuestion()" class="button is-link">Subir</button>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "AddQuestion",
  data() {
    return {
      title: "",
      content: "",
      category: "",
      answers: [
        { id: 0, name: "", isTrue: true },
        { id: 1, name: "", isTrue: false },
        { id: 2, name: "", isTrue: false }
      ],
      actualTrue: 0
    };
  },
  methods: {
    onChangeIsTrue(key) {
      this.answers[this.actualTrue].isTrue = false;
      this.answers[key].isTrue = true;
      this.actualTrue = key;
    },

    uploadQuestion() {
      if (this.title && this.checkNullAnswers()) {
        const dbRef = firebase
          .database()
          .ref("/questions/")
          .push();

        dbRef
          .set({
            title: this.title,
            content: this.content,
            answers: this.answers,
            category: this.category,
            experience: 10,
            isActive: false
          })
          .then(res => {
            this.$notify({
              group: "eastudy",
              title: "La pregunta se ha agregado correctamente!",
              text: "Un administrador la validará en breve",
              duration: 5000,
              type: "success",
              classes: "notification-style"
            });

            this.$router.push(`/questions`);
          })
          .catch(error => {
            this.$notify({
              group: "eastudy",
              title: "Ups!",
              text: "Ocurrió un error al guardar la pregunta, intenta después!",
              duration: 5000,
              type: "error",
              classes: "notification-style"
            });
          });

        firebase
          .firestore()
          .collection("userActivity")
          .add({
            content: "Ha agregado una nueva pregunta",
            date: new Date(),
            title: "Creación de pregunta",
            uid: firebase.auth().currentUser.uid
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.$notify({
          group: "eastudy",
          title: "Ups!",
          text: "Debes de llenar todos los campos",
          duration: 5000,
          type: "error",
          classes: "notification-style"
        });
      }
    },

    checkNullAnswers() {
      return (
        this.answers[0].name &&
        this.answers[1].name &&
        this.answers[2].name &&
        this.category
      );
    }
  }
};
</script>

<style scoped>
.vs-row {
  display: flex;
  justify-content: center;
}
h1 {
  margin-bottom: 0.5em;
}
.con-vs-checkbox {
  display: flex;
  justify-content: flex-start;
}
</style>
