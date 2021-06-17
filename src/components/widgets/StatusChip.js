import React from 'react'
import Chip from "@material-ui/core/Chip";
import DoneIcon from "@material-ui/icons/Done";
import { green, blue, grey, red } from "@material-ui/core/colors";

function colorForStatus(status) {
    status=status.toLowerCase()
    if(status=='mulai lebih cepat' || status=='selesai lebih cepat'){
        return green;
    }
    if(status=='sedang dilakukan'||status=='mulai tepat waktu'||status=='selesai tepat waktu'){   
        return blue;
    }
    if(status=='mulai terlambat' || status=='selesai terlambat') return red;
    if(status=='belum dilaksanakan' || status=='belum selesai') return grey;
    return grey;
}

function StatusChip({ status }) {
    return (
      <Chip
        label={status}
        avatar={(
            status.toLowerCase() === "mulai tepat waktu" || 
            status.toLowerCase() === "selesai tepat waktu" ) && <DoneIcon style={{ color: "white" }} />}
        style={{ backgroundColor: colorForStatus(status)[600], color: "white" }}
      />
    );
  }

export default StatusChip;