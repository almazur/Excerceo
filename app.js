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
        const scaleFactor = 0.50;
		const flipHorizontal = true;
		const outputStride = 16;
		const imageElement = document.getElementById('video');

		const pose = await net.estimateSinglePose(imageElement, scaleFactor, flipHorizontal, outputStride);
		console.log("Hello");
		console.log(pose);
      });
}
