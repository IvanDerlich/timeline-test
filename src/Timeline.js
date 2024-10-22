// Timeline.js
import React from "react";
import timelineItems from "./timelineItems";
import "./Timeline.css";

const Timeline = () => {
  const parseDate = (dateString) => new Date(dateString);

  const events = timelineItems.map((item) => ({
    ...item,
    startDate: parseDate(item.start),
    endDate: parseDate(item.end),
  }));
  console.log("events: ", events);

  // Find earliest and latest dates correctly
  const earliestDate = Math.min(
    ...events.map((event) => event.startDate.getTime())
  );

  const latestDate = Math.max(
    ...events.map((event) => event.endDate.getTime())
  );

  console.log("earliestDate: ", new Date(earliestDate).toLocaleDateString());
  console.log("latestDate: ", new Date(latestDate).toLocaleDateString());

  const timeMarkers = [];
  const currentDate = new Date(earliestDate);
  while (currentDate.getTime() <= latestDate) {
    timeMarkers.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 7); // Increment by 1 week
  }

  const labelMarkers = [];
  const labelDate = new Date(earliestDate);
  while (labelDate.getTime() <= latestDate) {
    labelMarkers.push(new Date(labelDate));
    labelDate.setMonth(labelDate.getMonth() + 6); // Increment by 6 months
  }

  events.sort((a, b) => a.startDate - b.startDate);

  const lanes = [];
  events.forEach((event) => {
    let placed = false;
    for (let lane of lanes) {
      if (lane[lane.length - 1].endDate < event.startDate) {
        lane.push(event);
        placed = true;
        break;
      }
    }
    if (!placed) {
      lanes.push([event]);
    }
  });

  const sortedEvents = [...events].sort((a, b) => a.id - b.id);

  return (
    <div className="app-container">
      {/* Ruler with 6-month intervals */}
      <div className="timeline-wrapper">
        <div className="date-scale">
          {timeMarkers.map((date, index) => (
            <div
              key={index}
              className="date-marker"
              style={{
                left: `${
                  ((date.getTime() - earliestDate) /
                    (latestDate - earliestDate)) *
                  100
                }%`,
              }}
            >
              <div className="date-label">{date.toLocaleDateString()}</div>
            </div>
          ))}
        </div>

        <div className="timeline">
          {lanes.map((lane, laneIndex) => (
            <div className="lane" key={laneIndex}>
              {lane.map((event) => (
                <div
                  key={event.id}
                  className="event"
                  style={{
                    left: `${
                      ((event.startDate.getTime() - earliestDate) /
                        (latestDate - earliestDate)) *
                      100
                    }%`,
                    width: `${
                      ((event.endDate.getTime() - event.startDate.getTime()) /
                        (latestDate - earliestDate)) *
                      100
                    }%`,
                  }}
                >
                  <span className="event-number">{event.id}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Reference section for events */}
      <div className="timeline-references">
        <h3>Event Details</h3>
        <ul>
          {sortedEvents.map((event) => (
            <li key={event.id}>
              <strong>Event {event.id}:</strong> {event.name}, from{" "}
              {event.start} to {event.end}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Timeline;
