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
  Fab,
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
import { CategoryListAction } from "../../../store/actions/CategoryAction";
import { OrderAddAction } from "../../../store/actions/OrderAction";
import { udpateWishlist } from "../../../store/actions/UserAction";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
    },
  },
  cardMedia: {
    display: "block",
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: 20,
    paddingTop: "76.25%",
    width: "70%",
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  cardContent: {
    flexGrow: 1,
    padding: "16px 24px",
  },
  btnOrder: {
    color: "#0c713d",
    fontSize: 16,
    border: "2px solid #0c713d",
    borderRadius: "25px",
    padding: "8px 24px",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#0c713d",
      color: "white",
      transform: "scale(1.05)",
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
    transition: "all 0.3s ease",
    "&:hover": {
      color: "#416c48",
      transform: "scale(1.1)",
    },
  },
  iconWishListSelected: {
    position: "absolute",
    marginLeft: "85%",
    marginTop: "5%",
    fontSize: 30,
    color: "#416c48",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  itemTag: {
    backgroundColor: "#416c48",
    padding: "4px 16px",
    color: "white",
    marginTop: "5%",
    marginLeft: "5%",
    position: "absolute",
    fontSize: 10,
    fontWeight: "bold",
    borderRadius: "15px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
    borderRadius: "20px",
    padding: "6px 16px",
    marginTop: 5,
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#0c713d",
      color: "white",
      transform: "scale(1.05)",
    },
  },
  btnSelected: {
    fontFamily: "sans-serif",
    cursor: "pointer",
    marginTop: 5,
    fontSize: 14,
    border: "1px solid",
    borderRadius: "20px",
    padding: "6px 16px",
    backgroundColor: "#0c713d",
    color: "white",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  scrollTopButton: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(4.2),
    zIndex: 10,
    backgroundColor: '#0c713d',
    color: 'white',
    width: 50,
    height: 50,
    '&:hover': {
      backgroundColor: '#0a5c32',
    },
    marginBottom: 80,
    transform: 'translateX(0)',
  },
  productTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    transition: "color 0.3s ease",
    "&:hover": {
      color: "#0c713d",
    },
  },
  productDescription: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    minHeight: "40px",
  },
  priceContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  originalPrice: {
    textDecoration: "line-through",
    color: "#999",
    fontSize: 14,
  },
  salePrice: {
    color: "#0c713d",
    fontWeight: "bold",
    fontSize: 18,
  },
  regularPrice: {
    color: "#0c713d",
    fontWeight: "bold",
    fontSize: 18,
  },
}));

