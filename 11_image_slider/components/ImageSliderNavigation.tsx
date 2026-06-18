import React from 'react';
import styles from '@/lib/styles/ImageSliderStyle';

export enum ImageSliderNavStyle {
  NORMAL = 1,
  BOLD = 2
}

export enum ImageSliderNavDirection {
  LEFT = 'left',
  RIGHT = 'right'
}

type ImageSliderNavigationProps = {
  type: ImageSliderNavStyle;
  size: number;
  margin: number;
  direction: ImageSliderNavDirection;
  visible: boolean;
  onClickNav: (direction: ImageSliderNavDirection) => (event: React.SyntheticEvent<HTMLButtonElement>) => void;
};

const altNavArrowLeft = 'slide to left';
const altNavArrowRight = 'slide to right';

const ImageSliderNavigation: React.FC<ImageSliderNavigationProps> = (props: ImageSliderNavigationProps) => {
  const arrowSrc = props.type === ImageSliderNavStyle.NORMAL ? '/images/arrow-normal.svg' : '/images/arrow-bold.svg';
  
  return (
    <>
      {props.visible && (
        <button type="button" style={styles.getNavStyle(props.direction, props.size, props.margin)} onClick={props.onClickNav(props.direction)}>
          <img
            src={arrowSrc}
            style={{ width: '100%', ...(props.direction === ImageSliderNavDirection.RIGHT && { transform: 'rotate(180deg)' }) }}
            alt={props.direction === ImageSliderNavDirection.LEFT ? altNavArrowLeft : altNavArrowRight}
          />
        </button>
      )}
    </>
  );
};

export default ImageSliderNavigation;
