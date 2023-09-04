import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Paper, Typography } from '@mui/material';

const data1 = [
    { label: 'Group A', value: 400 },
    { label: 'Group B', value: 300 },
    { label: 'Group C', value: 300 },
    { label: 'Group D', value: 200 },
];

const data2 = [
    { label: 'A1', value: 100 },
    { label: 'A2', value: 300 },
    { label: 'B1', value: 100 },
    { label: 'B2', value: 80 },
    { label: 'B3', value: 40 },
    { label: 'B4', value: 30 },
    { label: 'B5', value: 50 },
    { label: 'C1', value: 100 },
    { label: 'C2', value: 200 },
    { label: 'D1', value: 150 },
    { label: 'D2', value: 50 },
];

export default function LastMonthExpenseWidget() {
    return (
        <Paper
            style={{
                padding: "1rem",
                margin: "1rem",
                alignItems: "center",
            }}
            elevation={1}
        >
            <Typography variant="h5" component="div" gutterBottom>
                Last Month Expense
            </Typography>
            <Box sx={{ height: 300, width: "100%", display: 'flex', flexDirection: 'row' }}>
                <PieChart
                    series={[
                        {
                            innerRadius: 0,
                            outerRadius: 80,
                            data: data1,
                        },
                        {
                            innerRadius: 100,
                            outerRadius: 120,
                            data: data2,
                        }
                    ]}
                    width={340}
                    height={300}
                    legend={{ hidden: true }}
                    title='Last Month Expense'
                />
                <PieChart
                    series={[
                        {
                            innerRadius: 0,
                            outerRadius: 80,
                            data: data1,
                        },
                        {
                            innerRadius: 100,
                            outerRadius: 120,
                            data: data2,
                        }
                    ]}
                    width={340}
                    height={300}
                    legend={{ hidden: true }}
                    title='Last Month Expense'
                />

            </Box>
        </Paper>
    );
}
