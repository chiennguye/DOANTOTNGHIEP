import {
  Button,
  FormControl,
  Grid,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  makeStyles,
  Chip,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ProductGetAll,
  deleteProduct,
} from "../../store/actions/ProductAction";
import Pagination from "@material-ui/lab/Pagination";
import TableHeader from "../TableHeader";
import Logo from "./../../assets/img/logo.png";
import { useHistory } from "react-router-dom";
import {
  CreateOutlined,
  DeleteOutline,
  Replay,
  Visibility,
} from "@material-ui/icons";
import { CategoryListAction } from "./../../store/actions/CategoryAction";
import { AdditionOptionListAction } from "./../../store/actions/AdditionOptionAction";
import { SizeOptionAction } from "./../../store/actions/SizeOptionAction";
import { confirmAlert } from "react-confirm-alert";
import Notification from "./../../common/Notification";

const useStyles = makeStyles((theme) => ({
  btn: {
    width: 90.18,
    height: 36,
  },
  searchField: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  btnSearch: {
    width: 100,
    height: 36,
    marginTop: 16,
    marginRight: 30,

    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginBottom: 16,
      marginRight: 0,
    },
  },
  wrapForm: {
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column-reverse",
    },
  },
  select: {
    marginLeft: 30,
    [theme.breakpoints.down("sm")]: {
      marginLeft: 200,
    },
  },
}));

const Product = () => {
  const classes = useStyles();
  const history = useHistory();

  const dispatch = useDispatch();
  const { products, totalPages } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);
  const [page, setPage] = useState(1);
  const [valueToOrderBy, setValueToOrderBy] = useState("id");
  const [valueToSortDir, setValueToSortDir] = useState("asc");
  const [keyword, setKeyword] = useState("");
  const [name, setName] = useState("");
  const [pageSize, setPageSize] = useState(3);

  useEffect(() => {
    dispatch(CategoryListAction());
    dispatch(AdditionOptionListAction());
    dispatch(SizeOptionAction());
    dispatch(
      ProductGetAll({
        page,
        sortField: valueToOrderBy,
        sortDir: valueToSortDir,
        keyword,
        pageSize,
      })
    );
  }, [dispatch, page, valueToOrderBy, valueToSortDir, keyword, pageSize]);

  const { additionOptions } = useSelector((state) => state.additionOption);

  const { sizeOptions } = useSelector((state) => state.sizeOption);

  const handleRequestSort = (property) => {
    const isAscending =
      Object.is(valueToOrderBy, property) && Object.is(valueToSortDir, "asc");
    setValueToOrderBy(property);
    setValueToSortDir(isAscending ? "desc" : "asc");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(name);
    setPage(1);
  };

  const handlePage = (event, value) => {
    setPage(value);
  };

  const handlePageSize = (e) => {
    setPageSize(e.target.value);
    setPage(1);
  };

  const onHandleRedirect = () => {
    history.push("/product/add");
  };

  const onhandleUpdate = (item) => {
    history.push("/product/edit", {
      product: item,
      addition: additionOptions,
      size: sizeOptions,
    });
  };

  const onhandleDelete = (id) => {
    confirmAlert({
      title: "Thông báo",
      message: "Bạn có chắc muốn cập nhật trạng thái?",
      buttons: [
        {
          label: "Có",
          onClick: () => {
            dispatch(deleteProduct(id));
            Notification.success("Đã cập nhập thành công!");
          },
        },
        {
          label: "Không",
        },
      ],
    });
  };

  const fields = [
    { id: 'image', label: 'Hình ảnh', disableSorting: true },
    { id: 'name', label: 'Sản phẩm', disableSorting: false },
    { id: "title", label: "Chú Thích", disableSorting: false },
    { id: 'price', label: 'Giá', disableSorting: false },
    { id: 'category', label: 'Danh mục', disableSorting: false },
    { id: 'status', label: 'Trạng thái', disableSorting: true },
    { id: 'actions', label: 'Hành động', disableSorting: true },
  ];

  return (
    <div>
      <Grid
        container
        style={{
          display: "flex",
        }}
        className={classes.wrapForm}
      >
        <Grid
          item
          md={9}
          xl={12}
          sm={12}
          style={{
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          className={classes.wrapForm}
        >
          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "row-reverse",
              alignItems: "center",
            }}
            className={classes.form}
          >
            <TextField
              label="Tìm kiếm"
              margin="normal"
              onChange={(e) => setName(e.target.value)}
              className={classes.searchField}
            />
            <Button
              className={classes.btnSearch}
              type="submit"
              variant="contained"
              color="primary"
            >
              Tìm Kiếm
            </Button>
          </form>
        </Grid>

        <Grid
          item
          md={3}
          xl={12}
          sm={12}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingTop: 16,
          }}
        >
          <FormControl
            style={{
              marginTop: 16,
              marginLeft: 10,
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          >
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={onHandleRedirect}
            >
              Thêm sản phẩm
            </Button>

            <Select
              native
              value={pageSize}
              onChange={handlePageSize}
              className={classes.select}
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table style={{ minWidth: 650 }} aria-label="simple table">
          <TableHeader
            valueToOrderBy={valueToOrderBy}
            valueToSortDir={valueToSortDir}
            handleRequestSort={handleRequestSort}
            fields={fields}
          />
          <TableBody>
            {products.map((u) => (
              <TableRow key={u.id}>
                <TableCell component="th" scope="row">
                  <img
                    alt=""
                    width={60}
                    height={60}
                    src={u.linkImage ?? Logo}
                  />
                </TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>
                  {u.title}
                  {u.inventory && u.inventory.quantity < u.inventory.minimumQuantity && (
                    <Typography style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>
                      Cảnh báo: Số lượng tồn kho thấp ({u.inventory.quantity}/{u.inventory.minimumQuantity})
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {typeof u.price === "number"
                    ? u.price.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                      })
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {u.category?.name || 'N/A'}
                </TableCell>
                <TableCell>
                  {u.deletedAt ? (
                    <Chip
                      label="Ngừng bán"
                      style={{ backgroundColor: "red", color: "white" }}
                    />
                  ) : (
                    <Chip
                      label="Hoạt động"
                      style={{ backgroundColor: "green", color: "white" }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Visibility
                    style={{
                      color: "grey",
                      cursor: "pointer",
                      marginRight: 10,
                    }}
                    onClick={() => {
                      history.push("product/detail", { product: u });
                    }}
                  />
                  <CreateOutlined
                    style={{
                      color: "#3F51B5",
                      cursor: "pointer",
                      marginRight: 10,
                    }}
                    onClick={() => onhandleUpdate(u)}
                  />

                  {u.deletedAt ? (
                    <Replay
                      style={{ cursor: "pointer", color: "green" }}
                      onClick={() => onhandleDelete(u.id)}
                    />
                  ) : (
                    <DeleteOutline
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() => onhandleDelete(u.id)}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        style={{ marginTop: 50 }}
        color="primary"
        shape="rounded"
        count={totalPages}
        page={page}
        onChange={handlePage}
        showFirstButton
        showLastButton
      />
    </div>
  );
};

export default Product;
