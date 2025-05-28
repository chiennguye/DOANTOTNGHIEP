import {
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  makeStyles,
  Chip,
  Avatar,
  Button,
} from "@material-ui/core";
import React, { useState } from "react";
import { Redirect, useLocation, useHistory } from "react-router-dom";
import Logo from "./../../../assets/img/logo.png";
import TableHeader from "../../TableHeader";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Report from "./report";

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

const DetailCategory = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const [category] = useState(location?.state?.category);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedProducts = React.useMemo(() => {
    if (!category?.products) return [];
    return [...category.products].sort((a, b) => {
      if (orderBy === "price") {
        return order === "asc" ? a.price - b.price : b.price - a.price;
      }
      return order === "asc"
        ? a[orderBy].localeCompare(b[orderBy])
        : b[orderBy].localeCompare(a[orderBy]);
    });
  }, [category?.products, order, orderBy]);

  const fields = [
    { id: 'image', label: 'Hình ảnh', disableSorting: true },
    { id: 'name', label: 'Tên sản phẩm', disableSorting: false },
    { id: 'price', label: 'Giá', disableSorting: false },
    { id: 'status', label: 'Trạng thái', disableSorting: true },
  ];

  return (
    <div className={classes.root}>
      {Object.is(category, undefined) && <Redirect to="/category" />}
      <Grid container spacing={2} alignItems="center" style={{ marginBottom: 20 }}>
        <Grid item xs>
          <Typography variant="h5">THÔNG TIN LOẠI SẢN PHẨM</Typography>
          <Typography variant="h4">{category.name}</Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => history.goBack()}
          >
            Quay lại
          </Button>
        </Grid>
      </Grid>

      <Grid>
        <PDFDownloadLink
          document={<Report category={category} />}
          fileName="report"
        >
          <Avatar style={{ cursor: "pointer", backgroundColor: "#FC8400", marginBottom: 10 }}>
            <PictureAsPdfIcon />
          </Avatar>
        </PDFDownloadLink>
      </Grid>
      <TableContainer component={Paper}>
        <Table style={{ minWidth: 650 }} aria-label="simple table">
          <TableHeader 
            fields={fields} 
            valueToOrderBy={orderBy}
            valueToSortDir={order}
            handleRequestSort={handleRequestSort}
          />
          <TableBody>
            {sortedProducts.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <img
                    alt=""
                    width={60}
                    height={60}
                    src={u.linkImage ?? Logo}
                  />
                </TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>
                  {u.price.toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DetailCategory;
