import React, { useState, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import WorkIcon from '@material-ui/icons/Work';
import SchoolIcon from '@material-ui/icons/School';
import StarIcon from '@material-ui/icons/Star';
import moment from 'moment';
import Chip from '@material-ui/core/Chip';
import { Grid } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    paper: { padding: '6px 16px' },
    secondaryTail: { backgroundColor: theme.palette.secondary.main },
}));

const EventTimeline = (props) => {
    let location = useLocation();
    const detailProject = props.detailProject;
    const [events, setEvents] = useState([]);
    const handleDetailTaskOpen = props.handleDetailTaskOpen;
    const classes = useStyles();

    const onEventClick = (projectId, listId, taskId) => handleDetailTaskOpen({ projectId, listId, taskId, open: true })

    const getEventsFromLists = useCallback(() => {
        var events = []
        if ('columns' in detailProject) {
            detailProject.columns.forEach(column => {
                if ('cards' in column) {
                    column.cards.forEach(card => {
                        if(card.start && card.end) events.push(card);
                    });
                }
            });
        }
        return events;
    }, [detailProject]);

    useEffect(() => {
        setEvents(getEventsFromLists());
    }, [detailProject]);

    const getDeadline = (start, end) => {
        const start_datetime = moment(start).format('Do MMMM YYYY');
        const end_datetime = moment(end).format('Do MMMM YYYY');
        return `${start_datetime} - ${end_datetime}`
    }
    return (
        <Timeline align="alternate">
            {events.map(
                (event) => {     
                    let pathname = location.pathname;
                    let searchParams = new URLSearchParams(location.search);
                    searchParams.set('task_id', event.id);
                    return (
                            <TimelineItem
                                key={event.id}
                                onClick={() => {
                                    onEventClick(detailProject.id, event.list, event.id)
                                }}
                                >
                                <TimelineOppositeContent>
                                    <Typography variant="body2" color="textSecondary">{`${getDeadline(event.start, event.end)}`}</Typography>
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot/>
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>
                                    <Paper elevation={3} className={classes.paper}>
                                        <Grid>
                                            <Link to={{ pathname: pathname, search: searchParams.toString() }} style={{textDecoration:'none',color:''}}> 
                                                <Typography variant="body1">{event.title}</Typography>
                                            </Link>
                                        </Grid>
                                        <Grid>
                                            {
                                                event.tags.map(tag => {
                                                    return (<Chip key={tag.id} label={tag.title} variant="outlined" />)
                                                })
                                            }
                                        </Grid>
                                    </Paper>
                                </TimelineContent>
                            </TimelineItem>
                    )
                }
            )}
        </Timeline>
    )
};

export default EventTimeline;
