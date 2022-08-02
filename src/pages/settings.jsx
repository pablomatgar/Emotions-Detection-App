import React, { useEffect, useRef, useState } from "react";
import { Page, Button, BlockTitle, Block, Range } from "framework7-react";

const SettingsPage = () => {
  const vibrationsRef = useRef();
  const FPSRef = useRef();

  let [FPS, setFPS] = useState(15);
  let [vibrations, setVibrations] = useState(false);

  useEffect(() => {
    if(localStorage.getItem('vibrations') === null){
      localStorage.setItem('vibrations', vibrations);
    }
    else{
      setVibrations(localStorage.getItem('vibrations'));
    }
  
    if(localStorage.getItem('FPS') === null){
      localStorage.setItem('FPS', FPS);
    }
    else{
      setFPS(localStorage.getItem('FPS'));
    }
  }, [])

  const saveSettings = () => {
    console.log(vibrationsRef.current.checked)
    console.log(FPSRef.current.value)
    localStorage.setItem('vibrations', vibrationsRef.current.checked);
    localStorage.setItem('FPS', FPSRef.current.value);
  };

  return (
    <>
      <Page name='settings' className='container-component'>
        <h2 className='title'>Settings</h2>

        <BlockTitle>FPS of camera</BlockTitle>
        <div className='stepper stepper-init color-black'>
          <div className='stepper-button-minus'></div>
          <div className='stepper-input-wrap'>
            <input type='text' readOnly min='5' max='50' step='5' value={FPS} ref={FPSRef} />
          </div>
          <div className='stepper-button-plus'></div>
        </div>

        <BlockTitle>Prediction Interval</BlockTitle>
        <Block strong>
          <Range
            min={1}
            max={10}
            label={true}
            step={1}
            value={2}
            scale={true}
            scaleSteps={9}
            scaleSubSteps={1}
          />
        </Block>

        <div className='block-title'>Camera</div>
        <div className='block-header'>
          Choose which camera will predict emotions
        </div>
        <div className='list'>
          <ul>
            <li>
              <label className='item-radio item-radio-icon-start item-content'>
                <input type='radio' name='demo-radio-start' value='Front' />
                <i className='icon icon-radio'></i>
                <div className='item-inner'>
                  <div className='item-title'>Front</div>
                </div>
              </label>
            </li>
            <li>
              <label className='item-radio item-radio-icon-start item-content'>
                <input type='radio' name='demo-radio-start' value='Back' />
                <i className='icon icon-radio'></i>
                <div className='item-inner'>
                  <div className='item-title'>Back</div>
                </div>
              </label>
            </li>
          </ul>
        </div>

        <div className='block-title'>Vibrations</div>
        <div className='block-header'>
          Activate to vibrate while you are happy
        </div>
        <div className='list simple-list'>
          <ul>
            <li>
              <span>Vibrations</span>
              <label className='toggle toggle-init color-black'>
                <input type='checkbox' ref={vibrationsRef} checked={vibrations}/>
                <span className='toggle-icon'></span>
              </label>
            </li>
          </ul>
        </div>

        <Button outline color='black' href='/' className='button' onClick={saveSettings}>
          Back
        </Button>
      </Page>
    </>
  );
};

export default SettingsPage;
