import React, { useEffect, useRef, useState } from 'react';
import { Page, Button, f7, f7ready } from 'framework7-react';
import * as faceapi from '@vladmandic/face-api/dist/face-api.esm.js';
import placeholder from '../static/placeholder.png';

// TODO: move functions to js folder, follow this style https://github.com/monaca-samples/blink-to-text/blob/main/src/js/blinkPrediction.js

const HomePage = () => {
  const videoRef = useRef(null);
  const imageRef = useRef(null);
  const [detectedEmotion, setDetectedEmotion] = useState('Loading...');
  const MODEL_URL = 'models';

  const init = async () => {
    try {
      // load model
      await loadModel();
      // predict with dummy picture
      if (isMobile()) {
        predicting(imageRef.current);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loadModel = async () => {
    try {
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    } catch (err) {
      console.log(err);
    }
  };

  const startVideo = async () => {
    try {
      if (isMobile()) {
        await startCanvasCamera();
        predictEmotion(imageRef.current);
      } else {
        await getBrowserCamera();
        predictEmotion(videoRef.current);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ------------------------- Helper functions -------------------------
  const isAndroid = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) return true;
    return false;
  };

  const isIos = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/iPad|iPhone|iPod/i.test(userAgent)) return true;
    return false;
  };

  const isMobile = () => {
    if (window.cordova && (isAndroid() || isIos())) {
      return true;
    } else {
      return false;
    }
  };

  // ------------------------- Predictions -------------------------
  const start = async () => {
    try {
      // TODO: toggle caption to stop
      // TODO: if the app is left out (no face detection) for several minutes to avoid crashing (memory consuming)
      startVideo();
    } catch (err) {
      console.log(err);
    }
  };

  const predictEmotion = (stream) => {
    setInterval(() => {
      if (!stream) return;
      predicting(stream);
    }, (+localStorage.getItem('predictionInterval') || 5) * 1000);
  };

  const predicting = (stream) => {
    faceapi
    .detectSingleFace(stream)
    .withFaceExpressions()
    .then(detectionWithExpressions => {
      setEmotionResult(detectionWithExpressions);
    })
    .catch(err => console.log(err));
  };

  const setEmotionResult = (detectionWithExpressions) => {
    try {
      const singlePredictedEmotion = Object.entries(
        detectionWithExpressions.expressions
      ).filter((key) => {
        if (
          key[0] === 'angry' &&
          localStorage.getItem('vibrations') === 'true'
        ) {
          console.log('brrr');
          navigator.vibrate(1000);
        }
        key[0] = (key[0] + ' ').toUpperCase();
        key[1] = Math.trunc(key[1] * 100);
        return key[1] > 80;
      });
      if (singlePredictedEmotion.length > 0) {
        setDetectedEmotion(
          singlePredictedEmotion.toString().replace(/,/g, '') + '%'
        );
      }
    } catch (error) {
      setDetectedEmotion('No face found');
    }
  };

  // ------------------------- Camera functions -------------------------
  // Desktop
  const getBrowserCamera = () => {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: 'user',
          width: 224,
          height: 224,
        },
      })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        return resolve(stream);
      })
      .catch((err) => {
        console.log('Something went wrong!', err);
        return reject(err);
      });
    });
  };

  // Mobile
  const readImageFile = (data) => {
    // set file protocol
    const protocol = 'file://';
    let filepath = '';
    if (isAndroid()) {
      filepath = protocol + data.output.images.fullsize.file;
    } else {
      filepath = data.output.images.fullsize.file;
    }
    // read image from local file and assign to image element
    window.resolveLocalFileSystemURL(
      filepath,
      (fileEntry) => {
        fileEntry.file(
          (file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const blob = new Blob([new Uint8Array(reader.result)], {
                type: 'image/png',
              });
              try {
                imageRef.current.src = window.URL.createObjectURL(blob);
              } catch (error) {
                console.warn('Video element has not loaded yet: ' + error);
              }
            };
            reader.readAsArrayBuffer(file);
          },
          (err) => {
            console.log('error reading image file', err);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const startCanvasCamera = () => {
    return new Promise((resolve, reject) => {
      const options = {
        canvas: {
          width: 224,
          height: 224,
        },
        capture: {
          width: 224,
          height: 224,
        },
        use: 'file',
        fps: +localStorage.getItem('FPS') || 15,
        hasThumbnail: false,
        cameraFacing:
          // Camera will be front as a defaults
          localStorage.getItem('frontCamera') === 'false' ? 'back' : 'front',
      };
      window.plugin.CanvasCamera.start(
        options,
        (err) => {
          console.log('Something went wrong!', err);
          return reject(err);
        },
        (stream) => {
          return resolve(readImageFile(stream));
        }
      );
    });
  };

  return (
    <Page name='home' className='container-component' onPageInit={init}>
      <h2 className='title'>Emotions Recognition</h2>
      <p className='sub-title'>How do you feel today?</p>

      {isMobile() ? (
        <img
          className='capturing-img'
          ref={imageRef}
          width='224'
          height='224'
          src={placeholder}
        />
      ) : (
        <video className='capturing-video' ref={videoRef} autoPlay></video>
      )}

      <h2 className='recognized-title'>Recognised emotion:</h2>
      <p className='recognized-emotion'>{detectedEmotion}</p>
      <Button
        outline
        color='black'
        className='button'
        onClick={start}
      >
        Play
      </Button>
      <Button
        outline
        color='black'
        href='/settings'
        className='button'
        onClick={() => {
          if (isMobile()) {
            imageRef.current.src = null;
          } else {
            videoRef.current.srcObject = null;
          }
        }}
      >
        Settings
      </Button>
      
      <p className='footer'>
        Created by <br /> Asial Corporation
      </p>
    </Page>
  );
};
export default HomePage;