const Content = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { products, newProductId } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);
  const auth = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.customer);
  const { order } = useSelector((state) => state.order);

  const [valueCategory, setValueCategory] = useState("");
  const [valueToOrderBy, setValueToOrderBy] = useState("id");
  const [valueToSortDir, setValueToSortDir] = useState("desc");
  const [keyword, setKeyword] = useState("");
  const [name, setName] = useState("");
  const dispatch = useDispatch();

  const [productSelect, setProductSelect] = useState("");
  const [selectedSize, setSelectedSize] = useState();
  const [selectedAdd, setSelectedAdd] = useState([]);
  const [count, setCount] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [note, setNote] = useState("");
  const [size, setSize] = useState([]);

  const { handleSubmit } = useForm();

  useEffect(() => {
    dispatch(CategoryListAction());
    dispatch(
      ProductGetAll({
        cateName: valueCategory,
        sortField: valueToOrderBy,
        sortDir: valueToSortDir,
        keyword,
      })
    );
  }, [dispatch, valueToOrderBy, valueToSortDir, keyword, valueCategory]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleClickOpen = (item) => {
    if (auth?.user?.token) {
      setProductSelect(item);
      setCurrentPrice(
        item.price * (item?.saleOff?.discount ? 1 - item?.saleOff?.discount : 1)
      );
      const items = [...item.sizeOptions];
      setSize(items.sort((a, b) => a.price - b.price));
      setSelectedSize(items.sort((a, b) => a.price - b.price)[0]);
      setCount(1);
      setOpen(true);
      setSelectedAdd([]);
    } else {
      Notification.error("Vui lòng đăng nhập trước khi mua hàng!");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCount(1);
    setSelectedAdd([]);
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

  const onHandleCateFilter = (e) => {
    setKeyword("");
    if ("default" !== e.target.value) {
      setValueCategory(e.target.value);
    } else {
      setValueCategory("");
      setValueToSortDir("desc");
      setValueToOrderBy("id");
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

  const onHandleSelectSize = (item) => {
    setSelectedSize(item);
    var price =
      productSelect.price *
      (productSelect?.saleOff?.discount
        ? 1 - productSelect?.saleOff?.discount
        : 1);
    price += item.price;
    price += selectedAdd.reduce((a, b) => a + (b["price"] || 0), 0);
    setCurrentPrice(price);
  };

  const onHandleMinus = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const onHandlePlus = () => {
    setCount(count + 1);
  };

  const onHandleSelectAdd = (item) => {
    if (!selectedAdd.includes(item)) {
      setSelectedAdd([...selectedAdd, item]);
      setCurrentPrice(currentPrice + item.price);
    } else {
      setSelectedAdd(selectedAdd.filter((elm) => !Object.is(elm, item)));
      setCurrentPrice(currentPrice - item.price);
    }
  };

  const onSubmit = (data) => {
    if (!auth?.user?.token) {
      Notification.error("Vui lòng đăng nhập trước khi mua hàng!");
      return;
    }

    data.product = JSON.stringify(productSelect);
    data.userId = auth.user.id;
    data.sizeOption = !Object.is(selectedSize, undefined) ? selectedSize.name : "";
    data.quantity = count;

    const result = selectedAdd.map((a) => a.name).sort();
    var temp = "";
    for (let i = 0; i < result.length; i++) {
      if (Object.is(i, 0)) {
        temp = temp.concat(result[i]);
      } else {
        temp = temp.concat(", " + result[i]);
      }
    }

    data.additionOption = temp;
    data.priceCurrent = currentPrice;
    data.note = note;

    const username = auth?.user?.username;
    const orderID = order?.id;
    const type = "team";
    dispatch(OrderAddAction(data, { username, type, orderID }));
    
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
        <Grid item md={4} sm={12} className={classes.searchItem}>
          <Typography style={{ marginRight: 10 }}>
            <b>Nhóm sản phẩm </b>
          </Typography>
          <FormControl className={classes.formControl}>
            <NativeSelect
              onChange={onHandleCateFilter}
              className={classes.selectEmpty}
              name="name"
              inputProps={{ "aria-label": "name" }}
            >
              <option value="default">Không chọn lựa</option>
              {categories
                .filter(item => item.name !== "Snack" && item.name !== "Product")
                .map((item) => (
                  <option
                    key={item.id}
                    value={item.name}
                  >
                    {item.name}
                  </option>
                ))}
            </NativeSelect>
          </FormControl>
        </Grid>

        <Grid item md={4} sm={12} className={classes.searchItem}>
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

        <Grid item md={4} sm={12} className={classes.searchItem}>
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
                {newProductId === product.id && (
                  <span className={classes.itemTag}>Món mới</span>
                )}
                {
                  product?.saleOff?.discount && (
                    <span
                      className={classes.itemTag}
                      style={{ backgroundColor: "red" }}
                    >
                      Giảm giá {product?.saleOff?.discount * 100}%
                    </span>
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
                <Typography className={classes.productTitle}>
                  {product.name}
                </Typography>
                <Typography className={classes.productDescription}>
                  {product.title}
                </Typography>
                <div className={classes.priceContainer}>
                  {product?.saleOff?.discount ? (
                    <>
                      <Typography className={classes.originalPrice}>
                        {product.price.toLocaleString("it-IT", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </Typography>
                      <Typography className={classes.salePrice}>
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
                    <Typography className={classes.regularPrice}>
                      {product.price.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </Typography>
                  )}
                </div>
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

                  <div style={{ height: 300, width: 400, overflowY: "scroll" }}>


                    {
                      productSelect?.sizeOptions?.length > 0 && (
                        <div style={{ display: "flex", marginTop: 40 }}>
                          <Typography
                            style={{ marginRight: 60, fontFamily: "sans-serif" }}
                          >
                            <b>Kích thước: </b>
                          </Typography>
                          <div style={{ marginLeft: -42, marginTop: -10 }}>
                            {size?.map((item) => (
                              <div
                                key={item.id}
                                size="small"
                                color="primary"
                                className={
                                  selectedSize?.id === item.id
                                    ? classes.btnSelected
                                    : classes.btnNotSelected
                                }
                                onClick={() => {
                                  onHandleSelectSize(item);
                                }}
                              >
                                {item.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    }

                    {productSelect?.additionOptions?.length > 0 && (
                      <div style={{ display: "flex", marginTop: 20 }}>
                        <Typography
                          style={{ marginRight: 60, fontFamily: "sans-serif" }}
                        >
                          <b>Thêm: </b>
                        </Typography>
                        <div>
                          {productSelect?.additionOptions?.map((item) => (
                            <div
                              key={item.id}
                              size="small"
                              color="primary"
                              className={
                                selectedAdd.length > 0 &&
                                  selectedAdd.includes(item)
                                  ? classes.btnSelected
                                  : classes.btnNotSelected
                              }
                              onClick={() => {
                                onHandleSelectAdd(item);
                              }}
                            >
                              {item.name +
                                " + " +
                                (item.price ? item.price : 0).toLocaleString(
                                  "it-IT",
                                  {
                                    style: "currency",
                                    currency: "VND",
                                  }
                                )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

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

      {showScrollTop && (
        <Fab 
          size="small" 
          className={classes.scrollTopButton}
          onClick={scrollToTop}
          aria-label="scroll to top"
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}
    </Container>
  );
};

export default Content;