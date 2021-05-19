import React, { useState, useEffect, createRef} from 'react';
import Fullcalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

const Calendar = (props) => {
    var calendarRef = createRef();
    const handleDetailMeetingOpen = props.handleDetailMeetingOpen;
    const [events, setEvents] = useState([]);

    useEffect(() => {
        if ('meetings' in props.detailProject) setEvents(props.detailProject.meetings); 
        else setEvents([]);
    }, [props.detailProject]);

    const handleEventClick = (eventInfo) => {
        var event = eventInfo.event._def;
        handleDetailMeetingOpen({ meeting:{id:event.publicId,...event.extendedProps}, open: true });
    }

    const handleDateClick = (dateInfo) =>  calendarRef.current.getApi().changeView('timeGridDay', dateInfo.date); 

    return (
        <>
            <Fullcalendar
                selectable={true}
                events={events}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                eventTimeFormat={{ hour: 'numeric', minute: '2-digit', hour12: false }}
                ref={calendarRef}
                initialView='dayGridMonth'
                plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin]}
                headerToolbar={{
                    left: 'title,prev,today,next',
                    center: '',
                    right: 'listMonth,dayGridMonth,timeGridWeek,timeGridDay'
                }}
            />
        </>
    );
}
export default Calendar;