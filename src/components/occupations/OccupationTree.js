import React, { useState, useEffect } from 'react';
import OrganizationChart from "@dabeng/react-orgchart";
import "core-js/stable";
import "regenerator-runtime/runtime";

const DefaultChart = (props) => {
    const [data, setData] = useState(null);
    const handleModalOpen = props.modalOpen;

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    useEffect(() => {
        var orgChartElm = document.getElementsByClassName('orgchart-container');
        if (orgChartElm.length > 0) orgChartElm[0].style.height = 'auto';
    })
    return (
        <>
            { data ? <OrganizationChart datasource={data} onClickNode={(node) => {
                handleModalOpen({ occupation: node, open: true })
            }} style={{ height: 'auto' }} /> : <></>}
        </>
    );
};
export default DefaultChart;
