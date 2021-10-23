import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentColor: '',
    siteDict: ''
  },
  mutations: {
    setCurrentColor (state, color) {
      state.currentColor = color
    },
    setSiteDict (state, dict) {
      state.siteDict = dict
    },
    removeHighlightById (state, highlightId) {
      for (const key in state.siteDict) {
        for (let i = 0; i < state.siteDict[key].length; i++) {
          if (state.siteDict[key][i].id === highlightId) {
            const deletedObject = state.siteDict[key].splice(i, 1)[0]
            if (state.siteDict[key].length === 0) {
              delete state.siteDict[key]
            }
            const siteDict = state.siteDict
            chrome.storage.sync.set({ siteDict })
            chrome.tabs.query({}, function (tabs) {
              for (let j = 0; j < tabs.length; j++) {
                chrome.tabs.sendMessage(tabs[j].id, { deleted: deletedObject })
              }
            })
            return
          }
        }
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
