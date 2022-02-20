<template>
    <img src="../assets/logo.png" height="200px" class="logo">
    <TableComponent :headers="charactersHeaders" :characters="characters" :numofTableItems="3" :isLoadingInitialData="IsLoadingInitialData"
      :isLoadingAdditionalData="IsLoadingAdditionalData" :additionalDataLoadingPercentege="LoadingPercentege"/>
</template>

<script>
import TableComponent from './TableComponent.vue'
import '../style.css'

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
        worldName = resJson.name;
    }

    this.characters.push([name, gender, worldName, worldPath]);
  },

  constructData: async function(){
    await this.constructCharacters(1, 10);
    this.IsLoadingInitialData = false;
    this.IsLoadingAdditionalData = true;
    this.constructCharacters(11, this.charactersData.count - 1)
  },
  constructCharacters: async function(firstIndex, lastIndex){
   for(let i = firstIndex; i <= lastIndex; i++){
       try{
        const res = await fetch("https://swapi.dev/api/people/" + i);
        console.log('fetched' + i);
        const resJson = await res.json();
        this.LoadingPercentege = (i / this.charactersData.count - 10) * 100;
        await this.setCharacter(resJson.name, resJson.gender, resJson.homeworld);
       }
       catch (err){
           console.log("Failed to fetch " + i + " " + err);
       }
   }
   this.IsLoadingAdditionalData = false;
  },
    fetchGeneralData: function(){
        try{
          fetch("https://swapi.dev/api/people/").then(res =>
            res.json().then(data => {
              this.charactersData = data;
        })
           ).then(this.constructData)
        } 
        catch(err){
            console.log("General fetch failed " + err);
        } 

    },
  },
  mounted(){
    this.fetchGeneralData()
  }
}

</script>

<style scoped>

</style>
