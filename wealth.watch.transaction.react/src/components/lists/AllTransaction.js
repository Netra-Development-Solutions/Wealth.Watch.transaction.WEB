import { Paper, Typography } from "@mui/material";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { darken, lighten, styled } from "@mui/material/styles";
import { get } from "../../utils/apiHelper";
import { useTheme } from "@mui/material/styles";

const generateColumns = (bankAccounts, creditCards) => {
    const columns = [
        {
            field: "transactionDate",
            headerName: "Transaction Date",
            minWidth: 170,
            align: "center",
            valueFormatter: (value) => new Date(value?.value).toLocaleDateString(),
        },
        {
            field: "transactionAmount",
            headerName: "Transaction Amount",
            minWidth: 170,
            align: "right",
        },
        {
            field: "transactionDescription",
            headerName: "Transaction Description",
            minWidth: 170,
        },
        {
            field: "isCashTransaction",
            headerName: "Is Cash Transaction",
            minWidth: 170,
        },
        { field: "transactionType", headerName: "Transaction Type", minWidth: 170 },
        {
            field: "bankAccountId", headerName: "Bank Account", minWidth: 170,
            valueFormatter: (value) => {
                const bankAccount = bankAccounts?.find((bankAccount) => bankAccount._id === value?.value);
                return bankAccount?.accountName || value?.value;
            }
        },
        {
            field: "creditCardId", headerName: "Credit Card Id", minWidth: 170,
            valueFormatter: (value) => {
                const creditCard = creditCards?.find((creditCard) => creditCard._id === value?.value);
                return creditCard?.cardName || value?.value;
            }
        },
        {
            field: "createdAt",
            headerName: "Created At",
            minWidth: 170,
            align: "center",
            valueFormatter: (value) => new Date(value?.value).toLocaleString(),
        },
    ];

    return columns;
}

const StyledTransactionGrid = styled(DataGrid)(({ theme }) => ({
    "& .super-app-theme--CREDIT--dark": {
        backgroundColor: darken(theme.palette.success.main, 0.85),
        color: theme.palette.success.light,
        "&:hover": {
            backgroundColor: darken(theme.palette.success.main, 0.75),
        },
        "& .MuiDataGrid-cell--textLeft": {
            color: theme.palette.success.light,
        },
    },
    "& .super-app-theme--DEBIT--dark": {
        backgroundColor: darken(theme.palette.error.main, 0.85),
        color: theme.palette.error.light,
        "&:hover": {
            backgroundColor: darken(theme.palette.error.main, 0.75),
        },
        "& .MuiDataGrid-cell--textLeft": {
            color: theme.palette.error.light,
        },
    },
    "& .super-app-theme--CREDIT--light": {
        backgroundColor: lighten(theme.palette.success.main, 0.85),
        color: theme.palette.success.dark,
        "&:hover": {
            backgroundColor: lighten(theme.palette.success.main, 0.75),
        },
        "& .MuiDataGrid-cell--textLeft": {
            color: theme.palette.success.dark,
        },
    },
    "& .super-app-theme--DEBIT--light": {
        backgroundColor: lighten(theme.palette.error.main, 0.85),
        color: theme.palette.error.dark,
        "&:hover": {
            backgroundColor: lighten(theme.palette.error.main, 0.75),
        },
        "& .MuiDataGrid-cell--textLeft": {
            color: theme.palette.error.dark,
        },
    },
}));

const TransactionList = () => {
    const [bankAccounts, setBankAccounts] = React.useState([]);
    const [creditCards, setCreditCards] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [paginationModel, setPaginationModel] = React.useState({page: 0, pageSize: 25});
    const [refresh, setRefresh] = React.useState(true);
    const [rowCountState, setRowCountState] = React.useState(0);
    const [rows, setRows] = React.useState([]);
    const applicationTheme = useTheme();

    React.useEffect(() => {
        const token =
            "b8b3ca333b62f6969cd2f85e4d194faf83020892bca77db75cd959b23608693d6b0650ac12389550b7fd819d45a8d363827aa54e8b3863a0975bd785233fe1e53032cfa2635e4fc526b0764d2c126d33a7ed9500ae5345fcd98df2bb5b0d778ac9f55105552d9b1b5e556aedc9c5bcf5a95e862ecdfa565d99cd5323199d253a7b73ea53d1f1530adfab14acf2318565d068eca6be2a8ca0cc7c1c18db11c36c8d05a0874ee657c2c2ca2fe4b4524cf530caf65e22512d0c2c8cf243cb4f96b3fce1c290ca6f72bd47a837d5afa25f58ba2279ec74d8f9030f.a615339ad974083adbc57534e2b6086";

        if (refresh) {
            get(`http://localhost:4000/TRANSACTION/?page=${paginationModel.page+1}&limit=${paginationModel.pageSize}`, `Bearer ${token}`)
                .then((response) => {
                    setRows(response?.data?.data?.transactions);
                    const { page, limit, total } = response?.data?.data?.pageDetails;
                    setPaginationModel({
                        page: page-1,
                        pageSize: limit,
                        rowCount: total,
                        pageCount: Math.ceil(total / limit),
                    });
                    setRowCountState(total);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                });
            get("http://localhost:4000/BANK/get-all-accounts", `Bearer ${token}`)
                .then((response) => {
                    setBankAccounts(response?.data?.data);
                })
                .catch((error) => {
                    console.log(error);
                });
            get("http://localhost:4000/CREDITCARD/get-all-accounts", `Bearer ${token}`)
                .then((response) => {
                    setCreditCards(response?.data?.data);
                })
                .catch((error) => {
                    console.log(error);
                });

            setRefresh(false);
        }
    }, [refresh, paginationModel.page, paginationModel.pageSize]);

    return (
        <Paper
            style={{
                padding: "1rem",
                margin: "1rem",
            }}
            elevation={1}
        >
            <Typography variant="h4" mb={2}>Transaction List</Typography>
            {rows.length === 0 && (
                <Typography variant="body1">No transactions found</Typography>
            )}
            <StyledTransactionGrid
                columns={generateColumns(bankAccounts, creditCards)}
                getRowClassName={(params) => `super-app-theme--${params.row?.transactionType}--${applicationTheme?.palette?.mode || "dark"}`}
                getRowId={(row) => row?._id}
                loading={isLoading}
                onPaginationModelChange={(a, b) => {
                    setRefresh(true);
                    setIsLoading(true);
                    setPaginationModel(a, b);
                }}
                paginationMode="server"
                // paginationModel={paginationModel}
                rowCount={rowCountState}
                rows={rows}
                pageSizeOptions={[5 ,25, 50, 100]}
                initialState={{
                    // ...data.initialState,
                    pagination: { paginationModel },
                }}
            />
        </Paper>
    );
};

export default TransactionList;
