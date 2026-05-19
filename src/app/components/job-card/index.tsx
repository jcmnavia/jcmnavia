import {FC} from 'react';
import Image from 'next/image';
import {Col, Row} from 'reactstrap';
import {motion} from 'framer-motion';

type JobCardProperties = {
  title: string;
  description: string;
  place: string;
  dates: string;
  image: string;
};

const JobCard: FC<JobCardProperties> = ({
  title,
  description,
  place,
  dates,
  image,
}) => {
  return (
    <Row className='work__jobs'>
      <Col xs={12} md={6} className='position-relative px-0 ps-md-0'>
        <motion.div
          className='work__jobs-left'
          initial={{x: '50%', width: '100%'}}
          whileInView={{x: 0, width: '110%'}}
          viewport={{once: true}}
          transition={{
            type: 'tween',
            duration: 0.7,
            delay: 0.2,
            default: {ease: 'linear'},
          }}
        >
          <h3 className='work__jobs-title'>{title}</h3>
          <p className='work__jobs-description'>{description}</p>
        </motion.div>
      </Col>

      <motion.div
        className='work__jobs-right col-12 col-md-6'
        initial={{x: '-50%'}}
        whileInView={{x: 0}}
        viewport={{once: true}}
        transition={{
          type: 'tween',
          duration: 0.7,
          delay: 0.2,
          default: {ease: 'linear'},
        }}
      >
        <Row className='align-items-center h-100'>
          <Col xs={2}>
            <Image
              width={60}
              height={60}
              // fill
              alt={place}
              className='img-fluid'
              src={image}
            />
          </Col>
          <Col className=''>
            <h4 className='work__jobs-place'>{place}</h4>
            <p className='work__jobs-dates'>{dates}</p>
          </Col>
        </Row>
      </motion.div>
    </Row>
  );
};

export default JobCard;
