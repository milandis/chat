

    let canvas = document.querySelector("#canvas_1");
    if (canvas.getContext) {
        let context = canvas.getContext("2d");

        let radius = 30;
        let radians = 0.75;
        let openRate = 0.05;
        let currentAngle = 0;
        let direction = 1; // 1 for opening, -1 for closing

        function circleRed() {
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Calculate the end angles based on the current angle
            let endAngle = Math.PI * 2 - (currentAngle + radians);

            // Draw the Pacman icon
            context.beginPath();
            context.arc(45, 45, radius, currentAngle, endAngle, false);
            context.lineTo(45, 45);
            context.fillStyle = 'red';
            context.fill();
            context.strokeStyle = 'red';
            context.stroke();
            context.closePath();

            // Update the current angle based on the direction
            currentAngle += direction * openRate;

            // Reverse the direction if the current angle reaches the limits
            if (currentAngle <= 0 || currentAngle >= Math.PI / 8) {
                direction *= -1;
            }
            requestAnimationFrame(circleRed);
        }
        circleRed();
    }



let canvas2 = document.querySelector("#canvas_2");
if (canvas2.getContext) {
    let context = canvas2.getContext("2d");

    let radius = 30;
    let radians = Math.PI / 3;
    let openRate = 0.03;
    let currentAngle = 2 * Math.PI / 3;
    let direction = 1; // 1 for opening, -1 for closing

    function circleYellow() {
        context.clearRect(0, 0, canvas2.width, canvas2.height);

        // Calculate the end angles based on the current angle
        let endAngle = Math.PI / 3 - (currentAngle + radians);

        // Draw the Pacman icon
        context.beginPath();

        context.arc(45, 45, radius, currentAngle, endAngle, true);
        context.lineTo(45, 45);

        context.fillStyle = 'yellow';
        context.fill();
        context.strokeStyle = 'yellow';
        context.stroke();
        context.closePath();

        // Update the current angle based on the direction
        currentAngle += direction * openRate;

        // Reverse the direction if the current angle reaches the limits
        if (currentAngle <= 2 * Math.PI / 3 || currentAngle >= Math.PI) {
            direction *= -1;
        }
        requestAnimationFrame(circleYellow);
    }
    circleYellow();
}