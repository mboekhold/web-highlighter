<template>
  <div>
    <div class="main-menu">
      <button
        :style="{ 'background-color': currentColor}"
        class="color-button"
        id="current-color"
        @click="goToColorPicker()">
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      currentColor: ''
    }
  },
  mounted () {
    chrome.storage.sync.get('color', (data) => {
      this.currentColor = data.color
    })
  },
  methods: {
    goToColorPicker () {
      this.$router.push({ name: 'ColorPicker' })
    }
  }
}
</script>

<style scoped>
.main-menu {
  display: flex;
  align-items: center;
}
</style>
