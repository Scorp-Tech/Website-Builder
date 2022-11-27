const editorWindow = document.getElementById("editorWindow");
const toolBar = document.getElementById("toolBar")
const hideToolBarBtn = document.getElementById("hideToolBarBtn")
const hidePropertyBtn = document.getElementById("hidePropertyBtn")
const propertyBar = document.getElementById("propertyWindow")
const heightInput = document.getElementById("heightInput")
const widthInput = document.getElementById("widthInput")
const xInput = document.getElementById("xInput")
const yInput = document.getElementById("yInput")
const borderColorInput = document.getElementById("borderColorInput")
const backgrouncColorInput = document.getElementById("backgroundColorInput")
const propertyWindowBody = document.getElementById("propertyWindowBody")
let tempBox = document.getElementById("tempBox")
let isMouseDown = false
let currentSelectedTool = null
let currentSelectedToolElem = null;
let currentSelectedElem = null;
let currentSelectedElemToolName = null;
let currentSelectedElemProps = null
let currentSelectedElemChildProps = null


const universalProp = [
  "height",
  "width",
  "top",
  "left",
  "background",
  "border-radius",
  "border-color",
  "border-width",
  "border-style",
  "margin",
  "padding",

]


// function setPropertySafely(element, property, value){
//   if(value){
//     element.style.setProperty(property, value)
//   }
// }

