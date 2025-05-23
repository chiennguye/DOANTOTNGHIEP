import {
  Grid,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  makeStyles,
  Typography,
  Container,
  FormControl,
  NativeSelect,
  TextField,
  Dialog,
  DialogContent,
} from "@material-ui/core";
import productImg from "./../../../assets/img/product.png";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import { useEffect, useState } from "react";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Notification from "./../../../common/Notification";
import { useDispatch, useSelector } from "react-redux";
import { ProductGetAll } from "./../../../store/actions/ProductAction";
import popupBg from "./../../../assets/img/bg_popup.png";
import { useForm } from "react-hook-form";
import { OrderAddAction } from "../../../store/actions/OrderAction";
import { udpateWishlist } from "../../../store/actions/UserAction";
import { GroupOrderAddAction } from "../../../store/actions/GroupOrderAction";

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    boxShadow: "none",
    backgroundColor: "#fafafa",
    "&:hover": {
      boxShadow: "2px 4px 4px 2px  #a5abb5",
    },
  },
  cardMedia: {
    display: "block",
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: 20,
    paddingTop: "76.25%",
    width: "60%",
  },
  cardContent: {
    flexGrow: 1,
  },
  btnOrder: {
    color: "#0c713d",
    fontSize: 16,
    border: "1px solid",
    paddingRight: 10,
    paddingLeft: 10,
    "&:hover": {
      backgroundColor: "#0c713d",
      color: "white",
    },
  },
  iconButton: {
    marginTop: 8,
  },
  formControl: {
    marginTop: -3,
    minWidth: 200,
  },
  cardMediaModal: {
    display: "block",
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: 20,
    paddingTop: "100%",
    width: "100%",
  },
  rdSize: {
    padding: 3,
    backgroundColor: "#1db4ff",
    outline: "none",
  },
  btnCount: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 24,
    paddingTop: 5,
  },
  searchItem: {
    display: "flex",
    padding: 25,
    borderRight: "2px solid #ececec",
    [theme.breakpoints.down("sm")]: {
      borderRight: "none",
      paddingLeft: 40,
    },
  },
  itemHeader: {
    position: "relative",
  },
  iconWishList: {
    position: "absolute",
    marginLeft: "85%",
    marginTop: "5%",
    fontSize: 30,
    color: "#9e9796",
    "&:hover": {
      color: "#416c48",
    },
  },
  iconWishListSelected: {
    position: "absolute",
    marginLeft: "85%",
    marginTop: "5%",
    fontSize: 30,
    color: "#416c48",
  },
  itemTag: {
    backgroundColor: "#416c48",
    padding: "3px 18px",
    color: "white",
    marginTop: "5%",
    marginLeft: "5%",
    position: "absolute",
    fontSize: 9,
    fontWeight: "bold",
  },
  descriptionCard: {
    backgroundImage: `url(${popupBg})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  },
  notSelect: {
    cursor: "pointer",
    color: "#0c713d",
    fontSize: 16,
    border: "1px solid",
    paddingRight: 10,
    paddingLeft: 10,
    "&:hover": {
      backgroundColor: "#0c713d",
      color: "white",
    },
  },
  btnNotSelected: {
    fontFamily: "sans-serif",
    cursor: "pointer",
    color: "#0c713d",
    fontSize: 14,
    border: "1px solid",
    borderRadius: 5,
    padding: 3,
    marginTop: 5,
    "&:hover": {
      backgroundColor: "#0c713d",
      color: "white",
    },
  },
  btnSelected: {
    fontFamily: "sans-serif",
    cursor: "pointer",
    marginTop: 5,
    fontSize: 14,
    border: "1px solid",
    borderRadius: 5,
    padding: 3,
    backgroundColor: "#0c713d",
    color: "white",
  },
}));

const Content = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const { products, newProductId } = useSelector((state) => state.product);
  const auth = useSelector((state) => state.auth);

  const [valueToOrderBy, setValueToOrderBy] = useState("id");
  const [valueToSortDir, setValueToSortDir] = useState("desc");
  const [keyword, setKeyword] = useState("");
  const [name, setName] = useState("");
  const dispatch = useDispatch();

  const [productSelect, setProductSelect] = useState("");

  const [count, setCount] = useState(1);

  const [currentPrice, setCurrentPrice] = useState(0);

  const [note, setNote] = useState("");

  const { wishlist } = useSelector((state) => state.customer);

  const { handleSubmit } = useForm();

  const { order } = useSelector((state) => state.order);

  const { dataGroupOrderDetails } = useSelector((state) => state.groupOrder);

  useEffect(() => {
    dispatch(
      ProductGetAll({
        cateName: "Snack",
        sortField: valueToOrderBy,
        sortDir: valueToSortDir,
        keyword,
      })
    );
  }, [dispatch, valueToOrderBy, valueToSortDir, keyword]);

  const handleClickOpen = (item) => {
    if (
      auth?.user?.token ||
      (localStorage.getItem("member") &&
        dataGroupOrderDetails?.groupOrderInfoResponses &&
        dataGroupOrderDetails?.groupOrderInfoResponses.some(
          (a) => a.username === localStorage.getItem("member")
        ))
    ) {
      setProductSelect(item);
      setCurrentPrice(
        item.price * (item?.saleOff?.discount ? 1 - item?.saleOff?.discount : 1)
      );
      setCount(1);
      setOpen(true);
    } else {
      Notification.error("Vui lòng đăng nhập trước khi mua hàng!");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCount(1);
    setNote("");
  };

  const onHandleWishList = (product) => {
    if (auth?.user?.token) {
      const userId = auth.user.id;
      dispatch(udpateWishlist({ userId: userId, productId: product.id }));
      Notification.success("Đã thêm sản phẩm vào yêu thích");
    } else {
      Notification.error("Vui lòng đăng nhập!");
    }
  };

  const onHandleWishListSelected = (product) => {
    if (auth?.user?.token) {
      const userId = auth.user.id;
      dispatch(udpateWishlist({ userId: userId, productId: product.id }));
      Notification.warn("Đã xoá sản phẩm khỏi yêu thích");
    } else {
      Notification.error("Vui lòng đăng nhập!");
    }
  };

  const onHandlePriceFilter = (e) => {
    setKeyword("");
    if ("default" !== e.target.value) {
      setValueToSortDir(e.target.value);
      setValueToOrderBy("price");
    } else {
      setValueToSortDir("asc");
      setValueToOrderBy("id");
    }
  };

  const onHandleSearchKeyword = (e) => {
    e.preventDefault();
    setKeyword(name);
  };

  const onHandleNote = (e) => {
    setNote(e.target.value);
  };

  const onHandleMinus = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const onHandlePlus = () => {
    setCount(count + 1);
  };

  const onSubmit = (data) => {
    if (count > productSelect?.inventory?.quantity) {
      Notification.error("Số lượng sản phẩm bạn mua vượt quá số lượng trong kho!");
      return;
    }

    data.product = JSON.stringify(productSelect);
    if (auth?.user) {
      data.userId = auth.user.id;
    }
    data.sizeOption = "";
    data.quantity = count;

    if (localStorage.getItem("member")) {
      const groupMember = JSON.parse(localStorage.getItem("groupMember"));
      data.name = localStorage.getItem("member");
      data.usernameOwner = groupMember?.username;
      data.orderId = groupMember?.orderID;
    }

    data.additionOption = "";
    data.priceCurrent = currentPrice;
    data.note = note;
    if (localStorage.getItem("member")) {
      const groupMember = JSON.parse(localStorage.getItem("groupMember"));
      const username = groupMember?.username;
      const orderID = groupMember?.orderID;
      const type = "team";
      GroupOrderAddAction(data, { username, type, orderID })(dispatch);
    } else {
      const username = auth?.user?.username;
      const orderID = order?.id;
      const type = "team";
      dispatch(OrderAddAction(data, { username, type, orderID }));
    }
    setOpen(false);
    Notification.success("Đã thêm sản phẩm vào giỏ hàng");
  };

  return (
    <Container className={classes.cardGrid} maxWidth="lg">
      {/* Start Filter Bar */}
      <Grid
        container
        style={{
          flexGrow: 1,
          border: "2px solid #ececec",
          width: "100%",
          marginBottom: 30,
        }}
      >
        <Grid item md={6} sm={12} className={classes.searchItem}>
          <Typography style={{ marginRight: 10 }}>
            <b>Theo giá </b>
          </Typography>
          <FormControl className={classes.formControl}>
            <NativeSelect
              onChange={onHandlePriceFilter}
              className={classes.selectEmpty}
              name="price"
              inputProps={{ "aria-label": "price" }}
            >
              <option value="default">Không chọn lựa</option>
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </NativeSelect>
          </FormControl>
        </Grid>

        <Grid item md={6} sm={12} className={classes.searchItem}>
          <Typography style={{ marginRight: 10 }}>
            <b>Tìm kiếm: </b>
          </Typography>
          <div style={{ display: "flex", marginTop: -21 }}>
            <TextField
              label="Nhập tên sản phẩm"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <IconButton
              className={classes.iconButton}
              aria-label="search"
              onClick={onHandleSearchKeyword}
            >
              <SearchIcon />
            </IconButton>
          </div>
        </Grid>
      </Grid>
      {/* End Filter Bar */}

      <Grid
        container
        spacing={3}
        style={{ marginTop: 20, paddingRight: 30, paddingLeft: 30 }}
      >
        {products.map((product, index) => (
          <Grid item key={product.id} xs={12} sm={6} md={3}>
            <Card className={classes.card}>
              <div className={classes.itemHeader}>
                {newProductId === product.id ? (
                  <span className={classes.itemTag}>Món mới</span>
                ) : product?.saleOff?.discount ? (
                  <span
                    className={classes.itemTag}
                    style={{ backgroundColor: "red" }}
                  >
                    Giảm giá {product?.saleOff?.discount * 100}%
                  </span>
                ) : (
                  ""
                )}
                {wishlist?.products?.length > 0 &&
                wishlist?.products?.map((w) => w.id).includes(product?.id) ? (
                  <FavoriteIcon
                    className={classes.iconWishListSelected}
                    style={{ cursor: "pointer" }}
                    onClick={() => onHandleWishListSelected(product)}
                  />
                ) : (
                  <FavoriteIcon
                    className={classes.iconWishList}
                    style={{ cursor: "pointer" }}
                    onClick={() => onHandleWishList(product)}
                  />
                )}
              </div>
              <CardMedia
                className={classes.cardMedia}
                image={product.linkImage}
                title="Image title"
              />
              <CardContent className={classes.cardContent}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  style={{
                    textAlign: "center",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {product.name}
                </Typography>
                <Typography style={{ textAlign: "center", fontSize: 14 }}>
                  {product.title}
                </Typography>
                <Typography style={{ textAlign: "center", fontSize: 14, color: "#666" }}>
                  Số lượng còn: {product?.inventory?.quantity || 0}
                </Typography>
                {product?.saleOff?.discount ? (
                  <>
                    <Typography
                      style={{
                        textDecoration: "line-through",
                        color: "#666",
                        fontSize: 14,
                        textAlign: "center",
                        display: "block"
                      }}
                    >
                      {product.price.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </Typography>
                    <Typography
                      style={{
                        textAlign: "center",
                        color: "#0c713d",
                        fontWeight: "bold",
                      }}
                    >
                      {(
                        product.price *
                        (1 - product?.saleOff?.discount)
                      ).toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </Typography>
                  </>
                ) : (
                  <Typography
                    style={{
                      textAlign: "center",
                      color: "#0c713d",
                      fontWeight: "bold",
                    }}
                  >
                    {product.price.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </Typography>
                )}
              </CardContent>
              <CardActions
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <Button
                  size="small"
                  color="primary"
                  className={classes.btnOrder}
                  onClick={() => handleClickOpen(product)}
                >
                  Đặt hàng
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={open}
        keepMounted
        maxWidth="md"
        fullWidth={true}
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className={classes.descriptionCard}>
            <div
              id="alert-dialog-slide-description"
              style={{ display: "flex" }}
            >
              <Grid container>
                <Grid item xs={12} md={6}>
                  {productSelect.linkImage ? (
                    <CardMedia
                      className={classes.cardMedia}
                      image={productSelect.linkImage}
                      title="Image title"
                    />
                  ) : (
                    <CardMedia
                      className={classes.cardMedia}
                      image={productImg}
                      title="Image title"
                    />
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    style={{
                      textAlign: "center",
                      fontSize: 36,
                      fontWeight: "bold",
                      color: "#0c713d",
                      fontFamily: "sans-serif",
                    }}
                  >
                    {productSelect.name}
                  </Typography>
                  <Typography style={{ textAlign: "center", fontSize: 14 }}>
                    {productSelect.title}
                  </Typography>

                  <div style={{ height: 200, width: 400, overflowY: "scroll" }}>
                    <div style={{ display: "flex", marginTop: 30 }}>
                      <Typography
                        style={{ marginRight: 60, fontFamily: "sans-serif" }}
                      >
                        <b>Số lượng: </b>
                      </Typography>
                      <div style={{ display: "flex", marginTop: -10 }}>
                        <div
                          className={classes.btnCount}
                          onClick={onHandleMinus}
                        >
                          -
                        </div>
                        <p
                          translate="no"
                          style={{ marginLeft: 20, marginRight: 20 }}
                        >
                          {count}
                        </p>
                        <div
                          className={classes.btnCount}
                          onClick={onHandlePlus}
                        >
                          +
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", marginTop: 10 }}>
                      <Typography
                        style={{ marginRight: 60, fontFamily: "sans-serif" }}
                      >
                        <b>Ghi chú: </b>
                      </Typography>
                      <TextField
                        multiline
                        rowsmin={3}
                        aria-label="minimum height"
                        minRows={3}
                        placeholder=""
                        onChange={onHandleNote}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", marginTop: 50 }}>
                    <Typography
                      style={{ marginRight: 70, fontFamily: "sans-serif" }}
                    >
                      <b>Tổng tiền: </b>
                    </Typography>
                    <Typography
                      style={{
                        textAlign: "center",
                        color: "#0c713d",
                        fontWeight: "bold",
                      }}
                    >
                      {(currentPrice ? currentPrice * count : 0).toLocaleString(
                        "it-IT",
                        {
                          style: "currency",
                          currency: "VND",
                        }
                      )}
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 20,
                marginTop: 20,
              }}
            >
              <Button
                type="submit"
                size="small"
                color="primary"
                className={classes.btnOrder}
              >
                Thêm vào giỏ hàng
              </Button>
            </div>
          </DialogContent>
        </form>
      </Dialog>
    </Container>
  );
};

export default Content;