import NavCard from '@/app/components/nav-card';
import {Container, Row} from 'reactstrap';

const Navbar = () => {
  return (
    <section className='sections'>
      <Container className='sections__container h-100'>
        <Row className='sections__wrapper h-100'>
          <NavCard type='sections__wrapper--1' title='Work' href='#work' />
          <NavCard type='sections__wrapper--2' title='Skills' href='#skills' />
          <NavCard
            type='sections__wrapper--3'
            title='Education'
            href='#education'
          />
          <NavCard
            type='sections__wrapper--4'
            title='About me'
            href='#aboutme'
          />
        </Row>
      </Container>
    </section>
  );
};

export default Navbar;
