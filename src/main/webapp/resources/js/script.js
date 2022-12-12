$(function() {
    const X_VALUES = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
    const Y_MIN = -5.0, Y_MAX = 3.0;
    const R_VALUES = [1.0, 1.5, 2.0, 2.5, 3.0];

    let xval;
    let yval;
    let rval;

    let canvas = document.getElementById("plot"),
        ctx     = canvas.getContext('2d');

    function drawPlot() {
        ctx.width = 320;
        ctx.high = 320;
        let width = ctx.width,
            high = ctx.high;

        ctx.fillStyle = '#00FFFF';

        ctx.beginPath();
        //radius
        ctx.arc(width / 2, high / 2, 150, 3 * Math.PI / 2, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(160, 160);
        ctx.lineTo(310, 160);
        ctx.lineTo(160, 10);
        ctx.closePath();
        ctx.fill();
        //square
        ctx.fillRect(160, 160, 150, 150);

        //triangle
        ctx.beginPath();
        ctx.moveTo(10, 160);
        ctx.lineTo(160, 160);
        ctx.lineTo(160, 160 + 75);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'black';
        ctx.font = "15px Arial bold"

        //0x
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 160);
        ctx.lineTo(320, 160);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(320, 160);
        ctx.lineTo(315, 155);
        ctx.lineTo(315, 165);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(10, 156);
        ctx.lineTo(10, 164);
        ctx.stroke();
        ctx.fillText("-R", 10, 156);

        ctx.beginPath();
        ctx.moveTo(85, 156);
        ctx.lineTo(85, 164);
        ctx.stroke();
        ctx.fillText("-R/2", 85, 156);

        ctx.beginPath();
        ctx.moveTo(235, 156);
        ctx.lineTo(235, 164);
        ctx.stroke();
        ctx.fillText("R/2", 235, 156);

        ctx.beginPath();
        ctx.moveTo(310, 156);
        ctx.lineTo(310, 164);
        ctx.stroke();
        ctx.fillText("R", 308, 156);
        ctx.fillText("X", 310, 180);

        //0y
        ctx.beginPath();
        ctx.moveTo(160, 0);
        ctx.lineTo(160, 320);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(160, 0);
        ctx.lineTo(155, 5);
        ctx.lineTo(165, 5);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(156, 10);
        ctx.lineTo(164, 10);
        ctx.stroke();
        ctx.fillText("R", 164, 15);

        ctx.beginPath();
        ctx.moveTo(156, 85);
        ctx.lineTo(164, 85);
        ctx.stroke();
        ctx.fillText("R/2", 164, 90);

        ctx.beginPath();
        ctx.moveTo(156, 235);
        ctx.lineTo(164, 235);
        ctx.stroke();
        ctx.fillText("-R/2", 164, 240);

        ctx.beginPath();
        ctx.moveTo(156, 310);
        ctx.lineTo(164, 310);
        ctx.stroke();
        ctx.fillText("-R", 164, 315);
        ctx.fillText("Y", 145, 10);
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawPoint(x, y, r, h) {
        if (rval !== r)
            return;

        if (x > canvas.width || x < -canvas.width || y > canvas.height || y < -canvas.height)
            return;

        ctx.beginPath();
        ctx.fillStyle = h === 'Miss' ? 'red' : 'green';
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    canvas.addEventListener('click', function (event) {
        if (!validateR()) return;

        loadTablePoints();


        let xFromCanvas = (event.offsetX - 160) / 150 * rval;
        let minDifference = Infinity;
        let nearestXValue;
        let index = 0;

        for (let i = 0; i < X_VALUES.length; i++) {
            if (Math.abs(xFromCanvas - X_VALUES[i]) < minDifference) {
                minDifference = Math.abs(xFromCanvas - X_VALUES[i]);
                nearestXValue = X_VALUES[i];
                index = i;
            }
        }

        let yValue = (-event.offsetY + 160) / 150 * rval;
        if (yValue < Y_MIN) yValue = Y_MIN;
        else if (yValue > Y_MAX) yValue = Y_MAX;

        drawPoint(nearestXValue * 150 / rval + 160, -(yValue / rval *  150 - 160), rval, 'Miss');

        document.getElementById("former:x:" + index).checked = true;

        $('.y-textinput').val(yValue.toString().substring(0, 10));
        //$('.sender').click();
    });

    function start() {
        loadTablePoints();
        //document.getElementById("former:r-button5").click();
    }

    function loadTablePoints() {
        clearCanvas();
        drawPlot();

        let rows = [];
        let headers = $(".result-table th");

        $(".result-table tr").each(function(index) {
            let cells = $(this).find("td");
            rows[index] = {};
            cells.each(function(cellIndex) {
                rows[index][$(headers[cellIndex]).html()] = $(this).html().replace(/\s/g, "");
            });
        });

        for (let i = 0; i < rows.length; i++) {
            drawPoint(
                rows[i]['X'] * 150 / rval + 160,
                -(rows[i]['Y'] / rval * 150 - 160),
                rows[i]['R'],
                rows[i]['Результат']);
        }
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function validateX() {
        let qw = 0;
        for (; qw < 9; qw++) {
            if (document.getElementById("former:x")[qw].checked === true) {
                xval = document.getElementById("former:x")[qw].value;
                break;
            } else {
                xval = -10;
            }
        }

        if (isNumeric(xval) && X_VALUES.includes(xval)) {
            $('.text-error').addClass('invisible');
            return true;
        } else {
            $('.text-error').text('Неправильный формат x');
            $('.text-error').removeClass('invisible');
            return false;
        }
    }

    function validateY() {
        yval = $('.y-textinput').val();

        if (isNumeric(yval) && yval > Y_MIN && yval < Y_MAX) {
            $('.text-error').addClass('invisible');
            return true;
        } else {
            $('.text-error').text('Неправильный формат y');
            $('.text-error').removeClass('invisible');
            return false;
        }
    }

    function validateR() {
        if (isNumeric(rval) && R_VALUES.includes(parseFloat(rval))) {
            $('.text-error').addClass('invisible');
            return true;
        } else {
            $('.text-error').text('Неправильный формат r');
            $('.text-error').removeClass('invisible');
            return false;
        }
    }

    function validateForm() {
        return validateX() && validateY() && validateR();
    }

    $('.sender').on('click', function(event) {
        if (!validateForm()) {
            event.preventDefault();
        } else {
            $('.r-hide').val(rval);
        }
    });

    $('.r-button').on('click', function() {
        rval = $(this).val();
        let rp = document.getElementById('former:r-hide');
        rp.value = rval;

        if (!validateR())
            return;

        $(this).addClass('r_clicked');
        $('.r-button').not(this).removeClass('r_clicked');

        loadTablePoints();
    })

    $('.list-x').on('click', function() {
        xval = $(this).val();
        validateX();
    });
    $('.y-textinput').on('input', validateY);

    start();
});