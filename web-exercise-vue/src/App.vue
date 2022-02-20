<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <!-- <TableComponent :headers="charactersHeaders" :charactersData="charactersData"/> -->
  <LandingPageComponent/>
</template>

<script>

// import HelloWorld from './components/HelloWorld.vue'
// import TableComponent from './components/TableComponent.vue'
import LandingPageComponent from './components/LandingPageComponent.vue'

export default {
  name: 'App',
  components: {
    LandingPageComponent
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
  margin-top: 60px;
}
body{
  background-color: black;
}
</style>
