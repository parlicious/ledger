<template>
  <div class="signInOut">
    <div
      v-if="!signedIn"
      v-on:
      id="google-signin-button">
    </div>
    <a
      v-if="signedIn"
      v-on:click="signOut">
      Sign Out
    </a>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'GoogleSignInComponent',
  mounted() {
    this.renderGoogleSignInButton();
  },
  computed: {
    ...mapGetters([
      'signedIn',
    ]),
  },
  updated() {
    this.$nextTick(() => this.renderGoogleSignInButton());
  },
  methods: {
    async onSignIn(googleUser) {
      await this.$store.dispatch('authenticate', googleUser);
    },
    async signOut() {
      const { gapi } = window;
      const auth2 = gapi.auth2.getAuthInstance();
      await auth2.signOut();
      await this.$store.dispatch('signOut');
    },
    renderGoogleSignInButton() {
      if (!this.signedIn) {
        const { gapi } = window;
        gapi.signin2.render('google-signin-button', {
          onsuccess: this.onSignIn,
        });
      }
    },
  },
};
</script>

<style scoped>
.signInOut{
  display: flex;
  justify-content: center;
}
</style>
