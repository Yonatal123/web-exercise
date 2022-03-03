<template>
    <img src="../assets/spaceship.png" id="spaceship" v-if="isLoadingInitialData">
    <img src="../assets/horizontal_spaceship.png" id="horizontalSpaceship" v-if="isLoadingAdditionalData">
    <p id="loadingInitialText" class="loadingIndication" v-if="isLoadingInitialData">{{percentegeValue}}</p>
    <div id="loadingAdditionalIndication" class="loadingAdditionalIndication" v-if="isLoadingAdditionalData">
        <p id="loadingAdditionalText" class="topTableText">Loading additional data</p>
        <p id="loadingAdditionalPercentage" class="topTableText">{{percentegeValue}}</p>
    </div>
    <div class="pagesIndication" v-if="inversedLoadingInitialData">
        <p id="currentPageText" class="topTableText">{{currentPageText}}</p>
        <p id="totalPagesText" class="topTableText">{{totalNumOfPages}}</p>
    </div>
    <table id="dataTable" class="mainTable" v-show="inversedLoadingInitialData">
        <thead>
            <tr>
                <th v-for="item in headers" :key="item.name" @click="columnClicked(item.link)" :class="{ worldTh: item.isLinkHeader }"> 
                    {{ item.name }} 
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in itemsToDisplay" :key="item[0]">
                <td v-for="index in headers.length" :key="index" @click="rowClicked(item[0])">{{item[index-1]}}</td>
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
    items: [],
    isLoadingInitialData: Boolean,
    isLoadingAdditionalData: Boolean,
    loadingPercentege: Number,
    tableType: String
  },
  data(){
      return{
          itemsToDisplay: [],
          numOfItemsPerPage: 5,
          currentLowestIndex: 0,
          currentPage: 1
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
          return this.currentLowestIndex + 2*(this.numOfItemsPerPage) >= this.items.length - 1;
      },
      isPreviousDisabled(){
          return this.currentLowestIndex - this.numOfItemsPerPage < 0;
      },
      totalNumOfPages(){
          return Math.round((this.items.length - 1) / this.numOfItemsPerPage) - 1 === 0 ? 1 : Math.round((this.items.length - 1) / this.numOfItemsPerPage) - 1;
      },
      currentPageText(){
          const currentPageToDisplay = this.currentPage + 1;
          return "Page " + currentPageToDisplay + " of";
      }
  },
  methods:{
      setitemsToDisplay: function(){
          this.itemsToDisplay = [];
          for (let i = this.currentLowestIndex; i < this.currentLowestIndex + this.numOfNextDisplayItems; i++){
              this.itemsToDisplay.push(this.items[i]);
          }
      },
      nextButtonPressed: function(){
          if(this.currentLowestIndex + 2*(this.numOfItemsPerPage) < this.items.length)
          {
             this.currentLowestIndex += this.numOfItemsPerPage;
             this.setitemsToDisplay();
             ++this.currentPage;
             this.emitCurrentPage();
          }
      },
      previousButtonPressed: function(){
        if(this.currentLowestIndex - this.numOfItemsPerPage >=0 )
        {
            this.currentLowestIndex -= this.numOfItemsPerPage;
            this.setitemsToDisplay();
            --this.currentPage;
            this.emitCurrentPage();
        }
      },
      rowClicked: function(itemName){
          this.$emit('row-clicked', itemName);
      },
      columnClicked: function(link){
            this.$router.push('/' + link);
      },
      emitCurrentPage: function(){
          this.$emit('current-page', this.currentPage);
      }
  },
  watch:{
      isLoadingInitialData: function(val){
          if(!val){
              this.setitemsToDisplay();
          }
      }
  },
  mounted(){
      this.numOfNextDisplayItems = this.numOfItemsPerPage;
      switch(this.tableType){
          case "CHARACTERS":{
              this.currentPage = this.$store.state.currentCharactersPage;
              break;
          }
          case "PLANETS":{
              this.currentPage = this.$store.state.currentPlanetsPage;
              break;
          }
      }

      this.currentLowestIndex = this.currentPage * this.numOfItemsPerPage;
  }
}
</script>

<style scoped>
    @import '../style.css'
</style>
