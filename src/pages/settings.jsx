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
  const frontCameraRef = useRef();

  const saveSettings = () => {
    console.log(frontCameraRef.current.checked);
    localStorage.setItem("vibrations", vibrationsRef.current.checked);
    localStorage.setItem("FPS", FPSref.current.getValue());
    localStorage.setItem(
      "predictionInterval",
      predictionIntervalRef.current.el.f7Range.value
    );
    localStorage.setItem("frontCamera", frontCameraRef.current.checked);
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
          value={+localStorage.getItem("FPS") || 15}
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
          <ul>
            <li>
              <label className='item-radio item-radio-icon-start item-content'>
                <input
                  ref={frontCameraRef}
                  type='radio'
                  name='radio'
                  value='Front'
                  defaultChecked={
                    localStorage.getItem("frontCamera") === "true"
                      ? true
                      : false
                  }
                />
                <i className='icon icon-radio'></i>
                <div className='item-inner'>
                  <div className='item-title'>Front</div>
                </div>
              </label>
            </li>
            <li>
              <label className='item-radio item-radio-icon-start item-content'>
                <input
                  type='radio'
                  name='radio'
                  value='Back'
                  defaultChecked={
                    localStorage.getItem("frontCamera") === "false"
                      ? true
                      : false
                  }
                />
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
          Apply
        </Button>
      </Page>
    </>
  );
};

export default SettingsPage;
