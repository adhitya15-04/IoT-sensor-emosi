const video = document.getElementById('video');
const socket = io();


Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
])
.then(() => {
  console.log("✅ Model face-api dimuat");
  startVideo();
});

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
      console.log("📷 Kamera aktif");
    })
    .catch(err => console.error("🚫 Gagal akses kamera:", err));
}

video.addEventListener('play', () => {
  console.log("▶️ Video diputar");
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(
      video,
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceExpressions();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    if (detections.length > 0) {
      const expressions = detections[0].expressions;
      const dominantEmotion = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b);
      console.log("😊 Emosi terdeteksi:", dominantEmotion);
      socket.emit('deteksiEmosi', dominantEmotion);
    }
    // Inisialisasi MediaPipe Hands
const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.5
});

hands.onResults(onHandResults);

const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 640,
  height: 480
});
camera.start();

// Fungsi untuk mengecek jumlah jari yang terbuka
function onHandResults(results) {
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) return;

  const landmarks = results.multiHandLandmarks[0];

  const fingerTips = [8, 12, 16, 20]; // Telunjuk s.d. kelingking
  const thumbTip = 4;

  let count = 0;

  // Thumb (jempol)
  if (landmarks[thumbTip].x < landmarks[3].x) count++;

  // Other fingers
  fingerTips.forEach((tip) => {
    if (landmarks[tip].y < landmarks[tip - 2].y) count++;
  });

  console.log("🖐️ Angka tangan terdeteksi:", count);
  socket.emit("deteksiGesture", count);
}

  }, 2000);
  
});
