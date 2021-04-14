import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MovableCardWrapper } from 'react-trello/dist/styles/Base';
import Tag from 'react-trello/dist/components/Card/Tag';
import moment from 'moment';

//https://github.com/rcdexta/react-trello/issues/18
const CustomCard = (props) => {
    const { onClick, cardStyle, className, id, title, label, start, end, tags, complete, progress } = props;
    let location = useLocation();
    let pathname = location.pathname;
    let searchParams = new URLSearchParams(location.search);
    searchParams.set('task_id', id);
    return (
            <MovableCardWrapper
                onClick={onClick}
                style={cardStyle}
                className={className}
            >
                <Link to={{ pathname: pathname, search: searchParams.toString() }} style={{ textDecoration: 'none', color: '#393939' }}>
                    <header
                        style={{
                            borderBottom: '1px solid #eee', paddingBottom: 6, marginBottom: 10,
                            display: 'flex', flexDirection: 'row', justifyContent: 'space-between'
                        }}>
                            <div style={{ fontSize: '1em', fontWeight: 'bold', color: '#393939' }}>
                                {title}
                            </div>
                    </header>
                    <div style={{ fontSize: '1em' }}>
                        {formattedDateTimes(start, end)}
                        <div style={{ marginTop: 10, textAlign: 'center', fontSize: '1em', fontWeight: 'bold' }}>
                                {label}
                            </div>
                        {tags && (
                            <div
                                style={{
                                    borderTop: '1px solid #eee', paddingTop: 6, display: 'flex',
                                    justifyContent: 'flex-end', flexDirection: 'row', flexWrap: 'wrap'
                                }}>
                                {isCompleted(complete, progress)}
                                {tags.map(tag => (
                                    <Tag key={tag.id} {...tag} />
                                ))}
                            </div>
                        )}
                    </div>
                </Link>
            </MovableCardWrapper>
    )
}
const formattedDateTimes = (start, end) => {
    if (start) start = moment(start).format('DD MMM YYYY');
    if (end) end = moment(end).format('DD MMM YYYY');
    if (start == end) return (<div style={{ color: '#4C4C4C' }}>{start}</div>);
    return (<div style={{ color: '#4C4C4C' }}>Start : {start}<br />End : {end}</div>)
}
const isCompleted = (complete, progress) => {
    if (progress >= 100 || complete) return (<Tag title={'Complete'} bgColor={'#009703'} />);
    return (<></>)
}
export default CustomCard;