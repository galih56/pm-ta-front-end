import React, { memo } from 'react';
import { Box, Typography } from '@material-ui/core/';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';

const BorderLinearProgress = withStyles((theme) => ({
    root: { height: 10, borderRadius: 5 },
    colorPrimary: { backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700] },
    bar: { borderRadius: 5, backgroundColor: '#1a90ff' },
}))(LinearProgress);

const isNumber = (value) => (typeof value === 'number') && value === Number(value) && Number.isFinite(value);

const TaskProgress = ({ value }) => {
    value = parseInt(value);
    if (!isNumber(value)) {
        value = 0;
    }
    return (
        <Box display="flex">
            <Box width="100%" mr={1}>
                <BorderLinearProgress variant="determinate" value={value} />
            </Box>
            <Box>
                <Typography variant="body2" color="textSecondary">{`${value}%`}</Typography>
            </Box>
        </Box>
    );
}
export default memo(TaskProgress);