import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as BigCalendar,
  momentLocalizer,
  ToolbarProps,
} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import AddShipModal from '../components/AddEventModal';
// import AddShipModal from '../components/AddShipModal'; // Will be used later

// --- Type Definitions ---
interface MyEvent {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  shipId: string; // Unique identifier for the ship
  date: string; // Date in 'YYYY-MM-DD' format
}

// --- Styled Components ---
const CalendarWrapper = styled.div`
  width: 100%;
  height: 85vh;
  padding: 20px;
  box-sizing: border-box;
`;

const CalendarContainer = styled.div`
  position: relative;
  z-index: 1;
  height: 90%;
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
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchEvents = useCallback(async (startDate: Date, endDate: Date) => {
    const start = moment(startDate).format('YYYY-MM-DD');
    const end = moment(endDate).format('YYYY-MM-DD');

    try {
      const q = query(
        collection(db, 'daily_ships'),
        where('__name__', '>=', start),
        where('__name__', '<=', end)
      );
      const querySnapshot = await getDocs(q);
      const newEvents: MyEvent[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const docId = doc.id;
        const eventDate = moment(docId, 'YYYY-MM-DD').toDate();

        if (data.shipIdentifiers && Array.isArray(data.shipIdentifiers)) {
          data.shipIdentifiers.forEach((shipId: string) => {
            newEvents.push({
              title: shipId, // Display shipId on the calendar
              shipId: shipId,
              start: eventDate,
              end: eventDate,
              allDay: true,
              date: docId,
            });
          });
        }
      });
      setEvents(newEvents);
    } catch (error) {
      console.error('Error fetching events: ', error);
    }
  }, []);

  useEffect(() => {
    const startOfMonth = moment(date).startOf('month').toDate();
    const endOfMonth = moment(date).endOf('month').toDate();
    fetchEvents(startOfMonth, endOfMonth);
  }, [date, fetchEvents]);

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleSelectEvent = (event: MyEvent) => {
    navigate(`/detail/${event.date}/${event.shipId}`);
  };

  // This function will be fully implemented in the next steps
  const handleSaveShip = async (shipData: any) => {
    console.log('Saving ship data:', shipData);
    // Logic to save new ship to Firestore will be added here
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
          onNavigate={handleNavigate}
          onSelectEvent={handleSelectEvent}
          components={{ toolbar: CustomToolbar }}
        />
      </CalendarContainer>
      <AddShipModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveShip}
      />
    </CalendarWrapper>
  );
};

export default MyCalendar;
