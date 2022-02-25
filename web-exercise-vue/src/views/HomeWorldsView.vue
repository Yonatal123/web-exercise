<template>
  <div class="homeWorlds">
    <img src="../assets/planet.png" class="logo">
    <button id="backHomeBtn" @click="goHome">Back Home</button>
   <TableComponent :headers="charactersHeaders" :characters="planets" :numofTableColumns="2" :isLoadingInitialData="IsLoadingInitialData"
      :isLoadingAdditionalData="IsLoadingAdditionalData" :loadingPercentege="LoadingPercentege"/>
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
        planetsData: {},
        planets:[],
        IsLoadingInitialData: true,
        IsLoadingAdditionalData: false,
        LoadingPercentege: 1,
      }
  },

  computed:{

  },
  methods:{
    goHome: function(){
      this.$router.push('/');
    },

   fetchGeneralData: function(){
        try{
          fetch("https://swapi.dev/api/planets/").then(res =>
            res.json().then(data => {
              this.planetsData = data;
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
    this.constructPlanets(6, this.planetsData.count - 1)
  },

  constructPlanets: async function(firstIndex, lastIndex){
   for(let i = firstIndex; i <= lastIndex; i++){
       try{
        const res = await fetch("https://swapi.dev/api/planets/" + i);
        console.log('fetched' + i);
        const resJson = await res.json();
        
        this.LoadingPercentege = Math.round((i / lastIndex) * 100);
        
        await this.planets.push([resJson.name, resJson.terrain]);
       }
       catch (err){
           console.log("Failed to fetch " + i + " " + err);
       }
     }
   this.IsLoadingAdditionalData = false;
   },
  },

 mounted(){
    this.fetchGeneralData()
  }

}

</script>
