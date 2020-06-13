function setCorrectness(correctness){
    document.getElementById('correctnessText').innerHTML = (correctness * 100).toFixed(1) + "%";
    document.getElementById('correctnessProgressbar').style.width = (correctness * 100).toFixed(0) + "%";
}

function setLastCorrectness(correctness){
    document.getElementById('correctnessText2').innerHTML = (correctness * 100).toFixed(1) + "%";
    document.getElementById('correctnessProgressbar2').style.width = (correctness * 100).toFixed(0) + "%";
}

let count = 0
function incrementRepetitionsCount(){
    document.getElementById('repetitionsCount').innerHTML = ++count;
}

let startedTime = new Date();

function startTime() {
    startedTime = new Date();
    setInterval(updateTime, 500);
}

function updateTime() {
    let timeDiff = new Date() - startedTime;
    let str = new Date(timeDiff).toISOString().substr(11, 8)
    document.getElementById('timeSpent').innerHTML = str;
}




