/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image';
import {Col, Container, Row} from 'reactstrap';

const AboutMe = () => {
  return (
    <section id='aboutme'>
      <Container>
        <Row>
          <Col xs={12} md={8} className='aboutme__intro  main-card'>
            <h3 className='aboutme__title'>Yep! This is me 😎</h3>
            <p>
              I am a person always interested in learning and improving myself
              in every way. I'm passionate in what I do and always give my best
              no matter what.
            </p>
            <p>
              I've been always into computers and stuff (oh, I did... explore
              into some computers - Yes, I broke them 😅). I really believe in
              self-taught learning, that's why even since I started the
              university, I took the knowledge to the next level and put into
              real world situations, getting that extra experience that gave me
              a boost. Now I'm proud to say that I've become a great developer,
              I've so much to offer and still so much to learn. My journey
              started at 17th years-old and I don't expect it to end soon, on
              the contrary, here I am looking for challenges!
            </p>

            <p>
              I also love reading books -- don't tell me you don't like Harry
              Potter 🫣, I love practicing tennis 🎾, I'm a photographer when I
              have the chance 📸 and... yeah, I think that's it. Ah, I also like
              to paint 🎨.
            </p>

            <br />
            <p>
              Feel free to reach me out to discuss something, grab a coffee,
              play tennis, develop that amazing idea you have, anything, really!
            </p>
          </Col>
          <Col
            xs={12}
            md={4}
            className='position-relative aboutme__image-container'
          >
            <Image
              fill
              alt='Me'
              src='/images/me.jpg'
              className='img-fluid aboutme__image'
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutMe;
