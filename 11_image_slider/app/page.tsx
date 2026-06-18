'use client';

import React, { useCallback, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Checkbox from '@mui/material/Checkbox';
import SimpleImageSlider from '@/components/ImageSlider';

const IMAGES = [
  { url: '/images/1.jpg' },
  { url: '/images/2.jpg' },
  { url: '/images/3.jpg' },
  { url: '/images/4.jpg' },
  { url: '/images/5.jpg' },
  { url: '/images/6.jpg' },
  { url: '/images/7.jpg' }
];

type SliderOptions = {
  useGPURender: boolean;
  showNavs: boolean;
  showBullets: boolean;
  loop: boolean;
  autoPlay: boolean;
  autoPlayDelay: number;
  startIndex: number;
  navStyle: 1 | 2;
  navSize: number;
  navMargin: number;
  duration: number;
  bgColor: string;
};

export default function Home() {
  const [sliderOptions, setSliderOptions] = useState<SliderOptions>({
    useGPURender: true,
    showNavs: true,
    showBullets: true,
    loop: true,
    autoPlay: true,
    autoPlayDelay: 2,
    startIndex: 3,
    navStyle: 1,
    navSize: 50,
    navMargin: 30,
    duration: 0.5,
    bgColor: '#000'
  });

  const [slideIndexText, setSlideIndexText] = useState<string>('');

  const onClick = useCallback((idx: number, event: React.SyntheticEvent) => {
    console.log(`[App onClick] ${idx} ${event.currentTarget}`);
  }, []);

  const onClickNav = useCallback((toRight: boolean) => {
    console.log(`[App onClickNav] ${toRight}`);
  }, []);

  const onClickBullets = useCallback((idx: number) => {
    console.log(`[App onClickBullets] ${idx}`);
  }, []);

  const onStartSlide = useCallback((idx: number, length: number) => {
    console.log(`[App onStartSlide] ${idx}/${length}`);
    setSlideIndexText(`${idx} / ${length}`);
  }, []);

  const onCompleteSlide = useCallback((idx: number, length: number) => {
    console.log(`[App onCompleteSlide] ${idx}/${length}`);
    setSlideIndexText(`${idx} / ${length}`);
  }, []);

  const updateOptions = useCallback(
    (key: string, value: boolean | number | string) => () => {
      console.log(`[App updateOptions] ${key} ${value}`);
      switch (key) {
        case 'navStyle':
          setSliderOptions({ ...sliderOptions, navStyle: value as 1 | 2 });
          break;
        default:
          setSliderOptions({ ...sliderOptions, [key]: value });
          break;
      }
    },
    [sliderOptions]
  );

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }} className="root">
      <AppBar style={{ 
        position: 'relative', 
        height: 120, 
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        borderRadius: '16px',
        marginBottom: '30px'
      }}>
        <h1 style={{ 
          margin: 0,
          paddingTop: '35px',
          color: '#fff',
          fontSize: '2.5rem',
          fontWeight: '700',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>React Simple Image Slider</h1>
      </AppBar>
      
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <SimpleImageSlider
          style={{ margin: '0 auto', borderRadius: '12px', overflow: 'hidden' }}
          width={896}
          height={504}
          images={IMAGES}
          showBullets={sliderOptions.showBullets}
          showNavs={sliderOptions.showNavs}
          loop={sliderOptions.loop}
          autoPlay={sliderOptions.autoPlay}
          autoPlayDelay={sliderOptions.autoPlayDelay}
          startIndex={sliderOptions.startIndex}
          useGPURender={sliderOptions.useGPURender}
          navStyle={sliderOptions.navStyle}
          navSize={sliderOptions.navSize}
          navMargin={sliderOptions.navMargin}
          slideDuration={sliderOptions.duration}
          onClick={onClick}
          onClickNav={onClickNav}
          onClickBullets={onClickBullets}
          onStartSlide={onStartSlide}
          onCompleteSlide={onCompleteSlide}
        />

        <div style={{ 
          margin: '20px 0', 
          fontSize: '1.2rem',
          color: '#333',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          {slideIndexText || `${sliderOptions.startIndex + 1} / ${IMAGES.length}`}
        </div>

        <List
          subheader={
            <ListSubheader style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              borderRadius: '12px',
              padding: '15px 20px',
              marginBottom: '15px'
            }}>
              <h1 style={{ 
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: '600'
              }}>Slider Settings</h1>
            </ListSubheader>
          }
          style={{ 
            margin: '0 auto',
            width: '100%',
            maxWidth: '900px',
            textAlign: 'left',
            background: '#f8f9fa',
            borderRadius: '12px',
            padding: '10px'
          }}>
          {Object.entries(sliderOptions)
            .filter((item): item is [string, boolean] => typeof item[1] === 'boolean')
            .map((item) => (
              <ListItemButton 
                key={item[0]} 
                onClick={updateOptions(item[0], !item[1])}
                style={{
                  borderRadius: '8px',
                  margin: '5px 0',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: '#e9ecef'
                  }
                }}
              >
                <Checkbox checked={item[1]} disableRipple />
                <ListItemText primary={`${item[0]}`} />
              </ListItemButton>
            ))}
        </List>
      </div>
    </div>
  );
}
