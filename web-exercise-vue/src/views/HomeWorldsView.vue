<template>
  <div class="homeWorlds">
    <img src="../assets/planet.png" class="logo">
    <button id="backHomeBtn" @click="goHome">Back Home</button>
   <TableComponent :headers="charactersHeaders" :items="planetsSet" :isLoadingInitialData="IsLoadingInitialData"
      :isLoadingAdditionalData="IsLoadingAdditionalData" :loadingPercentege="LoadingPercentege" :tableType="'PLANETS'"
      v-on:current-page="onCurrentPageUpdate"/>
  </div>
</template>
<script>
import TableComponent from '../components/TableComponent.vue'
import '../style.css'

export default {
  name: 'HomewWorldsView',
   components:{
      TableComponent,
  },
  
 props: {

  },

 data(){
      return {
        charactersHeaders: [
          {name: "Name"},
          {name: "Terrain"},
        ],
        IsLoadingInitialData: true,
        IsLoadingAdditionalData: false,
        LoadingPercentege: 1,
      }
  },

  computed:{
    planetsSet (){
      return this.$store.state.planets;
    },
  },
  methods:{
    goHome: function(){
      this.$router.push('/');
    },

   fetchGeneralData: function(){
        try{
          fetch("https://swapi.dev/api/planets/").then(res =>
            res.json().then(data => {
              this.$store.commit('setPlanetsData', data);
        })
           ).then(this.constructData)
        } 
        catch(err){
            console.log("General fetch failed " + err);
        } 

    },
  
  constructData: async function(){
    await this.constructPlanets(1, 5);
    this.IsLoadingInitialData = false;
    this.IsLoadingAdditionalData = true;
    this.LoadingPercentege = 0;
    this.constructPlanets(6, this.$store.state.planetsData.count - 1)
  },

  constructPlanets: async function(firstIndex, lastIndex){
   for(let i = firstIndex; i <= lastIndex; i++){
       try{
        const res = await fetch("https://swapi.dev/api/planets/" + i);
        console.log('fetched' + i);
        const resJson = await res.json();
        
        this.$store.commit('updatePlanetsAmountLoaded', i);
        this.setLoadingPercentege();
        
        await this.$store.commit('addPlanet', [resJson.name, resJson.terrain]); 
       }
       catch (err){
           console.log("Failed to fetch " + i + " " + err);
       }
     }
   this.IsLoadingAdditionalData = false;
   },

  setLoadingPercentege: function(){
      this.LoadingPercentege = Math.round((this.$store.state.planetsAmountLoaded / this.$store.state.planetsData.count) * 100);
    },

  onCurrentPageUpdate: function(pageNumber){
      this.$store.commit('updateCurrentPlanetsPage', pageNumber);
    }
  },

 mounted(){
   if(this.$store.state.planets.length === 0){
        this.fetchGeneralData();
    }
    else if(this.$store.state.planetsAmountLoaded < this.$store.state.planetsData.count){
      this.IsLoadingInitialData = false;
      this.IsLoadingAdditionalData = true;
      this.constructPlanets(this.$store.state.planetsAmountLoaded, this.$store.state.planetsData.count);
      this.setLoadingPercentege();
    }
    else{
      this.IsLoadingInitialData = false;
    }
  }

}

</script>
