<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
// import ColorPicker from '@/components/ColorPicker.vue'

export default {
  name: 'App'
  // components: { ColorPicker }
}
</script>

<style>
#app {
  width: 350px;
}
.color-button {
  height: 30px;
  width: 30px;
  outline: none;
  margin: 10px;
  border: none;
  border-radius: 2px;
}

.color-button:hover{
    cursor: pointer;
    box-shadow: 0 0 0 2px white,
                0 0 0 4px black;
}
a {
  text-decoration: none;
  color: black;
}
</style>
