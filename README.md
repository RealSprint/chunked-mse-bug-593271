Code for reproducing and debugging [Chromium issue no 593271](https://bugs.chromium.org/p/chromium/issues/detail?id=593271).

----

In summary:
When having separate audio and video source buffers where one video segment (ie. 200 ms) goes missing, the video freezes without it being able to unfreeze on seek. If an audio segment goes missing (either by itself or in a period after the video freezes) the video resumes.

This bug does not exist in Firefox.

This example has four scenarios that demos the weird behavior:

- no skips, works fine
- skip one video segment after one second. Results in video still freezes on seek (with ongoing audio).
- skip one audio segment after one second. Results in video working on seek.
- skip one video segment after one second, then one audio segment after another second. Results in video working on seek.

The node server is needed only to list and serve the files. (npm install;node server.js;), it listens to port 3000.
