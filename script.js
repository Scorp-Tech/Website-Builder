const editorWindow = document.getElementById("editorWindow");
const toolBar = document.getElementById("toolBar")
var tempBox = document.getElementById("tempBox")

let isMouseDown = false


const tools = {
    "Input": {
        Icon: '<i class="bi bi-input-cursor-text"></i>',
        html: `<input src="" id style="position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:calc(wdtpx - 8px)">`,
        cursor: 'url("./assets/cursors/input_cursor.svg") 15 15, auto'
    },

    "Image": {
        Icon: '<i class="bi bi-image"></i>',
        html: `<img src="" id style="position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:wdtpx">`,
        cursor: 'url("./assets/cursors/image_cursor.svg") 15 15, auto'
    },
    "Button": {
        Icon: '<i class="bi bi-dash-square"></i>',
        html: `<button id style="position: absolute; top: posYpx; left: posXpx; height:hgtpx; width:wdtpx">Button</button>`,
        cursor: 'url("./assets/cursors/button_cursor.svg") 15 15, auto'
    },
    "Multi_Line_Text": {
        Icon: '<i class="bi bi-textarea-t"></i>',
        html: `<textarea id style="position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:wdtpx"></textarea>`,
        cursor: 'crosshair'
    },
    "TextBox": {
        Icon: '<i class="bi bi-fonts"></i>',
        html: `<p type="text" id style="margin: 0; padding: 0; text-align: center; vertical-align: middle; position: absolute; top: posYpx; left:posXpx; height:hgtpx; width:wdtpx">Text</p>`,
        cursor: 'crosshair'
    }
}


let elementIDs = {
    "Input": [],
    "Image": [],
    "Button": [],
    "Multi_Line_Text": [],
    "TextBox": []
}


Object.keys(tools).forEach(tool => {
    toolBar.innerHTML += `<button title=${tool} class="toolBtn">${tools[tool].Icon}</button>`
})

let currentSelectedTool = null

let toolBtns = document.querySelectorAll(".toolBtn");

toolBtns.forEach(item => {
    item.addEventListener("click", () => {
        document.getElementById("editorWindow").style.cursor = tools[item.title].cursor;
        currentSelectedTool = item.title
    })
})

let toolX = 0;
let toolY = 0;


editorWindow.onmousedown = (e) => {
    if(currentSelectedTool){
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
        tempBox.style.height = diffY + "px"
        tempBox.style.width = diffX + "px"
    }else{
        if(e.target.id != "editorWindow"){
            if(elem && elem.id != e.target.id){
                elemHoverChanged = true
            }
            elem = document.getElementById(e.target.id)
            if(elemHoverChanged){
                elemBorder = elem.style.border
                elemHoverChanged = false
            }
            if(elem){
                elem.style.border = "2px solid black"
            }
            elem.onmouseout = () => {
                elem.style.border = elemBorder
            }

            elem.onclick = () => {
                e.preventDefault();
            }
        }

    }
}

editorWindow.onmouseup = (e) => {
    if(currentSelectedTool){
        diffX = e.clientX - toolX
        diffY = e.clientY - toolY
        tempBox.style.display = "none"
        editorWindow.innerHTML += generateElement(currentSelectedTool, toolX, toolY, diffY, diffX)
        currentSelectedTool = null;
    }
    isMouseDown = false;
    editorWindow.style.cursor = "default"
}


function generateElement(elemName, posX, posY, height, width){
    if(elemName){
        let id = elemName.toLowerCase() + elementIDs[elemName].length
        let htmlTxt = tools[elemName].html.replace(" id ", ` id=${id} `).replace("posX", posX).replace("posY", posY).replace("hgt", height < 20 ? 'auto' : height).replace("wdt", width < 20 ? 'auto' : width)
        elementIDs[elemName].push(id)
        return htmlTxt;
    }
}


editorWindow.onclick = (e) => {
    e.preventDefault();
}
