const DELAY = 12000;

setInterval(setCurrentDateTime, DELAY);

function setDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    day = (day < 10) ? '0' + day : day;
    month = (month < 10) ? '0' + month : month;

    $('.date-container').text(`${day}.${month}.${year}`);
}

function setTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;

    $('.time-container').text(`${hours}:${minutes}:${seconds}`);
}

function setCurrentDateTime() {
    const date = new Date();
    setDate(date);
    setTime(date);
}

setCurrentDateTime();