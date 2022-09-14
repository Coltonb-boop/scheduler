import React from "react";
import classNames from "classnames";

import './DayListItem.scss';

export default function DayListItem(props) {

  let dayClass = classNames({
    'day-list__item': true,
    'day-list__item--selected': props.selected,
    'day-list__item--full': !props.spots
  });

  const formatSpots = (spots) => {
    
    if (spots === 1) {
      return '1 spot remaining';
    }

    if (spots === 0) {
      return 'no spots remaining';
    }

    return `${spots} spots remaining`;
  };
  
  return (
    <li className={dayClass} onClick={props.setDay} selected={props.selected} data-testid="day">
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}