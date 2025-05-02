import { Card, Grid, makeStyles, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Chip, Typography } from "@material-ui/core"
import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Pagination } from '@material-ui/lab';
import TableHeader from "../TableHeader";
import moment from "moment";
import { useHistory } from "react-router";
import BarCode from "react-barcode";
import { LocalShippingOutlined } from "@material-ui/icons";
import { confirmAlert } from 'react-confirm-alert';
import Notification from "./../../common/Notification";
import { OrderStatusUpdate, OrderListProcess } from "../../store/actions/OrderAction";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    table: {
        minWidth: 650,
    },
    wrapped: {
        maxWidth: 100,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    barCode: {
        width: '100%',
        height: 'auto',
    },
}));

const fields = [
    { id: 'id', label: 'Mã đơn hàng', disableSorting: false },
    { id: 'createdAt', label: 'Ngày đặt', disableSorting: false },
    { id: 'userId.fullName', label: 'Khách hàng', disableSorting: false },
    { id: 'address', label: 'Địa chỉ', disableSorting: false },
    { id: 'phone', label: 'Số điện thoại', disableSorting: false },
    { id: 'status', label: 'Trạng thái', disableSorting: false },
    { id: 'actions', label: 'Thao tác', disableSorting: true },
];

const Shipper = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const [page, setPage] = useState(1);
    const [valueToOrderBy, setValueToOrderBy] = useState('id');
    const [valueToSortDir, setValueToSortDir] = useState('asc');
    const { listProcess, totalPagesProcess } = useSelector((state) => state.order);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.token) {
            history.push("/login");
            return;
        }

        // Load orders with status 1 (processing)
        dispatch(OrderListProcess({ page, sortField: valueToOrderBy, sortDir: valueToSortDir }))
            .catch(error => {
                console.error("Error loading orders:", error);
                if (error.response && error.response.status === 403) {
                    Notification.error("Bạn không có quyền truy cập vào trang này");
                    history.push("/dashboard");
                } else {
                    Notification.error("Không thể tải danh sách đơn hàng");
                }
            });
    }, [dispatch, page, valueToOrderBy, valueToSortDir, history]);

    const handlePage = (event, value) => {
        setPage(value);
    };

    const handleRequestSort = (property) => {
        const isAscending = valueToOrderBy === property && valueToSortDir === 'asc';
        setValueToSortDir(isAscending ? 'desc' : 'asc');
        setValueToOrderBy(property);
    };

    const handleCompleteStatus = (id) => {
        confirmAlert({
            title: "CẬP NHẬT TRẠNG THÁI",
            message: "Bạn muốn chuyển sang trạng thái HOÀN THÀNH?",
            buttons: [
                {
                    label: "Có",
                    onClick: () => {
                        dispatch(OrderStatusUpdate({ id, status: 3 }));
                        Notification.success("Đã cập nhật thành công");
                    },
                },
                {
                    label: "Không",
                }
            ],
        });
    };

    return (
        <div className={classes.root}>
            <Card>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography className={classes.title} component={'span'}>
                            <Grid item md={3} xl={3} sm={3}>
                                <LocalShippingOutlined />Đơn hàng cần giao
                            </Grid>
                        </Typography>
                    </Grid>
                </Grid>

                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHeader
                            valueToOrderBy={valueToOrderBy}
                            valueToSortDir={valueToSortDir}
                            handleRequestSort={handleRequestSort}
                            fields={fields}
                        />
                        <TableBody>
                            {listProcess && listProcess.length > 0 ? (
                                listProcess.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell component="th" scope="row" className={classes.wrapped}>
                                            <BarCode value={order.id} className={classes.barCode} />
                                        </TableCell>
                                        <TableCell>{moment(order.createdAt).format("YYYY-MM-DD")}</TableCell>
                                        <TableCell>{order.userId.fullName}</TableCell>
                                        <TableCell>{order.address}</TableCell>
                                        <TableCell>{order.phone}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label="Đang giao hàng"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <button
                                                onClick={() => handleCompleteStatus(order.id)}
                                                style={{
                                                    backgroundColor: "green",
                                                    color: "white",
                                                    padding: "5px 10px",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Hoàn thành
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        Không có đơn hàng nào đang giao
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {listProcess && listProcess.length > 0 && (
                    <Pagination
                        style={{ marginTop: 50, marginBottom: 10, marginLeft: 10 }}
                        color="primary"
                        shape="rounded"
                        count={totalPagesProcess}
                        page={page}
                        onChange={handlePage}
                        showFirstButton
                        showLastButton
                    />
                )}
            </Card>
        </div>
    );
};

export default Shipper; 