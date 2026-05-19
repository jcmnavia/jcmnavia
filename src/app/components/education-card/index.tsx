import {FC} from 'react';
import {Col, Row} from 'reactstrap';
import {faLocationDot} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

type EducationCardProperties = {
  title: string;
  place: string;
  university: string;
  dates: string;
  gpa?: string;
  size?: number;
};

const EducationCard: FC<EducationCardProperties> = ({
  title,
  place,
  university,
  gpa,
  dates,
}) => {
  return (
    <Col xs={12} md={12} className='education__card-col px-0'>
      <Row className='education__card mx-0 h-100'>
        <Col xs={12} md={8} className='d-flex flex-column'>
          <h4 className='education__card-title'>{title}</h4>
          <p className='education__card-uni mt-auto'>{university}</p>
          <p className='education__card-place'>
            <FontAwesomeIcon icon={faLocationDot} className='me-2' />
            {place}
          </p>
        </Col>
        <Col xs={12} md={4} className='text-end'>
          <p className='education__card-dates'>{dates}</p>
          {gpa && <p className='education__card-gpa'>GPA: {gpa}</p>}
        </Col>
      </Row>
    </Col>
  );
};

export default EducationCard;
