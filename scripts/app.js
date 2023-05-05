let width = document.querySelector('.workspace').offsetWidth
let height = document.querySelector('.workspace').offsetHeight
const initCanvas = id => {
	return new fabric.Canvas(id, {
		/* width: 900,
		height: 500, */
		selection: false,
		fireRightClick: true,
		fireMiddleClick: true,
		stopContextMenu: true,
		perPixelTargetFind: true,
		hasControls :false,
		backgroundColor : "#a8a8a8"

	})
}




const setBackground = (url, canvas) => {
	fabric.Image.fromURL(url, img => {
		  canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height 
        });
		canvas.backgroundImage = img
		canvas.backgroundImage.scaleToWidth(width)
		canvas.backgroundImage.scaleToHeight(height)
		canvas.setDimensions({ width: width-document.querySelector(".workspace__sidebar").offsetWidth, height: height-document.querySelector('.header').offsetHeight })
		canvas.backgroundImage.center()
		canvas.requestRenderAll()
	})
}

const canvas = initCanvas('canvas')
const canvas1 = initCanvas('canvas1')
const canvas2 = initCanvas('canvas2')

setBackground('./images/map-border.png', canvas)
setBackground('./images/map-border1.png', canvas1)
setBackground('./images/map-border2.png', canvas2)

let mousePressed = false
let middleClick = false

let currentMode = 'pan'

/* let brushSize = document.getElementById('eraser-size')
let brushColor = document.getElementById('pencil-color') */

function changeBrush(canvas) {
	canvas.freeDrawingBrush.color = '#fcba03'
	canvas.freeDrawingBrush.width = 7.5
	canvas.hasBorders = false
	

	/* brushColor.addEventListener('change', event => {
		canvas.freeDrawingBrush.color = event.target.value
	})
	brushSize.addEventListener('change', event => {
		canvas.freeDrawingBrush.width = event.target.value
	}) */
}

changeBrush(canvas)
changeBrush(canvas1)
changeBrush(canvas2)

const toggleMode = mode => {
	if (currentMode === mode) {
		currentMode = ''
	} else {
		currentMode = mode
		canvas.requestRenderAll()
	}
}

const modes = {
	pan: 'pan',
	draw: 'draw',
}


function mouseCanvas(canvas){
	canvas.on('mouse:move', event => {
		if (middleClick) {
			const mEvent = event.e
			const delta = new fabric.Point(mEvent.movementX, mEvent.movementY)
			canvas.relativePan(delta)
			canvas.setCursor('grabbing')
		} else if (mousePressed && currentMode === modes.draw) {
			canvas.isDrawingMode = true
	
			/* canvas.requestRenderAll() */
		} else if (currentMode != modes.draw) {
			canvas.isDrawingMode = false
			currentMode = modes.pan
		}
	})


	canvas.on('mouse:down', event => {
		if (event.button === 1 && currentMode === modes.draw) {
			mousePressed = true
			if (currentMode === modes.draw) {
				canvas.setCursor('grabbing')
			}
		}
	
		if (event.button === 2) {
			middleClick = true
			if (currentMode === modes.pan) {
				canvas.setCursor('grabbing')
			}
		}
	})
	
	canvas.on('mouse:up', event => {
		mousePressed = false
		middleClick = false
		canvas.forEachObject(function(o){ o.hasBorders = o.hasControls = false;
			 
		});
		canvas.renderAll();
	})

	canvas.on('mouse:wheel', function (opt) {
		var delta = opt.e.deltaY
		var zoom = canvas.getZoom()
		zoom *= 0.999 ** delta
		if (zoom > 20) zoom = 20
		if (zoom < 0.01) zoom = 0.01
		canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom)
		opt.e.preventDefault()
		opt.e.stopPropagation()
	})



}


mouseCanvas(canvas)
mouseCanvas(canvas1)
mouseCanvas(canvas2)

/* 
window.addEventListener(
	'resize',
	function (event) {
		width = document.querySelector('.workspace').offsetWidth
		canvas.setWidth(width - 195)
		canvas.renderAll()
		setBackground('./map-border.png', canvas)
	},
	true
) */

const center = canvas.getCenter()

const centerPoint = new fabric.Point(center.left, center.top)

function zoomToCanvas(){
canvas.zoomToPoint(centerPoint, 1)
canvas.requestRenderAll()
}


zoomToCanvas(canvas)
zoomToCanvas(canvas1)
zoomToCanvas(canvas2)

const opIcon = document.querySelectorAll('#opicon')

let isActive = [false,false,false];


