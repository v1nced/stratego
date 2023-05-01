

let width = document.querySelector('.workspace').offsetWidth
let height = document.querySelector('.workspace').offsetHeight
const initCanvas = (id) => {
    return new fabric.Canvas(id, {
        width: width,
        height: height,
        selection: false,
        
    });
}

const setBackground = (url, canvas)=>{
    fabric.Image.fromURL(url ,(img)=>{
      /*   canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height 
        }); */
        canvas.backgroundImage = img
        canvas.backgroundImage.scaleToWidth(width);
        canvas.backgroundImage.scaleToHeight(height);
        canvas.setDimensions({width: width-17, height: height-5});
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

  window.addEventListener('resize', function(event) {
    width = document.querySelector('.workspace').offsetWidth
    console.log(width)
    canvas.setWidth(width-195);
    canvas.renderAll()
    setBackground('./map-border.png', canvas)
}, true);

const center = canvas.getCenter();

const centerPoint = new fabric.Point(center.left, center.top);

canvas.zoomToPoint(centerPoint, 2);
canvas.requestRenderAll();