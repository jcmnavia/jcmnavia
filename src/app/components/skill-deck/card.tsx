import React, {FC} from 'react';
import {motion, type MotionProps} from 'framer-motion';
import Image from 'next/image';

export type CardType = {text: string; background: string; image: string};

type CardProperties = {
  card: CardType;
  style: MotionProps['style'];
  onDirectionLock?: MotionProps['onDirectionLock'];
  onDragEnd?: MotionProps['onDragEnd'];
  onDragStart?: MotionProps['onDragStart'];
  animate?: MotionProps['animate'];
};

const Card: FC<CardProperties> = ({
  card,
  style,
  onDirectionLock,
  onDragEnd,
  animate,
}) => (
  <motion.div
    key={card.text}
    drag
    layout
    dragDirectionLock
    className='skills__card'
    dragConstraints={{left: 0, right: 0, top: 0, bottom: 0}}
    onDirectionLock={onDirectionLock}
    onDragEnd={onDragEnd}
    animate={animate}
    style={{...style, background: card.background}}
    transition={{ease: [0.6, 0.05, -0.01, 0.9]}}
    whileTap={{scale: 0.7}}
  >
    <div className='position-relative'>
      <Image
        src={card.image}
        fill
        alt={card.text}
        className='position-relative'
      />
    </div>
  </motion.div>
);

export default Card;