const tools = {
  "Input": {
    Icon: '<i class="bi bi-input-cursor-text"></i>',
    html: `<div id="_id" style="position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:wdtpx"><input type="text" placeholder="_id" src="" style="height: calc(100% - 5px); width: calc(100% - 8px); pointer-events: none;"></div>`,
    cursor: 'url("./assets/cursors/input_cursor.svg") 15 15, auto',
    properties: [
      "placeholder",
      "color",
      "font-size",
      "font-family",
      "text-align",
      "type"
    ],
    setProperty: (elem, props) => {
      Object.keys(props).forEach(item => {
        if(props[item]){
          elem.childNodes[0].style[item] = props[item]
        }
      })
    }
  },

  "Image": {
    Icon: '<i class="bi bi-image"></i>',
    html: `<img src="" id="_id" style="position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:wdtpx">`,
    cursor: 'url("./assets/cursors/image_cursor.svg") 15 15, auto',
    properties: [
      "src",
      "object-fit",

    ],
    setProperty: (elem, props) => {
      Object.keys(props).forEach(item => {
        if(props[item]){
          elem.style[item] = props[item]
        }
      })
    }
  },
  "Button": {
    Icon: '<i class="bi bi-square"></i>',
    html: `<button id="_id" style="position: absolute; top: posYpx; left: posXpx; height:hgtpx; width:wdtpx">Button</button>`,
    cursor: 'url("./assets/cursors/button_cursor.svg") 15 15, auto',
    properties: [
      "text",
      "color",
      "font-size",
      "font-family",
      "text-align"
    ],
    setProperty: (element) => {
      let tempElem = document.getElementById(element.id)
      tempElem.innerHTML = element.text
      tempElem.style.color = element.color
      tempElem.style.fontSize = element.fontSize + "px"
      tempElem.style.fontFamily = element.fontFamily
      tempElem.style.textAlign = element.textAlign
    }
  },
  "Text_Area": {
    Icon: '<i class="bi bi-textarea-t"></i>',
    html: `<textarea placeholder="_id" id="_id" style="position: absolute; top: posYpx; left:posXpx; height:calc(hgtpx - 5px); width:calc(wdtpx - 5px)"></textarea>`,
    cursor: 'url("./assets/cursors/multiline_cursor.svg") 15 15, auto'
  },
  "Text_Box": {
    Icon: '<i class="bi bi-fonts"></i>',
    html: `<p type="text" id="_id" style="margin: 0; padding: 0; position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:wdtpx; border: 1px solid black;">Text</p>`,
    cursor: 'url("./assets/cursors/textbox_cursor.svg") 15 15, auto'
  },
  "Link": {
    Icon: '<i class="bi bi-link"></i>',
    html: `<a href="" id="_id" style="position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:wdtpx">Link</a>`,
    cursor: 'url("./assets/cursors/link_cursor.svg") 15 15, auto'
  },
  "Dropdown": {
    Icon: '<i class="bi bi-list"></i>',
    html: `<div id="_id" style="position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:wdtpx"><select id="_id" style="height: 100%; width: 100%; pointer-events: none" ><option value="1">Option 1</option><option value="2">Option 2</option><option value="3">Option 3</option></select></div>`,
    cursor: 'url("./assets/cursors/select_cursor.svg") 15 15, auto'
  },
  "Checkbox": {
    Icon: '<i class="bi bi-check-square"></i>',
    html: `<div id="_id" style="display: flex; align-items: center; position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:wdtpx"><input type="checkbox" style="height:calc(100% - 5px); aspect-ratio: 1; pointer-events: none" name="_id"><label for="_id" style="pointer-events: none">Checkbox</div>`,
    cursor: 'url("./assets/cursors/checkbox_cursor.svg") 15 15, auto'
  },
  "Radio": {
    Icon: '<i class="bi bi-record-circle"></i>',
    html: `<div id="_id" style="display: flex; align-items: center; position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:wdtpx"><input type="radio" style="height:calc(100% - 5px); aspect-ratio: 1; pointer-events: none" name="_id"><label for="_id" style="pointer-events: none">Radio</div>`,
    cursor: 'url("./assets/cursors/radio_cursor.svg") 15 15, auto'
  },
  // "Label": {
  //   Icon: '<i class="bi bi-type"></i>',
  //   html: `<span id="_id" style="position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:wdtpx">Label</span>`,
  //   cursor: 'url("./assets/cursors/label_cursor.svg") 15 15, auto'
  // },
  "Line": {
    Icon: '<i class="bi bi-dash"></i>',
    html: `<div class="line" id="_id" style="position: absolute; top: calc(posYpx - 10px); left:posXpx; width: wdtpx; height: 20px"><div style="width: 100%; border-top: 2px solid black; margin: 10px 0; pointer-events: none"></div></div>`,
    cursor: 'url("./assets/cursors/line_cursor.svg") 15 15, auto'
  },
  "Icon": {
    Icon: '<i class="bi bi-emoji-smile"></i>',
    html: `<i class="icon-elem bi bi-emoji-smile" id="_id" style="padding: 0; margin: 0; position: absolute; top: posYpx; left:posXpx; font-size: calc(hgtpx - 10px); height:hgtpx; width:wdtpx; "></i>`,
    cursor: 'url("./assets/cursors/icon_cursor.svg") 15 15, auto'
  },
  "Table": {
    Icon: '<i class="bi bi-table"></i>',
    html: `<div id="_id" style="position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:wdtpx;"><table style="height:100%; width: 100%; border: 1px solid black; border-collapse: collapse; pointer-events: none"><tr><td style="border: 1px solid black; padding: 5px">Cell 1</td><td style="border: 1px solid black; padding: 5px">Cell 2</td></tr><tr><td style="border: 1px solid black; padding: 5px">Cell 3</td><td style="border: 1px solid black; padding: 5px">Cell 4</td></tr></table></div>`,
    cursor: 'url("./assets/cursors/table_cursor.svg") 15 15, auto'
  }, 
  "Video": {
    Icon: '<i class="bi bi-film"></i>',
    html: `<div id="_id" style="position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:wdtpx;"><video style="height: 100%; width: 100%; pointer-events: none" controls><source src="" type="video/mp4"></video></div>`,
    cursor: 'url("./assets/cursors/video_cursor.svg") 15 15, auto'
  },
  "Audio": {
    Icon: '<i class="bi bi-music-note"></i>',
    html: `<div id="_id" style="position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:wdtpx;"><audio style="height: 100%; width: 100%; pointer-events: none" controls><source src="" type="audio/mpeg"></audio></div>`,
    cursor: 'url("./assets/cursors/audio_cursor.svg") 15 15, auto'
  },
  "Progress": {
    Icon: '<i class="bi bi-bar-chart"></i>',
    html: `<div id="_id" style="position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:wdtpx;"><progress style="height: 100%; width: 100%; pointer-events: none" value="50" max="100"></progress></div>`,
    cursor: 'url("./assets/cursors/progress_cursor.svg") 15 15, auto'
  },
  "Slider": {
    Icon: '<i class="bi bi-sliders"></i>',
    html: `<div id="_id" style="position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:wdtpx;"><input type="range" style="height: 100%; width: 100%; pointer-events: none" value="50" max="100"></div>`,
    cursor: 'url("./assets/cursors/slider_cursor.svg") 15 15, auto'
  },
}


let elementIDs = {
  "Input": [],
  "Image": [],
  "Button": [],
  "Text_Area": [],
  "Text_Box": [],
  "Link": [],
  "Dropdown": [],
  "Checkbox": [],
  "Radio": [],
  "Label": [],
  "Line": [],
  "Icon": [],
  "Table": [],
  "Video": [],
  "Audio": [],
  "Progress": [],
  "Slider": []
}


Object.keys(tools).forEach(tool => {
  toolBar.innerHTML += `<div><button title=${tool} class="toolBtn">${tools[tool].Icon}</button>${tool.replaceAll("_", " ")}</div>`
})


