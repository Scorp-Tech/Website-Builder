let tools = [
    {
        name: "Text",
        Icon: '<i class="bi bi-input-cursor-text"></i>',
        html: '<input>'
    },

    {
        name: "Image",
        Icon: '<i class="bi bi-image"></i>',
        html: '<img>'
    }
]


let toolBar = document.getElementById("toolBar")

tools.forEach(tool => {
    toolBar.innerHTML += `<button title=${tool.name} class="toolBtn">${tool.Icon}</button>`
})

currentSelectedTool = null

let toolBtns = document.querySelectorAll(".toolBtn");

toolBtns.forEach(item => {
    item.addEventListener("click", () => {
        document.getElementById("editorWindow").style.cursor = "text"
        console.log(item.title)
        currentSelectedTool = item.title
    })
})

let toolX = 0;
let toolY = 0;

const editorWindow = document.getElementById("editorWindow");

editorWindow.onmousemove = (e) => {
    toolX = e.clientX;
    toolY = e.clientY;
}

editorWindow.onclick = (e) => {
    if (currentSelectedTool == "Text") {
        console.log("Text")
        let input = document.createElement("input");
        input.style.position = "absolute";
        input.style.left = toolX + "px";
        input.style.top = toolY + "px";
        editorWindow.appendChild(input);
    }else if(currentSelectedTool = "Image"){
        let input = document.createElement("img");
        input.style.position = "absolute";
        input.style.left = toolX + "px";
        input.style.top = toolY + "px";
        input.height = 100
        input.width = 100
        editorWindow.appendChild(input);
    }
}

