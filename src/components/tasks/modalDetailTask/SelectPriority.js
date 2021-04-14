
const SelectPriority = () => {
    const [priority, setPriority] = React.useState('');

    const handleChange = (event) => {
        setPriority(event.target.value);
    };

    const useStyles = makeStyles((theme) => ({
        formControl: {
            margin: theme.spacing(2),
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }));

    const classes = useStyles();
    return (

        <FormControl className={classes.formControl} style={{ marginLeft: 0, marginRight: 0 }}>
            <InputLabel shrink id="select-priority">Priority</InputLabel>
            <Select
                labelId="select-priority"
                id="demo-simple-select-placeholder-label"
                value={priority}
                onChange={handleChange}
                displayEmpty
                className={classes.selectEmpty}
            >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                <MenuItem value={5}>Very High</MenuItem>
                <MenuItem value={4}>High</MenuItem>
                <MenuItem value={3}>Medium</MenuItem>
                <MenuItem value={2}>Low</MenuItem>
                <MenuItem value={1}>Very Low</MenuItem>
            </Select>
        </FormControl>
    )
}