/* opIcon.forEach(element => {
	element.addEventListener('click', () => {

		
		if(isActive[0]){
			addOpIcon(canvas, element)
		}
		if(isActive[1]){
			addOpIcon(canvas1, element)
		}
		if(isActive[2]){
			addOpIcon(canvas2, element)
		}

		
	})
}) */


function addOpIcon(canvas, element) {
			console.log(element)
			fabric.Image.fromURL(element.getAttribute('src'), img => {
				canvas.add(img)
				canvas.centerObject(img)
				img.hasBorders=img.hasControls=false
				canvas.requestRenderAll()
			})
		
}

/* addOpIcon(canvas)
addOpIcon(canvas1)
addOpIcon(canvas2) */


const canvasArr = document.querySelectorAll('.canvas-container')

hideCanvas()

const layerBtn = document.querySelectorAll('.layer')
console.log(layerBtn)

function hideCanvas(){
	canvasArr.forEach((element,i) => {
		element.style = 'display:none'
		isActive[i] = false	
	});
	
}

function activeCanvas(){
	canvasArr[0].style = 'display:block	'
	isActive[0]=true
	layerBtn.forEach((element, i) =>{
		console.log(element)
		
		element.addEventListener('click',()=>{
			hideCanvas()

			console.log(i)
			isActive[i]=true
			canvasArr[i].style = 'display:block	'
		})
	})
}

activeCanvas()

function clearCanvas(){

	document.querySelector('#clear').addEventListener('click', ()=>{
		if(isActive[0]){
			canvas.getObjects().forEach((element)=>{
				canvas.remove(element)
			})
			
		}
		if(isActive[1]){
			canvas1.getObjects().forEach((element)=>{
				canvas1.remove(element)
			})
		}
		if(isActive[2]){
			canvas2.getObjects().forEach((element)=>{
				canvas2.remove(element)
			})
		}

		
		
		
	})
	
	
}

clearCanvas()



function removeDrawObj(canvas){

	

	canvas.on('mouse:up', () =>{
		canvas.forEachObject((e)=>{
			e.on('mouseover', ()=>{
			
				canvas.setActiveObject(e)
			})
		})
	})
	canvas.on("mouse:down", event =>{

		


		if(event.button === 3){
			console.log("click")
			
			if(canvas.getActiveObject() && canvas.getActiveObject().path){
				//console.log(canvas.getActiveObject().path)
				canvas.remove(canvas.getActiveObject())
			}
			
		}
		
	})
}

removeDrawObj(canvas)
removeDrawObj(canvas1)
removeDrawObj(canvas2)

canvas.getContext('2d', { willReadFrequently: true });


function dragDrop(canvas,num){

/* 
NOTE: the start and end handlers are events for the <img> elements; the rest are bound to 
the canvas container.
*/

function handleDragStart(e) {
    [].forEach.call(images, function (img) {
        img.classList.remove('img_dragging');
    });
    this.classList.add('img_dragging');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
    }

    e.dataTransfer.dropEffect = 'copy'; // See the section on the DataTransfer object.
    // NOTE: comment above refers to the article (see top) -natchiketa

    return false;
}

function handleDragEnter(e) {
    // this / e.target is the current hover target.
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over'); // this / e.target is previous target element.
}

function handleDrop(e) {
    // this / e.target is current target element.

    e.preventDefault(); //I've altert this line for FireFox

    var img = document.querySelector('#images img.img_dragging');

    console.log('event: ', e);

    var newImage = new fabric.Image(img, {
        /* width: img.width,
        height: img.height, */
        // Set the center of the new object based on the event coordinates relative
        // to the canvas container.
        left: e.layerX,
        top: e.layerY
    });
    canvas.add(newImage);

    return false;
}

function handleDragEnd(e) {
    // this/e.target is the source node.
    [].forEach.call(images, function (img) {
        img.classList.remove('img_dragging');
    });
}


    // Browser supports HTML5 DnD.

    // Bind the event listeners for the image elements
    var images = document.querySelectorAll('#images img');

    [].forEach.call(images, function (img) {
        img.addEventListener('dragstart', handleDragStart, false);
        img.addEventListener('dragend', handleDragEnd, false);
    });
    // Bind the event listeners for the canvas
    var canvasContainer = document.querySelectorAll('.canvas-container');

		canvasContainer[num].addEventListener('dragenter', handleDragEnter, false);
		canvasContainer[num].addEventListener('dragover', handleDragOver, false);
		canvasContainer[num].addEventListener('dragleave', handleDragLeave, false);
		canvasContainer[num].addEventListener('drop', handleDrop, false);

 
}

dragDrop(canvas,0)
dragDrop(canvas1,1)
dragDrop(canvas2,2)