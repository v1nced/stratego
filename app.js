window.onload = function() {
    var canvas = new fabric.Canvas('myCanvas');
  
    // Создаем объект карандаша
    var pencilBrush = new fabric.PencilBrush(canvas);
    pencilBrush.color = document.getElementById('pencil-color').value; // устанавливаем начальный цвет карандаша
    pencilBrush.width = 5;
  
    // Создаем объект ластика
    var eraserBrush = new fabric.CircleBrush(canvas);
    eraserBrush.width = parseInt(document.getElementById('eraser-size').value, 10);
    eraserBrush.globalCompositeOperation = 'destination-out';
  
    // Добавляем кнопку для выбора карандаша
    document.getElementById('pencil-btn').addEventListener('click', function() {
      canvas.freeDrawingBrush = pencilBrush;
      canvas.isDrawingMode = true;
    });
  
    // Добавляем кнопку для выбора ластика
    document.getElementById('eraser-btn').addEventListener('click', function() {
      canvas.freeDrawingBrush = eraserBrush;
      canvas.isDrawingMode = true;
    });
  
    // Добавляем возможность выбора цвета каранда
  document.getElementById('pencil-color').addEventListener('change', function() {
  pencilBrush.color = this.value;
  });
  
  // Добавляем возможность изменения размера ластика
  document.getElementById('eraser-size').addEventListener('change', function() {
  eraserBrush.width = parseInt(this.value, 10);
  });
  
  // Добавляем кнопку для очистки холста
  document.getElementById('clear-btn').addEventListener('click', function() {
  canvas.clear();
  });
  

  // Добавляем возможность сохранения изображения
  document.getElementById('save-btn').addEventListener('click', function() {
  var dataURL = canvas.toDataURL();
  window.open(dataURL);
  });
  

};