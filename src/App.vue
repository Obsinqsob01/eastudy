<template>
  <div id="app">
    <notifications group="eastudy" position="bottom right" classes="notification-style"/>
    <Navbar/>
    <div class="container" id="main-container" v-if="$route.name !== 'home'">
      <transition name="fade">
        <router-view/>
      </transition>
    </div>
    <transition name="fade" v-else>
      <router-view/>
    </transition>
    <page-footer/>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import PageFooter from "@/components/PageFooter.vue";

export default {
  name: "App",
  components: {
    Navbar,
    PageFooter
  },
  data() {
    return {
      user: []
    };
  },
  beforeUpdate() {
    this.$store.dispatch("SET_INIT_QUESTIONS");

    if (this.$firebase.auth().currentUser) {
      this.initVerifications();
    }
  },
  created() {
    this.$firebase.auth().onAuthStateChanged(user => {
      this.$router.push("/");

      this.user = user;

      this.initVerifications();

      this.$store.dispatch("SET_USER", user);

      if (user) {
        this.initVerifications();
      } else {
        this.$store.dispatch("SET_ADMIN", false);
      }
    });

    this.$firebase
      .database()
      .ref("/questions")
      .on("child_added", res => {
        let questions = [];

        res.forEach(snap => {
          questions.push({
            uid: snap.key,
            data: snap.val()
          });
        });

        questions.reverse();

        this.$store.commit("updateQuestions", questions);
      });
  },
  methods: {
    initVerifications() {
      if (this.user) {
        let email = this.user.email.split("@")[0];
      email.replace(/\./g, "-");
      this.$firebase
        .database()
        .ref(`/admins/emails/${email}`)
        .on("value", res => {
          if (res.val() == this.user.email) {
            this.$store.dispatch("SET_INIT_QUESTIONS_ADMIN");
            this.$store.dispatch("SET_ADMIN", true);
          }
        });
      }
    }
  }
};
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#main-container {
  margin-top: 1em;
}

textarea {
  resize: none !important;
}

label {
  font-weight: 700;
}

.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}
.card-title {
  color: white !important;
  font-weight: 500;
}
ul,
.ul-tabs {
  list-style-type: none !important;
}
</style>
