<template>
  <div class="home">
      <img src="../assets/logo.png" height="200px" class="logo">
    <TableComponent :headers="charactersHeaders" :characters="characters" :numofTableColumns="3" :isLoadingInitialData="IsLoadingInitialData"
      :isLoadingAdditionalData="IsLoadingAdditionalData" :loadingPercentege="LoadingPercentege" v-on:row-clicked="rowClickedEvent"/>
      <div id="CharacterModal" class="modal" v-show="showSelectedModal">
        <div class="modal-content">
            <span class="close" @click="closeModal">&times;</span>
            <h1 id="modalText">{{selectedCharacter[0]}}</h1>
            <p id="characterHeight" class="characterData">{{characterHeight}}</p>
            <p id="characterMass" class="characterData">{{characterMass}}</p>
            <p id="characterHairColor" class="characterData">{{characterHairColor}}</p>
            <p id="characterSkinColor" class="characterData">{{characterSkinColor}}</p>
            <p id="characterEyeColor" class="characterData">{{characterEyeColor}}</p>
            <p id="characterBirthYear" class="characterData">{{characterBirthYear}}</p>
            <p id="characterGender" class="characterData">{{characterGender}}</p>
          </div>
    </div>
</div>
</template>

<script>
import TableComponent from '../components/TableComponent.vue'
import '../style.css'

export default {
  name: 'HomeView',
  components:{
      TableComponent,
  },
 props: {
  },
    data(){
    return {
    charactersHeaders: [
      {name: "Name", isLinkHeader: false, link:""},
      {name: "Gender", isLinkHeader: false, link:""},
      {name: "Home World", isLinkHeader: true, link: "homeworlds"}
     ],
     charactersData:{},
     characters:[],
     IsLoadingInitialData: true,
     IsLoadingAdditionalData: false,
     LoadingPercentege: 1,
     selectedCharacter: {},
     showSelectedModal: false
    }
  },
  computed:{
    characterHeight: function(){
      return "Height: " + this.selectedCharacter[4];
    },
    characterMass: function(){
      return "Mass: " + this.selectedCharacter[5];
    },
    characterHairColor: function(){
      return "Hair Color: " + this.selectedCharacter[6];
    },
    characterSkinColor: function(){
      return "Skin Color: " + this.selectedCharacter[7];
    },
    characterEyeColor: function(){
      return "Eye Color: " + this.selectedCharacter[8];
    },
    characterBirthYear: function(){
      return "Birth Year: " + this.selectedCharacter[9];
    },
    characterGender: function(){
      return "Gender: " + this.selectedCharacter[1];
    }
  },
  methods:{
  
  setCharacter: async function(name, gender, worldPath, height, mass, hairColor, skinColor, eyeColor, birthYear){
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

    this.characters.push([name, gender, worldName, worldPath, height, mass, hairColor, skinColor, eyeColor, birthYear]);
  },

  constructData: async function(){
    await this.constructCharacters(1, 5);
    this.IsLoadingInitialData = false;
    this.IsLoadingAdditionalData = true;
    this.LoadingPercentege = 0;
    this.constructCharacters(6, this.charactersData.count - 1)
  },
  constructCharacters: async function(firstIndex, lastIndex){
   for(let i = firstIndex; i <= lastIndex; i++){
       try{
        const res = await fetch("https://swapi.dev/api/people/" + i);
        console.log('fetched' + i);
        const resJson = await res.json();
        
        this.LoadingPercentege = Math.round((i / lastIndex) * 100);
        
        await this.setCharacter(resJson.name, resJson.gender, resJson.homeworld,
                                resJson.height, resJson.mass, resJson.hair_color, resJson.skin_color, 
                                resJson.eye_color, resJson.birth_year);
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

  //    constructDataFromJson: function(){
  //        this.charctersRawData.data.forEach( item => {
  //          this.characters.push([item.name, item.gender, this.planetsRawData.data[item.homeworld].name]);
  //    })
  //  },

    rowClickedEvent: function(name){
       Object.assign(this.selectedCharacter, this.characters.find(element => element[0] === name));
       this.showSelectedModal = true;
    },

    closeModal: function(){
      this.showSelectedModal = false;
    }
  },

  mounted(){
    this.fetchGeneralData()
    // this.constructDataFromJson()
  }
}

</script>

<style scoped>

</style>
