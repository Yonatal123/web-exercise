import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createStore } from 'vuex'


   const store = createStore({
    state(){
      return{
         characters:[],
         charactersData:{},
         amountLoaded: 0
      }
    },
    mutations:{
      addCharacter(state, character){
        state.characters.push(character);
      },
      setCharactersData(state, data){
        state.charactersData = data;
      },
      updateAmountLoaded(state, number){
          state.amountLoaded = number;
      }
    }
  })

  const app = createApp(App);
  app.use(router);
  app.use(store);
  app.mount('#app');


