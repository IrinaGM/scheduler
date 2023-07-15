import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {
  const dayList = props.days.map((day) => {
    const isSelected = day.name === props.day;
    return (
      <DayListItem
        key={day.id}
        name={day.name}
        spots={day.spots}
        selected={isSelected}
        setDay={props.setDay}
      />
    );
  });

  return <ul>{dayList}</ul>;
}
