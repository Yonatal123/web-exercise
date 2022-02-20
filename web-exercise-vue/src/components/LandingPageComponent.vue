<template>
    <img src="../assets/logo.png" height="200px" class="logo">
    <TableComponent :headers="charactersHeaders" :characters="characters" :numofTableColumns="3" :isLoadingInitialData="IsLoadingInitialData"
      :isLoadingAdditionalData="IsLoadingAdditionalData" :loadingPercentege="LoadingPercentege"/>
</template>

<script>
import TableComponent from './TableComponent.vue'
import '../style.css'
// import charctersData from '../data/people.json'
// import planetsData from '../data/planets.json'

export default {
  name: 'LandingPageComponent',
  components:{
      TableComponent,
  },
 props: {
  },
    data(){
    return {
    charactersHeaders: [
      {name: "Name"},
      {name: "Gender"},
      {name: "Home World"}
     ],
     charactersData:{},
     characters:[],
    //  charctersRawData: charctersData,
    //  planetsRawData: planetsData,
     IsLoadingInitialData: true,
     IsLoadingAdditionalData: false,
     LoadingPercentege: 1,
    }
  },
  methods:{
  
  setCharacter: async function(name, gender, worldPath){
    let worldNameExists = false;
    let worldName = "";
    for(let i = 0; i < this.characters.length; i++){
        if(worldPath === this.characters[i].worldPath){
            worldNameExists = true;
            worldName = this.characters[i].worldName;
            break;
        }
    }
    if(!worldNameExists){
        const res = await fetch(worldPath)
        const resJson = await res.json();
        worldName = resJson.result.properties.name;
    }

    this.characters.push([name, gender, worldName, worldPath]);
  },

  constructData: async function(){
    await this.constructCharacters(1, 5);
    this.IsLoadingInitialData = false;
    this.IsLoadingAdditionalData = true;
    this.LoadingPercentege = 0;
    this.constructCharacters(6, this.charactersData.total_records - 1)
  },
  constructCharacters: async function(firstIndex, lastIndex){
   for(let i = firstIndex; i <= lastIndex; i++){
       try{
        const res = await fetch("https://www.swapi.tech/api/people/" + i);
        console.log('fetched' + i);
        const resJson = await res.json();
        if(this.IsLoadingAdditionalData)
        {
          this.LoadingPercentege = Math.round((i / (lastIndex - 5)) * 100);
        }
        else{
            this.LoadingPercentege = Math.round((i / lastIndex) * 100);
        }
        
        await this.setCharacter(resJson.result.properties.name, resJson.result.properties.gender, resJson.result.properties.homeworld);
       }
       catch (err){
           console.log("Failed to fetch " + i + " " + err);
       }
   }
   this.IsLoadingAdditionalData = false;
  },
    fetchGeneralData: function(){
        try{
          fetch("https://www.swapi.tech/api/people/").then(res =>
            res.json().then(data => {
              this.charactersData = data;
        })
           ).then(this.constructData)
        } 
        catch(err){
            console.log("General fetch failed " + err);
        } 

    },

     constructDataFromJson: function(){
         this.charctersRawData.data.forEach( item => {
           this.characters.push([item.name, item.gender, this.planetsRawData.data[item.homeworld].name]);
     })
   },

  },

  mounted(){
    this.fetchGeneralData()
    // this.constructDataFromJson()
  }
}

</script>

<style scoped>

</style>
