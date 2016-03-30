const mediaElement = document.querySelector('video');
const mediaSource = new MediaSource();
const videoCodec = 'video/mp4; codecs="avc1.42c01e"';
const audioCodec = 'audio/mp4; codecs="mp4a.40.2"';
const appendedOfType = {
  audio: 0,
  video: 0,
};
let sourceOpened = false;
let sourceBufferAudio = null;
let sourceBufferVideo = null;
let segmentData = null;
let highestTimecode = false;
let startedAtTime = false;

mediaSource.addEventListener('error', (error) => { console.error(error); });
mediaElement.addEventListener('error', () => { console.error(mediaElement.error); });
mediaElement.src = window.URL.createObjectURL(mediaSource);

mediaSource.addEventListener('sourceopen', () => {
  sourceBufferAudio = mediaSource.addSourceBuffer(audioCodec);
  sourceBufferVideo = mediaSource.addSourceBuffer(videoCodec);
  // sourceBufferAudio.addEventListener('updateend', waitForUpdateEnd, false);
  sourceBufferAudio.addEventListener('error', (error) => { console.error(error); });
  // sourceBufferVideo.addEventListener('updateend', waitForUpdateEnd, false);
  sourceBufferVideo.addEventListener('error', (error) => { console.error(error); });
  mediaSource.duration = Number.POSITIVE_INFINITY;
  sourceOpened = true;
});

// used for faking "drops"
function filterAndSkip(type, num) {
  let skip = false;

  if (FILTERSTRATEGY === 'audio') {
    if (type === 'audio' && num === 10) {
      skip = true;
    }
  }
  if (FILTERSTRATEGY === 'video') {
    if (type === 'video' && num === 10) {
      skip = true;
    }
  }
  if (FILTERSTRATEGY === 'both') {
    if (type === 'video' && num === 10) {
      skip = true;
    }
    if (type === 'audio' && num === 20) {
      skip = true;
    }
  }

  return skip;
}

function handleQueue(type) {
  const sourceBuffer = (type === 'audio' ? sourceBufferAudio : sourceBufferVideo);
  const queue = (type === 'audio' ? segmentData.audioSegments : segmentData.videoSegments);

  appendedOfType[type] += 1;

  if (sourceOpened &&
     !sourceBuffer.updating &&
      queue.length > 0) {
    const segment = queue.shift();

    // for the sake of this demo, we need to skip some segments to reproduce
    // the bug
    if (!filterAndSkip(type, appendedOfType[type])) {
      sourceBuffer.appendBuffer(segment.data);
    }
  }
}

function checkOff() {
  if (!mediaElement.paused) {
    if (!startedAtTime) {
      startedAtTime = Date.now();
    }
    const diff = (Date.now() - startedAtTime) / 1000;
    if (Math.abs(mediaElement.currentTime - diff) > 0.2) {
      mediaElement.currentTime = diff;
    }
  }
}

window.setMediaDataAndStart = function(data) {
  segmentData = data;
  highestTimecode = data.audioSegments[data.audioSegments.length - 1].timecode;
  setInterval(handleQueue.bind(this, 'audio'), 50);
  setInterval(handleQueue.bind(this, 'video'), 50);
  setInterval(checkOff, 10);
}
