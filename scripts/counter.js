
require(['scripts/analysis3.js']);

function CircularArray(maxLength) {
  this.maxLength = maxLength;
}

CircularArray.prototype = Object.create(Array.prototype);

CircularArray.prototype.push = function(element) {
  Array.prototype.push.call(this, element);
  while (this.length > this.maxLength) {
    this.shift();
  }
}

// setup video
var video = document.getElementById("video2");

const videoWidth = 500;
const videoHeight = 500;
video.width = videoWidth;
video.height = videoHeight;
const similarity_threshold = 0.95;

timeout = 5;

const bufferLen = 10;
const posesBuffer = new CircularArray(bufferLen);
const posesRefBuffer = new CircularArray(bufferLen);
const startRefBuffer = new CircularArray(bufferLen);

var video1 = document.getElementById("video1");

if (navigator.mediaDevices.getUserMedia) {
    var media_setup = {
        'audio': false,
        'video': {
            facingMode: 'user',
            width: videoWidth,
            height: videoHeight,
        }
    }
    // access user camera
    navigator.mediaDevices.getUserMedia(media_setup)
        .then(function (stream) {
            video.srcObject = stream;
            video.addEventListener('loadeddata', process_pose, false);
        })
        .catch(function (err) {
            console.log(err);
        });
}

function process_pose(){
    posenet.load().then(async function(net) {
        await init_start_pose(net, 0);
        document.getElementById('start_label').innerHTML = "START!";
        await estimate_pose(net);
    })
}

async function init_start_pose(net, n){
    const scaleFactor = 0.50;
    const flipHorizontal = true;
    const outputStride = 16;

    const pose = await net.estimateSinglePose(video1, scaleFactor, flipHorizontal, outputStride);
    startRefBuffer.push(fit_to_bound_box(pose));

    if (n<bufferLen) {
        setTimeout(function () {
            init_start_pose(net, n + 1);
        }, timeout);
    }
}

function increment_counter(){
    let counter = document.getElementById('counter');
    let number = counter.innerHTML;
    number++;
    counter.innerHTML = number;
}

function set_similarity(similarity){
    document.getElementById('similarity').innerHTML = similarity;
}

async function estimate_pose(net){
    const scaleFactor = 0.50;
    const flipHorizontal = true;
    const outputStride = 16;
    //const videoElement = document.getElementById('video');

    if (video1.readyState === 4) {
        const pose = await net.estimateSinglePose(video, scaleFactor, flipHorizontal, outputStride);
        //const poseRef = await net.estimateSinglePose(video1, scaleFactor, flipHorizontal, outputStride);
        posesBuffer.push(fit_to_bound_box(pose));
        //posesRefBuffer.push(poseRef);

        const similarity = array_cosinesim(startRefBuffer, posesBuffer);
        set_similarity(similarity);

        if (similarity>similarity_threshold)
            increment_counter();
    }

    setTimeout(function(){
        estimate_pose(net);
    }, timeout);
}
