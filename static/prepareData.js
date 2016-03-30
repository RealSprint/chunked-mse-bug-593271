/*
this file is only used to get the data into the browser, has nothing to do with bug
*/

(() => {
  const audioSegments = [];
  const videoSegments = [];

  if (location.href.indexOf('skipaudio') !== -1) {
    window.FILTERSTRATEGY = 'audio';
  }
  if (location.href.indexOf('skipvideo') !== -1) {
    window.FILTERSTRATEGY = 'video';
  }
  if (location.href.indexOf('skipboth') !== -1) {
    window.FILTERSTRATEGY = 'both';
  }

  window.FILTERSTRATEGY = window.FILTERSTRATEGY || false;

  function segSort(a, b) {
    return a.timecode - b.timecode;
  }
  function start() {
    audioSegments.sort(segSort);
    videoSegments.sort(segSort);

    window.setMediaDataAndStart({
      audioSegments,
      videoSegments,
    });
  }

  const promiseList = [];

  function addFetchPromise(segmentName) {
    promiseList.push(new Promise(function(resolve, reject) {
      fetch('/segments/' + segmentName).then((res) => {
        res.arrayBuffer().then((buf) => {
          if (segmentName.indexOf('video') !== -1) {
            videoSegments.push({
              data: buf,
              timecode: segmentName.indexOf('_') !== -1 && parseInt(segmentName.split('_')[1], 10) || 0,
            });
          } else if (segmentName.indexOf('audio') !== -1) {
            audioSegments.push({
              data: buf,
              timecode: segmentName.indexOf('_') !== -1 && parseInt(segmentName.split('_')[1], 10) || 0,
            });
          }

          resolve();
        })
      })
    }));
  }
  fetch('/list')
    .then((response) => {
      return response.json();
    })
    .then((resourceList) => {
      for (let i = resourceList.length - 1; i >= 0; i--) {
        addFetchPromise(resourceList[i]);
      }

      Promise.all(promiseList).then(start);
    });

})();
