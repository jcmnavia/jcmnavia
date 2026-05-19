import EducationCard from '@/app/components/education-card';
import {Container, Row, Col} from 'reactstrap';
import {motion} from 'framer-motion';

const Education = () => {
  return (
    <section id='education' className='education'>
      <Container>
        <Row>
          <Col xs={12} className='px-0'>
            <motion.div
              className='education__intro main-card d-flex flex-column'
              initial={{scale: 0.9}}
              whileInView={{scale: 1}}
              transition={{delay: 0.2, duration: 0.2}}
              viewport={{once: true}}
            >
              <h3 className='main-card__title'>
                This is not just some paper...
              </h3>
              <p className='main-card__big-title my-auto'>
                IS THE <br />
                KEY TO <br />
                SUCCESS <br />
              </p>
            </motion.div>
          </Col>
        </Row>

        <Row className='justify-content-center education__card-grid'>
          <EducationCard
            title='Sofware Engineer'
            university='EAFIT University'
            place='Medellin, Colombia'
            dates='2017-2022'
            gpa='4.1'
            size={12}
          />
          <EducationCard
            title='Java tutor'
            university='EAFIT University'
            place='Medellin, Colombia'
            dates='Jan 2019 - May 2019'
          />
          <EducationCard
            title='Black Belt Certificacion'
            university='DEV.F'
            place='Medellin, Colombia'
            dates='2019'
          />
          <EducationCard
            title={`Sofware Engineer\nExchange Program`}
            university='La Salle Ramon Lull University'
            place='Barcelona, Spain'
            dates='Aug 2019 - Jan 2020'
            gpa='4.5'
          />
        </Row>
      </Container>
    </section>
  );
};

export default Education;
