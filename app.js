

const initCanvas = (id) => {
    return new fabric.Canvas(id, {
        width: 1146,
        height: 500,
        selection: false,
    });
}

const setBackground = (url, canvas)=>{
    fabric.Image.fromURL(url ,(img)=>{
        canvas.backgroundImage = img
        canvas.requestRenderAll()
    })
}


const canvas = initCanvas("canvas")

setBackground('./map-border.png', canvas)

let mousePressed = false;

let currentMode;

let brushSize = document.getElementById("eraser-size")
let brushColor = document.getElementById("pencil-color")


function changeBrush(){



    brushColor.addEventListener('change', (event)=>{
        canvas.freeDrawingBrush.color=event.target.value
    })
    brushSize.addEventListener('change', (event)=>{
        canvas.freeDrawingBrush.width=event.target.value
    })
}


changeBrush()

console.log(brushColor)
console.log(brushSize)

const toggleMode = (mode)=>{
    if(currentMode === mode){
        currentMode = ""
        console.log(currentMode)
    } else{
        currentMode = mode
        console.log(currentMode)
        canvas.requestRenderAll()
    }
}

const modes = {
    pan:"pan",
    draw:"draw"
}

canvas.on('mouse:move', (event)=>{
    if(mousePressed && currentMode === modes.pan) {
        const mEvent = event.e
        const delta = new fabric.Point(mEvent.movementX, mEvent.movementY)
        canvas.relativePan(delta)
        console.log(event)
        canvas.setCursor('grabbing')
    } else if(mousePressed && currentMode === modes.draw){
        canvas.isDrawingMode = true
        
        
        /* canvas.requestRenderAll() */
    }   else if(currentMode != modes.draw){ 
        canvas.isDrawingMode = false
    }

})

canvas.on('mouse:down', (event)=>{
    mousePressed = true;
    if(currentMode === modes.pan){
        canvas.setCursor('grabbing')
    }
    
})


canvas.on('mouse:up', (event)=>{
    mousePressed = false;
})


canvas.on('mouse:wheel', function(opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  });