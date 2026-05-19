import {FC} from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import classNames from 'classnames';

type NavCardProperties = {
  href: string;
  title: string;
  type: string;
};

const NavCard: FC<NavCardProperties> = ({href, title, type}) => {
  return (
    <AnchorLink
      href={href}
      className={classNames('sections__box main-card', type)}
    >
      {/* <Col > */}
      <p className='sections__box-p'>{title}</p>
      {/* </Col> */}
    </AnchorLink>
  );
};

export default NavCard;
