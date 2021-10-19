let highlighterColor

const copyIconSVG = {
  xmlns: 'http://www.w3.org/2000/svg',
  class: 'action-icon',
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor'
}
const copyIconPath = {
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'stroke-width': '2',
  d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
}
const deleteIconSVG = {
  xmlns: 'http://www.w3.org/2000/svg',
  class: 'action-icon',
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor'
}
const deleteIconPath = {
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'stroke-width': '2',
  d: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
}

function generateIcon (svgDict, pathDict) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  for (const key in svgDict) {
    svg.setAttribute(key, svgDict[key])
  }
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  for (const key in pathDict) {
    path.setAttribute(key, pathDict[key])
  }
  svg.appendChild(path)
  return svg
}
// Set current color on fist load
function setCurrentColor () {
  chrome.storage.sync.get('color', (data) => {
    highlighterColor = data.color
  })
}

function removeHighlightById (id) {
  chrome.storage.sync.get('siteDict', (data) => {
    const siteDict = data.siteDict
    for (const key in siteDict) {
      for (let i = 0; i < siteDict[key].length; i++) {
        if (siteDict[key][i].id === id) {
          // eslint-disable-next-line no-unused-expressions
          siteDict[key].splice(i, 1)[0]
          if (siteDict[key].length === 0) {
            delete siteDict[key]
          }
          chrome.storage.sync.set({ siteDict })
          return
        }
      }
    }
  })
}

function setCurrentHighlights () {
  chrome.storage.sync.get('siteDict', (data) => {
    const siteDict = data.siteDict
    const page = window.location.href
    for (const key in siteDict) {
      if (key === page) {
        for (let i = 0; i < siteDict[key].length; i++) {
          const highlightedObject = siteDict[key][i]
          window.find(highlightedObject.text)
          const userSelection = window.getSelection()
          const rangeObject = userSelection.getRangeAt(0)
          const contents = rangeObject.extractContents()
          var mark = document.createElement('mark')
          mark.setAttribute('id', highlightedObject.id)
          mark.setAttribute(
            'style',
            `background-color: ${highlightedObject.color}`
          )
          mark.setAttribute(
            'class',
            'sx-selection-highlighted'
          )
          mark.addEventListener('mouseover', setXOnHighlightHover)
          mark.addEventListener('mouseleave', removeXOnHighlightHoverLeave)
          mark.appendChild(contents)
          rangeObject.insertNode(mark)
          userSelection.removeAllRanges()
        }
      }
    }
  })
}

// https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid
function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

function removeXOnHighlightHoverLeave (event) {
  const popover = event.target.getElementsByClassName('sx-highlight-popover')[0]
  popover.remove()
}

function removeHighlight (markDiv) {
  const parentDiv = markDiv.parentNode
  const markId = markDiv.id
  const popover = markDiv.getElementsByClassName('sx-highlight-popover')[0]
  while (markDiv.firstChild) {
    parentDiv.insertBefore(markDiv.firstChild, markDiv)
  }
  // If deleted from the page, button will be removed
  // If deleted from the popup, button wont need to be removed because
  // it won't be active. Button is active on text hover, which wont be the case
  // when deleting from the popup..
  if (popover) {
    popover.remove()
  }
  removeHighlightById(markId)
  parentDiv.removeChild(markDiv)
}

function copyText (mark) {
  navigator.permissions.query({ name: 'clipboard-write' }).then(result => {
    if (result.state === 'granted' || result.state === 'prompt') {
      /* write to the clipboard now */
      navigator.clipboard.writeText(mark.textContent).then(function () {
        /* clipboard successfully set */
      }, function () {
        /* clipboard write failed */
      })
    }
  })
}

function setXOnHighlightHover (event) {
  const tagName = event.target.tagName
  if (tagName === 'MARK') {
    const mark = event.target
    const popover = mark.getElementsByClassName('sx-highlight-popover')
    if (popover.length > 0) {
      return
    }
    const div = document.createElement('div')
    const content = document.createElement('div')
    const copySVG = generateIcon(copyIconSVG, copyIconPath)
    copySVG.addEventListener('click', () => {
      // copy
      copyText(mark)
    })
    const seperator = document.createElement('div')
    seperator.setAttribute('class', 'sx-highlight-seperator')

    const deleteSVG = generateIcon(deleteIconSVG, deleteIconPath)
    deleteSVG.addEventListener('click', () => {
      removeHighlight(mark)
    })
    div.setAttribute('class', 'sx-highlight-popover')
    content.setAttribute('class', 'sx-highlight-popover-content')
    content.appendChild(copySVG)
    content.appendChild(seperator)
    content.appendChild(deleteSVG)
    div.appendChild(content)
    event.target.appendChild(div)
  }
}

function addHighlightedTextToDict (id, text) {
  chrome.storage.sync.get('siteDict', (data) => {
    const siteDict = data.siteDict
    const page = window.location.href
    const pageName = document.title
    const highlightedObject = {
      id: id,
      pageName: pageName,
      color: highlighterColor,
      text: text
    }
    if (siteDict[page]) {
      siteDict[page].push(highlightedObject)
    } else {
      siteDict[page] = [highlightedObject]
    }
    chrome.storage.sync.set({ siteDict })
  })
}
function highlightSelection () {
  const id = uuidv4()
  const userSelection = window.getSelection()
  const userSelectedText = userSelection.toString()
  const rangeObject = userSelection.getRangeAt(0)
  const contents = rangeObject.extractContents()
  var mark = document.createElement('mark')
  mark.setAttribute('id', id)
  mark.setAttribute(
    'style',
      `background-color: ${highlighterColor}`
  )
  mark.setAttribute(
    'class',
    'sx-selection-highlighted'
  )
  mark.addEventListener('mouseover', setXOnHighlightHover)
  mark.addEventListener('mouseleave', removeXOnHighlightHoverLeave)
  addHighlightedTextToDict(id, userSelectedText)
  mark.appendChild(contents)
  rangeObject.insertNode(mark)
}

chrome.runtime.onMessage.addListener(
  function (request, sender) {
    if (request.invoke) {
      highlightSelection()
    }
    if (request.color) {
      highlighterColor = request.color
    }
    if (request.deleted) {
      const markDiv = document.getElementById(request.deleted.id)
      removeHighlight(markDiv)
    }
    if (request.navigate) {
      const markDiv = document.getElementById(request.navigate)
      window.scrollTo(markDiv.offsetLeft, markDiv.offsetTop)
    }
  }
)

setCurrentHighlights()
setCurrentColor()
