let width = document.querySelector('.workspace').offsetWidth
let height = document.querySelector('.workspace').offsetHeight
const initCanvas = id => {
	return new fabric.Canvas(id, {
		width: width,
		height: height,
		selection: false,
		fireRightClick: true,
		fireMiddleClick: true,
		stopContextMenu: true,
	})
}

const setBackground = (url, canvas) => {
	fabric.Image.fromURL(url, img => {
		/*   canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height 
        }); */
		canvas.backgroundImage = img
		canvas.backgroundImage.scaleToWidth(width)
		canvas.backgroundImage.scaleToHeight(height)
		canvas.setDimensions({ width: width - 17, height: height - 5 })
		canvas.requestRenderAll()
	})
}

const canvas = initCanvas('canvas')
const canvas1 = initCanvas('canvas1')
const canvas2 = initCanvas('canvas2')

setBackground('./map-border.png', canvas)
setBackground('./map-border1.png', canvas1)
setBackground('./map-border2.png', canvas2)

let mousePressed = false
let middleClick = false

let currentMode = 'pan'

/* let brushSize = document.getElementById('eraser-size')
let brushColor = document.getElementById('pencil-color') */

function changeBrush(canvas) {
	canvas.freeDrawingBrush.color = '#fcba03'
	canvas.freeDrawingBrush.width = 7.5

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


/* window.addEventListener(
	'resize',
	function (event) {
		width = document.querySelector('.workspace').offsetWidth
		canvas.setWidth(width - 195)
		canvas.renderAll()
		setBackground('./map-border.png', canvas)
	},
	true
)
 */
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


opIcon.forEach(element => {
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
})


function addOpIcon(canvas, element) {
			console.log(element)
			fabric.Image.fromURL(element.getAttribute('src'), img => {
				canvas.add(img)
				canvas.centerObject(img)
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