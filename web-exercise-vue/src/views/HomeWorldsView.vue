<template>
  <div class="homeWorlds">
    <img src="../assets/planet.png" class="logo">
    <button id="backHomeBtn" @click="goHome">Back Home</button>
  </div>
</template>
<script>
// import TableComponent from '../components/TableComponent.vue'
import '../style.css'

export default {
  name: 'HomewWorldsView',

 props: {
  },

  computed:{

  },
  methods:{
    goHome: function(){
      this.$router.push('/');
    }
  },

}

</script>
