function drawArcCircle(canvas) {
    var context = canvas.getContext("2d");

    context.beginPath();
    context.arc(60, 60, 50, 0, 2 * Math.PI);
    context.fillStyle = "#00ff00";
    context.fill();

    context.beginPath();
    context.arc(140, 140, 50, 0, 2 * Math.PI);
    context.fillStyle = "#00ff00";
    context.fill();

    context.beginPath();
    context.arc(140, 140, 50, 0, 2 * Math.PI);
    context.strokeStyle = "#007f00";
    context.lineWidth = 10;
    context.stroke();
}
