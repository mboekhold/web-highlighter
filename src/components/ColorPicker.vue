<template>
  <div>
    <div>
      <router-link :to="{ name: 'Home'}">
        <svg class="back" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </router-link>
    </div>
    <div class="title">
      Select a color
    </div>
    <div class="colors">
      <div v-for="color in colors" :key="color.id">
        <button v-if="color != currentColor"
        :style="{ 'background-color': color}"
        class="color-button"
        @click="selectColor(color)">
      </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      colors: [
        '#34B06A',
        '#EA8D0C',
        '#E54686',
        '#EBBF04',
        '#2892D0',
        '#E4EA28'
      ],
      currentColor: ''
    }
  },
  mounted () {
    chrome.storage.sync.get('color', (data) => {
      this.currentColor = data.color
    })
  },
  methods: {
    selectColor (color) {
      // Select color
      chrome.storage.sync.set({ color })
      chrome.tabs.query({}, function (tabs) {
        for (let i = 0; i < tabs.length; i++) {
          chrome.tabs.sendMessage(tabs[i].id, { color: color })
        }
      })
      this.$router.push({ name: 'Home' })
    }
  }
}
</script>
<style scoped>
.colors {
  display: flex;
}
.back {
  width: 20px;
  height: 20px;
  position: absolute;
  left: 5;
}
.title {
  font-size: 18px;
  text-align: center;
}
</style>
