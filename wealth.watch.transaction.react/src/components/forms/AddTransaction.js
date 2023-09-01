import * as React from "react";
import * as yup from 'yup';
import { InputAdornment, Paper, Typography } from "@mui/material";
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { get, post } from "../../utils/apiHelper";
import { useSnackbar } from "notistack";

export default function TransactionForm({ transaction }) {
    const [bankAccounts, setBankAccounts] = React.useState([]);
    const [creditCards, setCreditCards] = React.useState([]);
    var token;
    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        var userDetails = localStorage.getItem("userauthdetails") ? JSON.parse(localStorage.getItem("userauthdetails")) : null;

        token = userDetails?.token;

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

    }, []);

    // paymentModeId: is either bankAccountId or creditCardId
    const yupValidationSchema = yup.object({
        description: yup.string(),
        paymentMode: yup.string().required('Payment Mode is required'),
        paymentModeId: yup.string(),
        transactionAmount: yup.number().required('Transaction Amount is required'),
        transactionDate: yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, 'Transaction Date is required'),
        transactionType: yup.string().required('Transaction Type is required'),
    });

    const formik = useFormik({
        initialValues: {
            description: transaction?.description || '',
            paymentMode: transaction?.paymentMode || '',
            paymentModeId: transaction?.paymentModeId || '',
            transactionAmount: transaction?.transactionAmount || 0,
            transactionDate: transaction?.transactionDate || `${(new Date()).getFullYear()}-${`0${(new Date()).getMonth()}`.slice(0,2)}-${(new Date()).getDate()}`,
            transactionType: transaction?.transactionType || 'CREDIT',
        },
        validationSchema: yupValidationSchema,
        onSubmit: (values, actions) => {
            var userDetails = localStorage.getItem("userauthdetails") ? JSON.parse(localStorage.getItem("userauthdetails")) : null;

            token = userDetails?.token;

            if (values.paymentMode === "Cash") {
                values.isCashTransaction = true;
            } else {
                if (values.paymentMode === "Bank") {
                    values.bankAccountId = values.paymentModeId;
                } else {
                    values.creditCardId = values.paymentModeId;
                }
                values.isCashTransaction = false;
            }

            console.log(values);
            post("http://localhost:4000/TRANSACTION/new", `Bearer ${token}`, values)
            .then((response) => {
                enqueueSnackbar('Transaction Added Successfully', { variant: 'success', autoHideDuration: 3000 });
                actions.setSubmitting(false);
                actions.resetForm();
            })
            .catch((error) => {
                console.log(error);
                enqueueSnackbar('Error in adding transaction', { variant: 'error', autoHideDuration: 3000 });
                actions.setSubmitting(false);
            });
        }
    });

    const { handleSubmit, handleChange, values, errors, touched, isSubmitting, setFieldValue } = formik;

    return (
        <Paper style={{
            padding: '1rem',
            margin: '1rem',
        }} elevation={2}>
            <form onSubmit={handleSubmit}>
                <Typography
                    variant="h5"
                    gutterBottom
                    style={{
                        textAlign: 'center',
                    }}>
                    Add Transaction
                </Typography>
                <Typography
                    variant="body2"
                    gutterBottom
                    color={errors.accountNumber ? 'error' : 'textSecondary'}
                    style={{
                        textAlign: 'center',
                    }}>
                    Add your transaction details
                </Typography>
                <Grid container spacing={2} mt={1}>
                    <Grid item xs={12}>
                        <ToggleButtonGroup
                            color="primary"
                            value={values.transactionType}
                            exclusive
                            onChange={(e, value) => {
                                setFieldValue('transactionType', value);
                            }}
                            fullWidth
                            aria-label="transactionType"
                            name="transactionType"
                        >
                            <ToggleButton value="CREDIT">CREDIT | ADD</ToggleButton>
                            <ToggleButton value="DEBIT">DEBIT | REMOVE</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="transactionAmount"
                            name="transactionAmount"
                            label="Transaction Amount"
                            type="number"
                            value={values.transactionAmount}
                            onChange={handleChange}
                            error={touched.transactionAmount && Boolean(errors.transactionAmount)}
                            helperText={touched.transactionAmount && errors.transactionAmount}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="transactionDate"
                            name="transactionDate"
                            label="Transaction Date"
                            type="date"
                            value={values.transactionDate}
                            onChange={(e) => {
                                console.log(e.target.value);
                                handleChange(e)
                            }}
                            error={touched.transactionDate && Boolean(errors.transactionDate)}
                            helperText={touched.transactionDate && errors.transactionDate}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="description"
                            name="description"
                            label="Description"
                            type="text"
                            value={values.description}
                            onChange={handleChange}
                            error={touched.description && Boolean(errors.description)}
                            helperText={touched.description && errors.description}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="payment-mode-label">Payement Via</InputLabel>
                            <Select
                                labelId="payment-mode-label"
                                id="demo-simple-select"
                                value={values.paymentModeId !== "Cash" ? bankAccounts.filter((bankAccount) => bankAccount._id === values.paymentModeId)[0]?.accountName 
                                                                        || creditCards.filter((creditCard) => creditCard._id === values.paymentModeId)[0]?.cardName 
                                                                    : values.paymentMode}
                                label="Payement Via"
                                name="paymentModeId"
                                onChange={(e) => {
                                    setFieldValue('paymentMode', e.target.value == "Cash" ? "Cash" : bankAccounts.filter((bankAccount) => bankAccount._id === e.target.value)[0]?._id ? "Bank" : "Credit Card");
                                    handleChange(e);
                                }}
                            >
                                <MenuItem value={"Cash"}>Cash</MenuItem>
                                {bankAccounts.map((bankAccount) => {
                                    return <MenuItem color="primary" key={bankAccount._id} value={bankAccount._id}>{bankAccount.accountName}</MenuItem>
                                })}
                                {creditCards.map((creditCard) => {
                                    return <MenuItem color="primary" key={creditCard._id} value={creditCard._id}>{creditCard.cardName}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            disabled={isSubmitting}
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    )
};