let toolBtns = document.querySelectorAll(".toolBtn");

toolBtns.forEach(item => {
  item.addEventListener("click", () => {
    if(!currentSelectedToolElem || currentSelectedToolElem != item){
      if(currentSelectedToolElem){
        currentSelectedToolElem.classList.remove("selected")
      }
      currentSelectedToolElem = null
      editorWindow.style.cursor = tools[item.title].cursor;
      currentSelectedTool = item.title
      currentSelectedToolElem = item
      currentSelectedToolElem.classList.add("selected")
    }else{
      editorWindow.style.cursor = 'url(./assets/cursors/default.svg) 5 0, default'
      currentSelectedToolElem.classList.remove("selected")
      currentSelectedTool = null
      currentSelectedToolElem = null
    }
  })
})

let toolX = 0;
let toolY = 0;


editorWindow.onmousedown = (e) => {
  if(currentSelectedTool && !isMouseDown && currentSelectedElem != e.target){
    toolX = e.clientX
    toolY = e.clientY
    tempBox = document.getElementById("tempBox")
    tempBox.style.top = toolY + "px"
    tempBox.style.left = toolX + "px"
    tempBox.style.height = "0px"
    tempBox.style.width = "0px"
    tempBox.style.display = "block"
    isMouseDown = true
  }
}

let elemBorder = null
let elem = null
let elemHoverChanged = true
editorWindow.onmousemove = (e) => { 
  if (isMouseDown) {
    diffX = e.clientX - toolX
    diffY = e.clientY - toolY
    if(currentSelectedTool == "Line"){
      diffY = 2;
      
    }
    if(diffX < 0){
      tempBox.style.left = e.clientX + "px"
    }

    if(diffY < 0){
      tempBox.style.top = e.clientY + "px"
    }
    tempBox.style.height = Math.abs(diffY) + "px"
    tempBox.style.width = Math.abs(diffX) + "px"
  }else{
    toolX = e.clientX
    toolY = e.clientY
    if(e.target.id != "editorWindow"){
      elem = document.getElementById(e.target.id)

      // element onclick function // this will select the clicked element//
      elem.onclick = () => {
        if(currentSelectedElem){
          let tempElem = document.getElementById(currentSelectedElem.id)
          tempElem.classList.remove("selected-elem")
          propertyWindowBody.style.display = 'none'
          tempElem.onmousemove = null
          tempElem.onmouseup = null
          tempElem.onmousedown = null
        }
        currentSelectedElem = elem;
        currentSelectedElemProps = elem.style
        if(currentSelectedElem.hasChildNodes()){
          currentSelectedElemChildProps = currentSelectedElem.childNodes[0].style
        }else{
          currentSelectedElemChildProps = null
        }
        console.log(currentSelectedElemChildProps)
        currentSelectedElem.classList.add("selected-elem")
        currentSelectedElemToolName = currentSelectedElem.id.match((/.*?(?=\d)/g))[0].capitalize()
        // element has been selected

        // do anything to the element (currentSelectedElem) after this line

        dragElement(currentSelectedElem)
        setPropertyWindow(currentSelectedElem)

      }
      if(elem && !elem.classList.contains("selected-elem")){
        elem.classList.add("hovered")
      }
      elem.onmouseout = () => {
        elem.classList.remove("hovered")
      }
    }

  }
}

editorWindow.onmouseup = (e) => {
  if(currentSelectedTool && isMouseDown){
    diffX = e.clientX - toolX
    diffY = e.clientY - toolY
    tempBox.style.display = "none"
    let tempTop = tempBox.style.top
    let tempLeft = tempBox.style.left
    tempTop = tempTop.slice(0, tempTop.length-2)
    tempLeft = tempLeft.slice(0, tempLeft.length-2)
    editorWindow.innerHTML += generateElement(currentSelectedTool, tempLeft, tempTop, Math.abs(diffY), Math.abs(diffX))
    currentSelectedTool = null;
    currentSelectedToolElem.classList.remove("selected")
    currentSelectedToolElem = null;
    isMouseDown = false;
    editorWindow.style.cursor = 'url(./assets/cursors/default.svg) 5 0, default'
  }
}


function generateElement(elemName, posX, posY, height, width){
  if(elemName){
    let id = elemName.toLowerCase() + elementIDs[elemName].length
    let htmlTxt = tools[elemName].html.replaceAll("_id", `${id}`).replace("posX", posX).replace("posY", posY).replaceAll("hgt", height < 10 ? 'auto' : height).replace("wdt", width < 10 ? 'auto' : width)
    elementIDs[elemName].push(id)
    return htmlTxt;
  }
}


