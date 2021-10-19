const color = '#E4EA28'
const siteDict = {}
const CONTEXT_MENU_ID = 'HIGHLIGHT_MENU'

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color })
  chrome.storage.sync.set({ siteDict })
})

function invokeHighlighter (info, tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { invoke: info })
  })
}

chrome.contextMenus.create({
  title: 'Highlight: "%s"',
  contexts: ['selection'],
  id: CONTEXT_MENU_ID
})

chrome.contextMenus.onClicked.addListener(invokeHighlighter)
chrome.commands.onCommand.addListener(invokeHighlighter)
