const editorWindow = document.getElementById("editorWindow");
const toolBar = document.getElementById("toolBar")
var tempBox = document.getElementById("tempBox")

let isMouseDown = false


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
  "box-shadow"

]


const tools = {
  "Input": {
    Icon: '<i class="bi bi-input-cursor-text"></i>',
    html: `<input placeholder="_id" src="" id="_id" style="position: absolute; top: posYpx; left:posXpx; height:calc(hgtpx - 5px); width:calc(wdtpx - 8px)">`,
    cursor: 'url("./assets/cursors/input_cursor.svg") 15 15, auto',
    properties: [
      "placeholder",
      "color",
      "font-size",
      "font-family",
      "text-align",
    ]
  },

  "Image": {
    Icon: '<i class="bi bi-image"></i>',
    html: `<img src="" id="_id" style="position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:wdtpx">`,
    cursor: 'url("./assets/cursors/image_cursor.svg") 15 15, auto',
    properties: [
      "src",
      "object-fit",

    ]
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
    ]
  },
  "Text_Area": {
    Icon: '<i class="bi bi-textarea-t"></i>',
    html: `<textarea id="_id" style="position: absolute; top: posYpx; left:posXpx; height:calc(hgtpx - 5px); width:calc(wdtpx - 5px)"></textarea>`,
    cursor: 'url("./assets/cursors/multiline_cursor.svg") 15 15, auto'
  },
  "Text_Box": {
    Icon: '<i class="bi bi-fonts"></i>',
    html: `<p type="text" id="_id" style="margin: 0; padding: 0; position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:wdtpx">Text</p>`,
    cursor: 'url("./assets/cursors/textbox_cursor.svg") 15 15, auto'
  },
  "Link": {
    Icon: '<i class="bi bi-link"></i>',
    html: `<a href="" id="_id" style="position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:wdtpx">Link</a>`,
    cursor: 'url("./assets/cursors/link_cursor.svg") 15 15, auto'
  },
  "Dropdown": {
    Icon: '<i class="bi bi-list"></i>',
    html: `<select id="_id" style="position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:wdtpx"><option value="1">Option 1</option><option value="2">Option 2</option><option value="3">Option 3</option></select>`,
    cursor: 'url("./assets/cursors/select_cursor.svg") 15 15, auto'
  },
  "Checkbox": {
    Icon: '<i class="bi bi-check-square"></i>',
    html: `<div id="_id" style="display: flex; align-items: center; position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:wdtpx"><input type="checkbox" style="height:calc(hgtpx - 5px); width:calc(hgtpx - 5px)" name="_id"><label for="_id">Checkbox</div>`,
    cursor: 'url("./assets/cursors/checkbox_cursor.svg") 15 15, auto'
  },
  "Radio": {
    Icon: '<i class="bi bi-record-circle"></i>',
    html: `<div id="_id" style="display: flex; align-items: center; position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:wdtpx"><input type="radio" style="height:calc(hgtpx - 5px); width:calc(hgtpx - 5px)" name="_id"><label for="_id">Radio</div>`,
    cursor: 'url("./assets/cursors/radio_cursor.svg") 15 15, auto'
  },
  "Label": {
    Icon: '<i class="bi bi-type"></i>',
    html: `<span id="_id" style="position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:wdtpx">Label</span>`,
    cursor: 'url("./assets/cursors/label_cursor.svg") 15 15, auto'
  },
  "Line": {
    Icon: '<i class="bi bi-dash"></i>',
    html: `<hr id="_id" style="background: black; position: absolute; top: calc(posYpx - 7px); left:posXpx; height: 2px;  width: wdtpx">`,
    cursor: 'url("./assets/cursors/line_cursor.svg") 15 15, auto'
  },
  "Icon": {
    Icon: '<i class="bi bi-emoji-smile"></i>',
    html: `<i class="bi bi-emoji-smile" id="_id" style="padding: 0; position: absolute; top: posYpx; left:posXpx; font-size: calc(hgtpx - 10px); height:hgtpx; width:wdtpx"></i>`,
    cursor: 'url("./assets/cursors/icon_cursor.svg") 15 15, auto'
  }
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
  "Icon": []
}


Object.keys(tools).forEach(tool => {
  toolBar.innerHTML += `<div><button title=${tool} class="toolBtn">${tools[tool].Icon}</button>${tool.replaceAll("_", " ")}</div>`
})

let currentSelectedTool = null
let currentSelectedToolElem = null;
let currentSelectedElem = null;

let toolBtns = document.querySelectorAll(".toolBtn");

toolBtns.forEach(item => {
  item.addEventListener("click", () => {
    if(!currentSelectedToolElem || currentSelectedToolElem != item){
      if(currentSelectedToolElem){
        currentSelectedToolElem.classList.remove("selected")
      }
      currentSelectedToolElem = null
      document.getElementById("editorWindow").style.cursor = tools[item.title].cursor;
      currentSelectedTool = item.title
      currentSelectedToolElem = item
      currentSelectedToolElem.classList.add("selected")
    }else{
      document.getElementById("editorWindow").style.cursor = 'default';
      currentSelectedToolElem.classList.remove("selected")
      currentSelectedTool = null
      currentSelectedToolElem = null
    }
  })
})

let toolX = 0;
let toolY = 0;


editorWindow.onmousedown = (e) => {
  if(currentSelectedTool && !isMouseDown){
    tempBox = document.getElementById("tempBox")
    toolX = e.clientX;
    toolY = e.clientY;
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
    if(e.target.id != "editorWindow"){
      if(elem && elem.id != e.target.id){
        elemHoverChanged = true
      }
      elem = document.getElementById(e.target.id)
      if(elemHoverChanged){
        elem.onclick = () => {
          if(currentSelectedElem){
            let tempElem = document.getElementById(currentSelectedElem.id)
            tempElem.classList.remove("selected-elem")
            tempElem.onmousemove = null
            tempElem.onmouseup = null
            tempElem.onmousedown = null
          }
          // currentSelectedElem = null;
          currentSelectedElem = elem;
          currentSelectedElem.classList.add("selected-elem")
          dragElement(currentSelectedElem)
          // mkResizable(currentSelectedElem)
        }
        elemBorder = elem.style.outline
        elemHoverChanged = false
      }
      if(elem){
        elem.style.outline = "2px solid black"
      }
      elem.onmouseout = () => {
        elem.style.outline = elemBorder
      }
    }

  }
}

editorWindow.onmouseup = (e) => {
  if(currentSelectedTool){
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
  }
  isMouseDown = false;
  editorWindow.style.cursor = "default"
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
    if(pos4 < rect.bottom-5 && pos3 < rect.right-5){
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


function mkResizable(elem){

  elem.onmousedown = (e) => {

  }

}


document.getElementById("hideToolBarBtn").onclick = () =>{
  hideToolBar();
}

function hideToolBar(){
  if(toolBar.style.left == "-190px"){
    toolBar.style.left = "00px"
  document.getElementById("hideToolBarBtn").style.left = "190px"
  }else{
    toolBar.style.left = "-190px"
    document.getElementById("hideToolBarBtn").style.left = "0px"
  }
}

document.getElementById("deleteBtn").onclick = () => {
  if(currentSelectedElem){
    let tempElem = document.getElementById(currentSelectedElem.id)
    tempElem.remove()
    currentSelectedElem = null;
  }
}