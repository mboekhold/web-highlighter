const color = '#E4EA28'
const siteDict = {}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color })
  chrome.storage.sync.set({ siteDict })
})

browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('Hello from the background')

  browser.tabs.executeScript({
    file: 'content-script.js'
  })
})
