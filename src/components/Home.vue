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
    <div v-if="sites">
      <div v-for="(site, page, index) in sites" :key="site.id">
        <div class="accordion-item" :id="'accordion-' + page">
          <h2 class="accordion-header" :id="'heading' + index">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + index" aria-expanded="false" aria-controls="collapseTwo">
              <span class="text-truncate">
                {{ page }}
              </span>
            </button>
          </h2>
          <div :id="'collapse' + index" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
            <div class="accordion-body" v-for="highlight in site" :key="highlight.id">
              <div class="actions">
                <div class="action-item" @click="copyText(highlight.text)">
                  <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="action-item" @click="deleteText(highlight.id)">
                  <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
              </div>
              <div class="text-wrapper">
                <p :style="{ backgroundColor: highlight.color }">
                  {{ highlight.text }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  mounted () {
    chrome.storage.sync.get('color', (data) => {
      this.$store.commit('setCurrentColor', data.color)
    })
    chrome.storage.sync.get('siteDict', (data) => {
      this.$store.commit('setSiteDict', data.siteDict)
    })
  },
  computed: {
    currentColor () {
      return this.$store.state.currentColor
    },
    sites () {
      return this.$store.state.siteDict
    }
  },
  methods: {
    goToColorPicker () {
      this.$router.push({ name: 'ColorPicker' })
    },
    copyText (text) {
      navigator.permissions.query({ name: 'clipboard-write' }).then(result => {
        if (result.state === 'granted' || result.state === 'prompt') {
        /* write to the clipboard now */
          navigator.clipboard.writeText(text).then(function () {
          /* clipboard successfully set */
          }, function () {
          /* clipboard write failed */
          })
        }
      })
    },
    deleteText (id) {
      this.$store.commit('removeHighlightById', id)
    }
  }
}
</script>

<style scoped>
.main-menu {
  display: flex;
  align-items: center;
}
p {
  display: inline;
  padding: 5px;
}
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-wrapper {
  padding: 10px;
  border-right: 1px solid #dbdbdb;
  border-bottom: 1px solid #dbdbdb;
  border-left: 1px solid #dbdbdb;
  border-radius: 0px 0px 5px 5px;
  position: relative;
}
.icon {
  width: 24px;
  height: 24px;
}
.actions {
  background-color: #e7f1ff;
  padding: 5px;
  border-radius: 5px 5px 0px 0px;
  border: 1px solid #dbdbdb;
  display: flex;
}
.action-item {
  margin-right: 5px;
}
.action-item:hover {
  cursor: pointer;
}
</style>
