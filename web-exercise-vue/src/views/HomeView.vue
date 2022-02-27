<template>
  <div class="home">
      <img src="../assets/logo.png" height="200px" class="logo">
    <TableComponent :headers="charactersHeaders" :items="charactersSet" :numofTableColumns="3" :isLoadingInitialData="IsLoadingInitialData"
      :isLoadingAdditionalData="IsLoadingAdditionalData" :loadingPercentege="LoadingPercentege" v-on:row-clicked="rowClickedEvent" :tableType="'CHARACTERS'"
      v-on:current-page="onCurrentPageUpdate"/>
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
     IsLoadingInitialData: true,
     IsLoadingAdditionalData: false,
     LoadingPercentege: 1,
     selectedCharacter: {},
     showSelectedModal: false,
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
    },
    charactersSet (){
      return this.$store.state.characters;
    },
  },
  methods:{
  
  setCharacter: async function(name, gender, worldPath, height, mass, hairColor, skinColor, eyeColor, birthYear){
    let worldNameExists = false;
    let worldName = "";
    for(let i = 0; i < this.$store.state.characters.length; i++){
        if(worldPath === this.$store.state.characters[i].worldPath){
            worldNameExists = true;
            worldName = this.$store.state.characters[i].worldName;
            break;
        }
    }
    if(!worldNameExists){
        const res = await fetch(worldPath)
        const resJson = await res.json();
        worldName = resJson.name;
    }
  
    this.$store.commit('addCharacter', [name, gender, worldName, worldPath, height, mass, hairColor, skinColor, eyeColor, birthYear]);
  },

  constructData: async function(){
    await this.constructCharacters(1, 5);
    this.IsLoadingInitialData = false;
    this.IsLoadingAdditionalData = true;
    this.LoadingPercentege = 0;
    this.constructCharacters(6, this.$store.state.charactersData.count - 1)
  },
  constructCharacters: async function(firstIndex, lastIndex){
   for(let i = firstIndex; i <= lastIndex; i++){
       try{
        const res = await fetch("https://swapi.dev/api/people/" + i);
        console.log('fetched' + i);
        const resJson = await res.json();

        this.$store.commit('updateCharactersAmountLoaded', i);
        this.setLoadingPercentege();

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
              this.$store.commit('setCharactersData', data)
        })
           ).then(this.constructData)
        } 
        catch(err){
            console.log("General fetch failed " + err);
        } 

    },

    rowClickedEvent: function(name){
       Object.assign(this.selectedCharacter, this.$store.state.characters.find(element => element[0] === name));
       this.showSelectedModal = true;
    },

    closeModal: function(){
      this.showSelectedModal = false;
    },

    setLoadingPercentege: function(){
      this.LoadingPercentege = Math.round((this.$store.state.charactersAmountLoaded / this.$store.state.charactersData.count) * 100);
    },

    onCurrentPageUpdate: function(pageNumber){
      this.$store.commit('updateCurrentCharactersPage', pageNumber);
    }
  },

  mounted(){
    if(this.$store.state.characters.length === 0){
        this.fetchGeneralData();
    }
    else if(this.$store.state.charactersAmountLoaded < this.$store.state.charactersData.count){
      this.IsLoadingInitialData = false;
      this.IsLoadingAdditionalData = true;
      this.constructCharacters(this.$store.state.charactersAmountLoaded, this.$store.state.charactersData.count);
      this.setLoadingPercentege();
    }
    else{
      this.IsLoadingInitialData = false;
    }
  }
}

</script>

<style scoped>

</style>
