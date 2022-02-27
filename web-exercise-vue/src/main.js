import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createStore } from 'vuex'

   const store = createStore({
    state(){
      return{
         characters:[],
         charactersData:{},
         charactersAmountLoaded: 0,
         currentCharactersPage: 0,

         planets:[],
         planetsData:{},
         planetsAmountLoaded: 0,
         currentPlanetsPage: 0,
      }
    },

    mutations:{
      addCharacter(state, character){
        state.characters.push(character);
      },
      setCharactersData(state, data){
        state.charactersData = data;
      },
      updateCharactersAmountLoaded(state, number){
          state.charactersAmountLoaded = number;
      },
      updateCurrentCharactersPage(state, number){
        state.currentCharactersPage = number;
      },

      addPlanet(state, planet){
        state.planets.push(planet);
      },
      setPlanetsData(state, data){
        state.planetsData = data;
      },
      updatePlanetsAmountLoaded(state, number){
        state.planetsAmountLoaded = number
      },
      updateCurrentPlanetsPage(state, number){
        state.currentPlanetsPage = number;
      }
    }
  })

  const app = createApp(App);
  app.use(router);
  app.use(store);
  app.mount('#app');


