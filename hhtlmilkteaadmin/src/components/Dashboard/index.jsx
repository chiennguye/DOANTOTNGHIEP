import { Grid, makeStyles, Paper } from "@material-ui/core"
import Chart from "./Chart"
import Orders from "./Order"
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    appBarSpacer: theme.mixins.toolbar,
    fixedHeight: {
        height: 280,
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
}));

const Dashboard = () => {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    
    return (
        <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12}>
                <Paper className={fixedHeightPaper}>
                    <Chart />
                </Paper>
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <Orders />
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Dashboard