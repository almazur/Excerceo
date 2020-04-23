require(['scripts/analysis.js']);

// setup video
var video = document.querySelector("#video");

const videoWidth = 500;
const videoHeight = 500;
video.width = videoWidth;
video.height = videoHeight;

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
		console.log("video pose");
		await estimate_pose(net, pose_ref, 10);
      });
}

async function get_start_pose(net){
	//TODO adjust and clean up
	const scaleFactor = 0.50;
	const flipHorizontal = false;
	const outputStride = 16;
	const imageElement = document.getElementById('start');
    const pose = await net.estimateSinglePose(imageElement, scaleFactor, flipHorizontal, outputStride);
    console.log("start pose");
    //console.log(pose);
    
    /*/test
    const pose_vec1 = pose_to_vec2(pose);
    var imageElement2 = document.getElementById('test1');
    var pose2 = await net.estimateSinglePose(imageElement2, scaleFactor, true, outputStride);
    var pose_vec2 = pose_to_vec2(pose2);
    console.log("test similarity");
    console.log(calc_similarity(pose_vec2[0], pose_vec1[0]));
    
    var imageElement2 = document.getElementById('test2');
    pose2 = await net.estimateSinglePose(imageElement2, scaleFactor, true, outputStride);
    var pose_vec2 = pose_to_vec2(pose2);
    console.log("test similarity");
    console.log(calc_similarity(pose_vec2[0], pose_vec1[0]));
    
    var imageElement2 = document.getElementById('test3');
    pose2 = await net.estimateSinglePose(imageElement2, scaleFactor, true, outputStride);
    var pose_vec2 = pose_to_vec2(pose2);
    console.log("test similarity");
    console.log(calc_similarity(pose_vec2[0], pose_vec1[0]));
    
    var imageElement2 = document.getElementById('test4');
    pose2 = await net.estimateSinglePose(imageElement2, scaleFactor, true, outputStride);
    var pose_vec2 = pose_to_vec2(pose2);
    console.log("test similarity");
    console.log(calc_similarity(pose_vec2[0], pose_vec1[0]));
    // end test*/
    
    return pose_to_vec2(pose);
}

async function estimate_pose(net, pose_ref, n){
	if (n != 0) {
		//TODO adjust and clean up
		const scaleFactor = 0.50;
		const flipHorizontal = true;
		const outputStride = 16;
		const videoElement = document.getElementById('video');
		
		const pose = await net.estimateSinglePose(videoElement, scaleFactor, flipHorizontal, outputStride);
		//console.log(pose);
		const pose_vec = pose_to_vec2(pose);
		console.log(calc_similarity2(pose_vec, pose_ref));
		
		setTimeout(function(){
			estimate_pose(net, pose_ref, n-1);
		}, 3000);
	}
}
