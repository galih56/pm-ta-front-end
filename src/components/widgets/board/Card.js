import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MovableCardWrapper } from 'react-trello/dist/styles/Base';
import Tag from 'react-trello/dist/components/Card/Tag';
import moment from 'moment';
import ModalDetailTask from './../../tasks/modalDetailTask/ModalDetailTask';
import StatusChip from './../StatusChip';

//https://github.com/rcdexta/react-trello/issues/18
const CustomCard = (props) => {
    const { 
        onClick, cardStyle, className, onDelete, 
        id, title, label, start, end,
        actualStart,actualEnd,startLabel,endLabel,
        tags, complete, progress 
    } = props;
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
                            {formattedDateTimes(start, end,actualStart,actualEnd,startLabel,endLabel)}
                            <div style={{ marginTop: 5, textAlign: 'center', fontSize: '1em', fontWeight: 'bold' }}>
                               {(startLabel=='Belum dikerjakan' && endLabel=='Belum dikerjakan')?(
                                <span style={{margin:'0.2em'}}>
                                    <StatusChip status={startLabel}/>
                                </span>
                               ):<></>}
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
const formattedDateTimes = (start, end,) => {
    if (start) start = moment(start).format('DD MMM YYYY');
    if (end) end = moment(end).format('DD MMM YYYY');
    return (
        <div style={{ color: '#4C4C4C' }}>
            Start : {start} <br />
            End : {end}
        </div>
    )
}
const isCompleted = (complete, progress) => {
    if (progress >= 100 || complete) return (<Tag title={'Complete'} bgColor={'#009703'} />);
    return (<></>)
}
export default CustomCard;