import React, { useRef } from "react";
import {
  Page,
  Button,
  BlockTitle,
  Block,
  Range,
  Stepper,
} from "framework7-react";

const SettingsPage = () => {
  const FPSref = useRef();
  const vibrationsRef = useRef();
  const predictionIntervalRef = useRef();
  const cameraRef = useRef();

  const saveSettings = () => {
    localStorage.setItem("vibrations", vibrationsRef.current.checked);
    localStorage.setItem("FPS", FPSref.current.getValue());
    localStorage.setItem(
      "predictionInterval",
      predictionIntervalRef.current.el.f7Range.value
    );
  };

  return (
    <>
      <Page name='settings' className='container-component'>
        <h2 className='title'>Settings</h2>

        <BlockTitle>FPS of camera</BlockTitle>
        <Stepper
          type='text'
          readOnly
          min={10}
          max={50}
          step={5}
          color='black'
          ref={FPSref}
          value={+localStorage.getItem("FPS") || 10}
        />

        <BlockTitle>Prediction Interval</BlockTitle>
        <Block strong>
          <Range
            min={1}
            max={10}
            label={true}
            step={1}
            scale={true}
            scaleSteps={9}
            scaleSubSteps={1}
            ref={predictionIntervalRef}
            value={+localStorage.getItem("predictionInterval") || 2}
          />
        </Block>

        <div className='block-title'>Camera</div>
        <div className='block-header'>
          Choose which camera will predict emotions
        </div>
        <div className='list'>
          <ul ref={cameraRef}>
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
                <input
                  type='checkbox'
                  ref={vibrationsRef}
                  defaultChecked={
                    localStorage.getItem("vibrations") === "true" ? true : false
                  }
                />
                <span className='toggle-icon'></span>
              </label>
            </li>
          </ul>
        </div>

        <Button
          outline
          color='black'
          href='/'
          className='button'
          onClick={saveSettings}
        >
          Back
        </Button>
      </Page>
    </>
  );
};

export default SettingsPage;
