<template>
  <router-view />
</template>

<script>
export default {
  mounted ()  {
    this.$store.dispatch("loadDeck");
    this.$store.dispatch("shuffle");
  }
};
</script>
