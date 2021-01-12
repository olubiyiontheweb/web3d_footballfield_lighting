<template>
<div id="app">
    <ThreedScene msg="Welcome to Your Vue.js App"/>
</div>
</template>

<script>
import ThreedScene from './components/ThreedScene.vue'

export default {
  name: 'App',
  components: {
    ThreedScene
  }
}
</script>

<style>
body {
    /* set margin to 0 and overflow to hidden, to
    use the complete page */
    margin: 0;
    overflow: hidden;
}
</style>