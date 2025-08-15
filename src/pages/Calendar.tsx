import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar as BigCalendar,
  momentLocalizer,
  ToolbarProps,
} from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ja';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import AddShipModal, { ShipData } from '../components/AddEventModal';
import { AppUser } from '../App'; // Import AppUser type

// --- Type Definitions ---
interface MyEvent {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  shipId: string; // Unique identifier for the ship
  date: string; // Date in 'YYYY-MM-DD' format
}

interface MyCalendarProps {
  user: AppUser | null; // Prop to receive user info
}

// --- Styled Components ---
const CalendarWrapper = styled.div`
  width: 100%;
  height: 85vh; /* Adjust height to fill remaining space */
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

    &:disabled {
      background: #f0f0f0;
      color: #aaa;
      cursor: not-allowed;
    }
  }

  .rbc-toolbar-label {
    font-size: 1.4em;
    font-weight: bold;
  }
`;

moment.locale('ja'); // Set locale to Japanese
const localizer = momentLocalizer(moment);

// --- Main Component ---
const MyCalendar: React.FC<MyCalendarProps> = ({ user }) => {
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

  const handleSaveShip = async (data: ShipData) => {
    const { title, date, carrierLine, voy, etd, eta } = data;
    const dailyShipDocRef = doc(db, 'daily_ships', date);
    const shipDocRef = doc(dailyShipDocRef, 'ships', title);

    try {
      // 1. Update shipIdentifiers array in the daily_ships document
      const dailyShipDocSnap = await getDoc(dailyShipDocRef);

      if (dailyShipDocSnap.exists()) {
        await updateDoc(dailyShipDocRef, {
          shipIdentifiers: arrayUnion(title),
        });
      } else {
        await setDoc(dailyShipDocRef, {
          shipIdentifiers: [title],
        });
      }

      // 2. Create/Update ship document in the 'ships' subcollection
      const shipDataForDb = {
        CARRIER_LINE: carrierLine,
        VOY: voy,
        ETD: etd,
        ETA: eta,
        KGS: '',
        CBM: '',
        TOTAL_PKG: '',
      };
      await setDoc(shipDocRef, shipDataForDb, { merge: true });

      // Refresh events after saving
      const startOfMonth = moment(date).startOf('month').toDate();
      const endOfMonth = moment(date).endOf('month').toDate();
      fetchEvents(startOfMonth, endOfMonth);
      setShowModal(false);
    } catch (error) {
      console.error('Error saving ship:', error);
    }
  };

  const CustomToolbar = (toolbar: ToolbarProps<MyEvent>) => {
    const canAddShip = user?.role === 'admin' || user?.role === 'operator';

    return (
      <StyledToolbar>
        <span className="rbc-btn-group">
          <button type="button" onClick={() => toolbar.onNavigate('TODAY')}>
            今日
          </button>
          <button type="button" onClick={() => toolbar.onNavigate('PREV')}>
            {'<'}
          </button>
          <button type="button" onClick={() => toolbar.onNavigate('NEXT')}>
            {' >'}
          </button>
        </span>
        <span className="rbc-toolbar-label">
          {moment(toolbar.date).format('YYYY年 MM月')}
        </span>
        <span className="rbc-btn-group">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            disabled={!canAddShip}
          >
            +
          </button>
        </span>
      </StyledToolbar>
    );
  };

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
