import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../context/UserContext';
import ModalCreateOccupation from './ModalCreateOccupation';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/Button';
import ModalDetailOccupation from './ModalDetailOccupation/ModalDetailOccupation';

const OccupationTree = React.lazy(() => import("./OccupationTree"));
const OccupationTable = React.lazy(() => import("./OccupationTable"));

export default function OccupationInformation() {
    const [data, setData] = useState([]);
    const [tree, setTree] = useState(null);
    let global = useContext(UserContext);
    const [clickedOccupation, setClickedOccupation] = useState({ 
        id: null, name: '', color: '', bgColor: '', parents: [], 
        children: [], root: false, isHighlight: false });
    const [modalDetailOpen, setModalDetailOpen] = useState(false);
    const [modalCreateOpen, setModalCreateOpen] = useState(false);

    const handleModalOpen = (data) => {
        const { occupation, open } = data;
        setModalDetailOpen(open);
        setClickedOccupation(occupation);
    }

    const getOccupations = () => {
        const config = { mode: 'no-cors', crossdomain: true, }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + 'occupation';
        axios.defaults.headers.common['Authorization'] = global.state.token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.get(url, {}, config)
            .then((result) => {
                setData(result.data)
            }).catch((error) => {
                const payload = { error: error, snackbar: null, dispatch: global.dispatch, history: null }
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
            });
    }

    const getOccupationTree = () => {
        const config = { mode: 'no-cors', crossdomain: true, }
        const url = process.env.REACT_APP_BACK_END_BASE_URL + 'occupation/tree';
        axios.defaults.headers.common['Authorization'] = global.state.token;
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.get(url, {}, config)
            .then((result) => {
                setTree(result.data)
            }).catch((error) => {
                const payload = { error: error, snackbar: null, dispatch: global.dispatch, history: null }
                global.dispatch({ type: 'handle-fetch-error', payload: payload });
            });
    }

    useEffect(() => {
        getOccupations();
        getOccupationTree();
    }, []);

    function handleOccupationUpdate(value) {
        var newData = data.map((row => {
            if (row.id === value.id) { return value; }
            return row
        }))
        setData(newData);
    }

    function handleOccupationDelete(value) {
        setData(data.filter((row => {
            if (row.id != value.id) return row;
        })));
    }

    const showModalDetailOccupation = () => {
        if (clickedOccupation.id !== null && clickedOccupation.id !== undefined && modalDetailOpen === true) {
            return (
                <ModalDetailOccupation
                    open={modalDetailOpen}
                    initialState={clickedOccupation}
                    closeModal={() =>handleModalOpen({ occupation: { id: null, name: '', color: '', bgColor: '', parents: [], children: [], root: false, isHighlight: false }, open: false })}
                    onUpdate={handleOccupationUpdate}
                    onDelete={handleOccupationDelete}
                />
            )
        }
    }

    return (
        <>
            <React.Suspense fallback={<LinearProgress />}>
                <OccupationTree data={tree} modalOpen={handleModalOpen} />
                <Button variant="contained" onClick={() => setModalCreateOpen(true)}>+ Add</Button>
                <OccupationTable data={data} onUpdate={handleOccupationUpdate} onDelete={handleOccupationDelete} modalOpen={handleModalOpen} />
                <ModalCreateOccupation
                    open={modalCreateOpen}
                    closeModal={() =>  setModalCreateOpen(false)}
                    onCreate={setData}
                />
                {showModalDetailOccupation()}
            </React.Suspense>
        </>
    )
}