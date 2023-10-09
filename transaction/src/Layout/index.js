import Grid from '@mui/material/Grid';
import { Paper } from '@mui/material';

import TransactionForm from '../components/forms/AddTransaction';
import TransactionList from '../components/lists/AllTransaction';
import LastMonthExpenseWidget from '../components/analysis/expense';

const TransactionMainLayout = () => {
    return (
        <Paper sx={{ display: 'flex', flexDirection: 'column', margin: '1rem 0' }} elevation={1}>
    <Grid container>
        <Grid item xs={12} md={6}>
            <LastMonthExpenseWidget />
        </Grid>
        <Grid item xs={12} md={6}>
            <TransactionForm />
        </Grid>
        <Grid item xs={12}>
            <TransactionList />
        </Grid>
    </Grid>
</Paper>
)};

export default TransactionMainLayout;