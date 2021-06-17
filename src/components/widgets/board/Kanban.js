import React, { useContext, useEffect, memo, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Board from 'react-trello';
import { createTranslate } from 'react-trello';
import UserContext from '../../../context/UserContext';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import CustomCard from './Card';
import EditLaneForm from './EditLaneForm';
import 'fontsource-roboto';
import moment from 'moment';


const Kanban = (props) => {
    const global = useContext(UserContext);
    const [board, setBoard] = useState({ lanes: [] });
    const {detailProject,refreshDetailProject,handleDetailTaskOpen} = props;
    const { enqueueSnackbar } = useSnackbar();
    const handleSnackbar = useCallback((message, variant) => enqueueSnackbar(message, { variant }));
    const history = useHistory();

    useEffect(() => {
        if (detailProject) setBoard({ lanes: detailProject.columns });
    }, [props.detailProject]);

    const TEXTS = {
        "Add another lane": "NEW LANE",
        "Click to add card": "Edit lane or add new card",
        "Delete lane": "Delete lane",
        "button": { "Add lane": "Add lane", "Add card": "ADD CARD", "Cancel": "Cancel" },
        "placeholder": { "title": "Title", "description": "Description", "label": "Label" }
    }

    const onCardNew = (newCard, laneId) => {
        newCard.id = Date.now();
        newCard.listId = laneId;
        newCard.userId = global.state.id;
        newCard.projectId = detailProject.id;
        newCard.creator=global.state.id;
        
        for (let i = 0; i < detailProject.members.length; i++) {
            const member = detailProject.members[i];
            if(member.id==global.state.id) newCard.projectMemberId=member.id; break;
        }

        if (window.navigator.onLine) {
            const config = { mode: 'no-cors', crossdomain: true }
            const url = process.env.REACT_APP_BACK_END_BASE_URL + 'task/';
            
            axios.defaults.headers.common['Authorization'] = global.state.token;
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.post(url, newCard, config)
                .then((result) => {
                    newCard.id = result.data.id;
                    newCard.projectId = detailProject.id;
                    newCard.listId = laneId;
                    global.dispatch({ type: 'create-new-task', payload: newCard })
                    handleSnackbar(`A new card successfuly created`, 'success');
                    refreshDetailProject()
                }).catch(error => {
                    const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: history }
                    global.dispatch({ type: 'handle-fetch-error', payload: payload });
                });
        } else {
            handleSnackbar(`You're currently offline. Please check your internet connection`, 'warning');
            global.dispatch({ type: 'create-new-task', payload: newCard });
        }
        return newCard;
    }

    const onLaneRename = (laneId, data) => {
        data.projectId = detailProject.id;
        data.listId = laneId;
        if (window.navigator.onLine) {
            const config = { mode: 'no-cors', crossdomain: true }
            const url = process.env.REACT_APP_BACK_END_BASE_URL + 'list/' + laneId;
            try {
                axios.defaults.headers.common['Authorization'] = global.state.token;
                axios.defaults.headers.post['Content-Type'] = 'application/json';
                axios.patch(url, data, config)
                    .then((result) => {
                        global.dispatch({ type: 'update-list', payload: data })
                        handleSnackbar(`Data has been updated successfuly`, 'success');
                    }).catch((error) => {
                        error = { ...error };
                        const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: history }
                        global.dispatch({ type: 'handle-fetch-error', payload: payload });
                    });
            }
            catch (error) { handleSnackbar(`Error : ${error}`, 'danger'); }
        } else {
            // global.dispatch({ type: 'create-new-task', payload: newCard });
            handleSnackbar(`You're currently offline. Please check your internet connection`, 'warning');
        }
    }
    const onCardMove = (fromLaneId, toLaneId, cardId, index) => {
        const body = {
            id: cardId,
            listId: toLaneId
        }
        if (window.navigator.onLine) {
            const config = { mode: 'no-cors', crossdomain: true }
            const url = process.env.REACT_APP_BACK_END_BASE_URL + 'task/' + cardId;
            try {
                axios.defaults.headers.common['Authorization'] = global.state.token;
                axios.defaults.headers.post['Content-Type'] = 'application/json';
                axios.patch(url, body, config)
                    .then((result) => {
                        if (result.status == 200) {
                            global.dispatch({ type: 'move-card', payload: result.data })
                            handleSnackbar(`A card has been moved`, 'success');
                        }
                        else handleSnackbar(`Error : ${result.status}`, 'danger');
                    }).catch((error) => {
                        error = { ...error };
                        const payload = { error: error, snackbar: handleSnackbar, dispatch: global.dispatch, history: history };
                        global.dispatch({ type: 'handle-fetch-error', payload: payload });
                    });
            }
            catch (error) { handleSnackbar(`Error : ${error}`, 'danger'); }
        } else {
            // global.dispatch({ type: 'create-new-task', payload: newCard });
            handleSnackbar(`You're currently offline. Please check your internet connection`, 'warning');
        }
    }
    const onCardClick = (cardId, metadata,laneId) =>{ 
        handleDetailTaskOpen({ projectId: detailProject.id, listId: laneId, taskId: cardId, open: true,onCardDelete:onCardDelete});
    }
    const EditLaneFormWithDetailProject=(props)=>{
        return (<EditLaneForm detailProject={{id:detailProject.id,members:detailProject.members}} {...props}/>)
    }
   
    const [eventBus, setEventBus] = useState(undefined);

    const onCardDelete=(listId,taskId)=>{
        console.log(listId,taskId)
        eventBus.publish({type: 'REMOVE_CARD', laneId: listId, cardId: taskId});
    }
    return (
        <React.Fragment>
            <Board
                t={createTranslate(TEXTS)}
                data={board}
                editable={true}
                // draggable={true}
                // laneDraggable={true}
                collapsibleLanes={true}
                onLaneUpdate={onLaneRename}
                onCardAdd={onCardNew}
                onCardClick={onCardClick}
                components={{ Card: CustomCard, NewCardForm: EditLaneFormWithDetailProject }}
                onCardMoveAcrossLanes={onCardMove}
                detailProject={detailProject}
                eventBusHandle={setEventBus}
            >
            </Board>
        </React.Fragment>
    )

}


export default memo(Kanban);