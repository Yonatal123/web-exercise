<template>
    <img src="../assets/spaceship.png" id="spaceship" v-if="isLoadingInitialData">
    <img src="../assets/horizontal_spaceship.png" id="horizontalSpaceship" v-if="isLoadingAdditionalData">
    <p id="loadingInitialText" class="loadingIndication" v-if="isLoadingInitialData">{{percentegeValue}}</p>
    <div id="loadingAdditionalIndication" class="loadingAdditionalIndication" v-if="isLoadingAdditionalData">
        <p id="loadingAdditionalText">Loading additional data</p>
        <p id="loadingAdditionalPercentage">{{percentegeValue}}</p>
    </div>
    <table id="dataTable" class="mainTable" v-show="inversedLoadingInitialData">
        <thead>
            <tr>
                <th v-for="item in headers" :key="item.name" @click="columnClicked(item.link)" v-bind:class="{ worldTh: item.isLinkHeader }"> 
                    {{ item.name }} 
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in charactersToDisplay" :key="item[0]">
                <td v-for="index in numofTableColumns" :key="index" @click="rowClicked(item[0])">{{item[index-1]}}</td>
            </tr>
        </tbody>
    </table>
        <div id="previousNextBtns" v-show="inversedLoadingInitialData">
        <button id="nextBtn" @click="nextButtonPressed" :disabled="isNextDisabled">Next &#8811;</button>
        <button id="previousBtn" @click="previousButtonPressed" :disabled="isPreviousDisabled">&#8810; Previous</button>
    </div>
</template>

<script>
export default {
  name: 'TableComponent',
  props: {
    headers: [],
    characters: [],
    numofTableColumns: Number,
    isLoadingInitialData: Boolean,
    isLoadingAdditionalData: Boolean,
    loadingPercentege: Number,
  },
  data(){
      return{
          charactersToDisplay: [],
          numOfItemsPerPage: 5,
          currentLowestIndex: 0,
      }
  },
  computed:{
      inversedLoadingInitialData: function(){
          return !this.isLoadingInitialData;
      },
      percentegeValue(){
          return this.loadingPercentege + "%";
      },
      isNextDisabled(){
          return this.currentLowestIndex + 2*(this.numOfItemsPerPage) >= this.characters.length - 1;
      },
      isPreviousDisabled(){
          return this.currentLowestIndex - this.numOfItemsPerPage < 0;
      }
  },
  methods:{
      setCharactersToDisplay: function(){
          this.charactersToDisplay = [];
          for (let i = this.currentLowestIndex; i < this.currentLowestIndex + this.numOfNextDisplayItems; i++){
              this.charactersToDisplay.push(this.characters[i]);
          }
      },
      nextButtonPressed: function(){
          if(this.currentLowestIndex + 2*(this.numOfItemsPerPage) < this.characters.length)
          {
             this.currentLowestIndex += this.numOfItemsPerPage;
            this.setCharactersToDisplay();
          }
      },
      previousButtonPressed: function(){
        if(this.currentLowestIndex - this.numOfItemsPerPage >=0 )
        {
            this.currentLowestIndex -= this.numOfItemsPerPage;
            this.setCharactersToDisplay();
        }
      },
      rowClicked: function(itemName){
          this.$emit('row-clicked', itemName);
      },
      columnClicked: function(link){
            this.$router.push('/' + link);
            this.$emit('navigated-to', link);
      }
  },
  watch:{
      isLoadingInitialData: function(val){
          if(!val){
              this.setCharactersToDisplay();
          }
      }
  },
  mounted(){
      this.numOfNextDisplayItems = this.numOfItemsPerPage;
    //   this.setCharactersToDisplay();
  }
}
</script>

<style scoped>
    @import '../style.css'
</style>
