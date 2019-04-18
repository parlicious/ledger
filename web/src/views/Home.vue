<template>
  <div class="home">
    <google-sign-in-component></google-sign-in-component>
  </div>
</template>

<script>
import GoogleSignInComponent from '../components/GoogleSignInComponent.vue';

export default {
  name: 'home',
  components: {
    GoogleSignInComponent,
  },
};
</script>
