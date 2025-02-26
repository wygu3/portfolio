document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const colorInput = document.getElementById('color-input');
    const brushSize = document.getElementById('brush-size');
    const sizeDisplay = document.getElementById('size-display');
    const clearButton = document.getElementById('clear-canvas');
    const saveButton = document.getElementById('save-canvas');
    const undoButton = document.getElementById('undo-canvas');
    
    // History for undo functionality
    const history = [];
    let historyIndex = -1;
    
    // Set canvas size to match its display size
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Save initial blank canvas state
        saveState();
    }
    
    // Save the current state of the canvas
    function saveState() {
        // If we're not at the end of the history array, remove future states
        if (historyIndex < history.length - 1) {
            history.splice(historyIndex + 1);
        }
        
        // Push the current state to history
        history.push(canvas.toDataURL());
        historyIndex = history.length - 1;
        
        // Enable/disable undo button
        undoButton.disabled = historyIndex <= 0;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Drawing state
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    // Update brush size display
    brushSize.addEventListener('input', function() {
        sizeDisplay.textContent = `${this.value}px`;
    });
    
    // Drawing functions
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = brushSize.value;
        ctx.strokeStyle = colorInput.value;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
    
    function stopDrawing() {
        if (isDrawing) {
            isDrawing = false;
            saveState();
        }
    }
    
    // Event listeners for mouse
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Event listeners for touch devices
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });
    
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });
    
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup');
        canvas.dispatchEvent(mouseEvent);
    });
    
    // Undo last action
    undoButton.addEventListener('click', function() {
        if (historyIndex > 0) {
            historyIndex--;
            const img = new Image();
            img.onload = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
            img.src = history[historyIndex];
            
            // Enable/disable undo button
            undoButton.disabled = historyIndex <= 0;
        }
    });
    
    // Clear canvas
    clearButton.addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        saveState();
    });
    
    // Save drawing
    saveButton.addEventListener('click', function() {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'my-drawing.png';
        link.click();
    });
});