window.addEventListener('load', () => {

    const socket = new WebSocket(
        'ws://' +
        window.location.host +
        '/ws/drawing/'
    )

    socket.addEventListener('open', (event) => {
        console.log('Websocket connection opened: ' + event)
    })

    socket.addEventListener('close', (event) => {
        console.log('Websocket connection closed: ' + event)
    })

    const canvas = document.querySelector('#canvas');
    const canvasContext = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8;

    canvasContext.fillStyle = 'lightgray';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    let painting = false;

    function startPosition() {
        painting = true;
        canvasContext.beginPath();
    }

    function endPosition() {
        painting = false;
    }

    function draw(x, y) {
        // To adjust the page view
        const rect = canvas.getBoundingClientRect();
        const offsetX = x - rect.left;
        const offsetY = y - rect.top;

        canvasContext.lineWidth = 1;
        canvasContext.lineTo(offsetX, offsetY);
        canvasContext.stroke();
    }

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);

    canvas.addEventListener('mousemove', (e) => {
        if (painting) {
            draw(e.clientX, e.clientY);

            // Send the coordinates to the server
            socket.send(JSON.stringify({
                'action': 'draw',
                'x': e.clientX,
                'y': e.clientY
            }));
        }
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        const x = data['x'];
        const y = data['y'];

        console.log('Received X and Y from server:', x, y);
        draw(x, y);
    });

    var chosenColor = 'rgba(255,0,0,1)';
    document.addEventListener('colorChosen', function (event) {
        chosenColor = event.detail.color;
        // Now you can use the updated chosenColor in your canvas.js logic
        console.log('Updated chosen color in canvas.js:', chosenColor);
    });
});