import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as BigCalendar,
  momentLocalizer,
  ToolbarProps,
} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';
import initialEvents from '../utils/events';
import AddEventModal from '../components/AddEventModal';

// --- Type Definitions ---
interface MyEvent {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

// --- Styled Components ---
const CalendarWrapper = styled.div`
  width: 100%;
  height: 85vh;
  padding: 20px;
  box-sizing: border-box;
`;

const CalendarContainer = styled.div`
  position: relative; /* Create a new stacking context */
  z-index: 1; /* Ensure it's below the modal */
  height: 90%; /* Maintain the height of the calendar */
`;

const StyledToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-family: Arial, sans-serif;

  .rbc-btn-group button {
    color: #37352f;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px 12px;
    cursor: pointer;
    margin: 0 2px;

    &:hover {
      background: #f5f5f5;
    }
  }

  .rbc-toolbar-label {
    font-size: 1.4em;
    font-weight: bold;
  }
`;

// --- Main Component ---
const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<MyEvent[]>(initialEvents);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSelectEvent = (event: MyEvent) => {
    navigate(`/detail/${event.title}`);
  };

  const handleSaveEvent = (title: string, date: string) => {
    const newEvent: MyEvent = {
      title,
      start: new Date(date),
      end: new Date(date),
      allDay: true,
    };
    setEvents([...events, newEvent]);
    setShowModal(false);
  };

  const CustomToolbar = (toolbar: ToolbarProps<MyEvent>) => (
    <StyledToolbar>
      <span className="rbc-btn-group">
        <button type="button" onClick={() => toolbar.onNavigate('TODAY')}>
          오늘
        </button>
        <button type="button" onClick={() => toolbar.onNavigate('PREV')}>
          {'<'}
        </button>
        <button type="button" onClick={() => toolbar.onNavigate('NEXT')}>
          {'>'}
        </button>
      </span>
      <span className="rbc-toolbar-label">
        {moment(toolbar.date).format('YYYY년 MM월')}
      </span>
      <span className="rbc-btn-group">
        <button type="button" onClick={() => setShowModal(true)}>
          +
        </button>
      </span>
    </StyledToolbar>
  );

  return (
    <CalendarWrapper>
      <h3>TYO/YOK – PUSAN : ETD MON , WED , FRI / 週３回</h3>
      <h3>TYO/YOK – INCHEON : ETD FRI / 週１回</h3>
      <CalendarContainer>
        <BigCalendar<MyEvent>
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          date={date}
          onNavigate={setDate}
          onSelectEvent={handleSelectEvent}
          components={{ toolbar: CustomToolbar }}
        />
      </CalendarContainer>
      <AddEventModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveEvent}
      />
    </CalendarWrapper>
  );
};

export default MyCalendar;
