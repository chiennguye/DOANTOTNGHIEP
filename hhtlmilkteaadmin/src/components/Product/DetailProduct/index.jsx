import { Avatar, Chip, Grid, makeStyles, Typography, Button } from "@material-ui/core";
import { useState } from "react";
import { useLocation, Redirect } from "react-router-dom";
import BarCode from "react-barcode";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Report from "./report";

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: "hidden",
    paddingLeft: 30,
  },
  displayImg: {
    marginTop: 20,
  },
  content: {
    marginTop: 40,
  },
  navButton: {
    display: "flex",
    marginTop: -115,
    paddingBottom: 20,
    [theme.breakpoints.down("sm")]: {
      marginTop: 10,
    },
  },
}));

const DetailProduct = () => {
  const classes = useStyles();
  const location = useLocation();
  const [product] = useState(location?.state?.product);

  return (
    <div className={classes.root}>
      {Object.is(product, undefined) && <Redirect to="/product" />}
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Typography variant="h5">THÔNG TIN SẢN PHÂM</Typography>

          <Grid container spacing={3}>
            <Grid item md={5} xs={12}>
              <img
                alt=""
                src={product?.linkImage}
                className={classes.displayImg}
                width={350}
                height={400}
              />
            </Grid>
            <Grid item md={7} xs={12}>
              <div className={classes.content}>
                <Typography variant="h6">Tên sản phẩm:</Typography>
                <Typography variant="subtitle1">{product?.name}</Typography>
                <Typography variant="h6">Giá sản phẩm:</Typography>
                <Typography variant="subtitle1">{product?.price}</Typography>
                <Typography variant="h6">Chú thích:</Typography>
                <Typography variant="subtitle1">{product?.title}</Typography>
                <Typography variant="h6">Loại sản phẩm:</Typography>
                <Typography variant="subtitle1">
                  {product?.category?.name}
                </Typography>

                {(product?.category?.name === "Snack" || product?.category?.name === "Product") ? (
                  <>
                    <Typography variant="h6">Số lượng hàng:</Typography>
                    <Typography variant="subtitle1">{product?.inventory?.quantity ?? "N/A"}</Typography>
                    <Typography variant="h6">Số lượng tối thiểu:</Typography>
                    <Typography variant="subtitle1">{product?.inventory?.minimumQuantity ?? "N/A"}</Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="h6">Kích thước sản phẩm:</Typography>
                    {product?.sizeOptions?.length > 0
                      ? product.sizeOptions.map((item) => (
                          <Chip key={item.id} label={item.name} color="primary" />
                        ))
                      : <Typography variant="subtitle2">Không có</Typography>
                    }
                    <Typography variant="h6">Topping thêm vào:</Typography>
                    {product?.additionOptions?.length > 0
                      ? product.additionOptions.map((item) => (
                          <Chip key={item.id} label={item.name} color="primary" />
                        ))
                      : <Typography variant="subtitle2">Không có</Typography>
                    }
                  </>
                )}
                <Typography variant="h6">Barcode:</Typography>
                <BarCode value={product?.id} />
              </div>
            </Grid>
            <div className={classes.navButton}>
              <PDFDownloadLink
                document={<Report product={product} />}
                fileName="report"
              >
                <Avatar
                  style={{
                    cursor: "pointer",
                    width: 50,
                    height: 50,
                    backgroundColor: "#FC8400",
                  }}
                >
                  <PictureAsPdfIcon style={{ fontSize: 30 }} />
                </Avatar>
              </PDFDownloadLink>
            </div>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: 20 }}
            onClick={() => window.history.back()}
          >
            Quay lại
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default DetailProduct;
