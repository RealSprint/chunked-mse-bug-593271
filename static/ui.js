/*
this file is only used to update ui, has nothing to do with bug
*/

const currentTimeElement = document.querySelector('#currentTime');
const rangesMedia = document.querySelector('#rangesMedia');
const rangesAudio = document.querySelector('#rangesAudio');
const rangesVideo = document.querySelector('#rangesVideo');

function updateGui() {
  currentTimeElement.textContent = mediaElement.currentTime;
  rangesMedia.textContent = mediaElement.buffered.length;
  rangesAudio.textContent = sourceBufferAudio.buffered.length;
  rangesVideo.textContent = sourceBufferVideo.buffered.length;
}

setInterval(updateGui, 50);
