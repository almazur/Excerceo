
require(['scripts/analysis3.js']);

// setup video
var video = document.querySelector("#video");

const videoWidth = 500;
const videoHeight = 500;
video.width = videoWidth;
video.height = videoHeight;
const similarity_threshold = 0.95;

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
        const pose_ref = await get_start_pose(net);
        document.getElementById('start_label').innerHTML = "START!";
        await estimate_pose(net, pose_ref);
    })
}

async function get_start_pose(net){
    const scaleFactor = 0.50;
    const flipHorizontal = false;
    const outputStride = 16;
    const imageElement = document.getElementById('start');
    const pose = await net.estimateSinglePose(imageElement, scaleFactor, flipHorizontal, outputStride);

    return pose;
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

async function estimate_pose(net, pose_ref){
    const scaleFactor = 0.50;
    const flipHorizontal = true;
    const outputStride = 16;
    const videoElement = document.getElementById('video');

    const pose = await net.estimateSinglePose(videoElement, scaleFactor, flipHorizontal, outputStride);
    //console.log(pose);
    const similarity = cosinesim(pose_ref, pose);
    set_similarity(similarity);

    if (similarity>similarity_threshold)
        increment_counter();

    setTimeout(function(){
        estimate_pose(net, pose_ref);
    }, 50);
}