editorWindow.onclick = (e) => {
  e.preventDefault();
  if(e.target.id == "editorWindow"){
    if(currentSelectedElem){
      let tempElem = document.getElementById(currentSelectedElem.id)
      tempElem.classList.remove("selected-elem")
      propertyWindowBody.style.display = 'none'
    }
    currentSelectedElem = null;
  }

}




function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    var rect = e.target.getBoundingClientRect();
    if(pos4 < rect.bottom-10 && pos3 < rect.right-10){
      document.onmousemove = elementDrag;
      e.preventDefault()
    }
  }

  function elementDrag(e) {
    e = e || window.event;
    // e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}




hideToolBarBtn.onclick = () =>{
  hideToolBar();
}


function hideToolBar(){
  if(!toolBar.classList.contains("toolBarHidden")){
    toolBar.classList.add("toolBarHidden");
    hideToolBarBtn.classList.add("toolBarHidden")
  }else{
    toolBar.classList.remove("toolBarHidden")
    hideToolBarBtn.classList.remove("toolBarHidden")
  }
}

document.getElementById("deleteBtn").onclick = () => {
  deleteElem()
}


window.onkeyup = (e) => {

  if(e.keyCode == 46){
    deleteElem()
  }

  if(e.keyCode == 27){
    hideToolBar()
    hideProperty()
  }

  if(e.keyCode == 86 && e.ctrlKey){
    navigator.clipboard.readText()
    .then(data => {
      let elemStr = data;
      let elemID = elemStr.match((/(?<=id=").*?\d/g))[0]
      let elemName = elemID.match((/.*?(?=\d)/g))[0].capitalize()
      elemID = elemID.replace(/\d/g, elementIDs[elemName].length)
      elementIDs[elemName].push(elemID)
      elemStr = elemStr.replace(/top:( |)\d*px;/g, `top: ${toolY}px;`).replace(/left:( |)\d*px;/g, `left: ${toolX}px;`).replace(/id=".*?"/g, `id="${elemID}"`)
      editorWindow.innerHTML += elemStr;
    })
  }
}

Object.defineProperty(String.prototype, 'capitalize', {
  value: function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false
});

function deleteElem(){
  if(currentSelectedElem){  
    currentSelectedElem.remove()
    currentSelectedElem = null;
    propertyWindowBody.style.display = 'none'
  }
}

window.addEventListener("copy", (e) => {
  if(currentSelectedElem){
    e.preventDefault();
    currentSelectedElem.classList.remove("selected-elem")
    currentSelectedElem.classList.remove("hovered")

    e.clipboardData.setData("text/plain", currentSelectedElem.outerHTML);
    currentSelectedElem.classList.add("selected-elem")
    currentSelectedElem.classList.add("hovered")
  }
})

hidePropertyBtn.onclick = () => {
  hideProperty()
}

function hideProperty(){
  if(!propertyBar.classList.contains("propertyBarHidden")){
    propertyBar.classList.add("propertyBarHidden");
  }else{
    propertyBar.classList.remove("propertyBarHidden")
  }
}

function setPropertyWindow(element){
  propertyWindowBody.style.display = 'block'
  let elemStyle = window.getComputedStyle(element)
  heightInput.value = elemStyle.height.substring(0, elemStyle.height.length-2);
  widthInput.value = elemStyle.width.substring(0, elemStyle.width.length-2);
  xInput.value = elemStyle.left.substring(0, elemStyle.left.length-2);
  yInput.value = elemStyle.top.substring(0, elemStyle.top.length-2);
  borderColorInput.value = rgbStrToHex(element.style.borderColor)
  backgrouncColorInput.value = rgbStrToHex(element.style.backgroundColor)
}


function rgbStrToHex(rgbStr){
  if(rgbStr){
    let rgbArr = rgbStr.match(/\d+/g)
    let hex = "#"
    rgbArr.forEach(elem => {
      let hexElem = parseInt(elem).toString(16)
      if(hexElem.length == 1){
        hexElem = "0" + hexElem
      }
      hex += hexElem
    })
    return hex
  }else{
    return "#000000"
  }
}


let propInputArr = [heightInput, widthInput, xInput, yInput]

propInputArr.forEach(item => {
  item.oninput = () => {
    currentSelectedElem.style[item.title] = item.value + "px"
  }
})

borderColorInput.oninput = () => {
  tools[currentSelectedElemToolName].setProperty(currentSelectedElem, {borderColor: borderColorInput.value})
}

backgrouncColorInput.oninput = () => {
  tools[currentSelectedElemToolName].setProperty(currentSelectedElem, {backgroundColor: backgrouncColorInput.value})
}