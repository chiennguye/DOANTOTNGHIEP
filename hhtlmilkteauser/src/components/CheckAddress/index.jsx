import {
  FormHelperText,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { GroupOrderFindAllAction } from "../../store/actions/GroupOrderAction";
import GoogleMap from "../../common/GoogleMap";
import OrderService from "../../services/OrderService";

const useStyles = makeStyles((theme) => ({
  btnReloadMap: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    border: "none",
    backgroundColor: "#2454b5",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  btnReloadMapDisable: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    color: "black",
    border: "none",
    backgroundColor: "gray",
    fontWeight: "bold",
    cursor: "pointer",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      marginLeft: "auto",
      marginRight: "auto",
    },
    [theme.breakpoints.down("xs")]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    minHeight: 400,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  map: {
    marginLeft: 200,
    [theme.breakpoints.down("md")]: {
      marginLeft: 0,
    },
  },
  hide: {
    display: "none",
  },
  mapResult: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
}));

const CheckAddress = () => {
  const classes = useStyles();
  const history = useHistory();
  const { order } = useSelector((state) => state.order);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState({
    to: "",
    phone: "",
    note: ""
  });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showMapResult, setShowMapResult] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // support group member
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (Object.keys(order).length !== 0) {
      const handleGroupOrder = () => {
        if (
          (!Object.is(localStorage.getItem("member", null)) &&
            !Object.is(localStorage.getItem("member"), null)) ||
          localStorage.getItem("user")
        ) {
          const groupMember = JSON.parse(localStorage.getItem("groupMember"));
          const username = groupMember?.username;
          const type = "team";
          const orderID = groupMember?.orderID;
          GroupOrderFindAllAction({ username, type, orderID })(dispatch);
        }

        if (auth?.user?.token) {
          const username = auth?.user?.username;
          const type = "team";
          const orderID = order?.id;
          GroupOrderFindAllAction({ username, type, orderID })(dispatch);
        }
      };
      
      handleGroupOrder();
    }
  }, [auth?.user?.token, auth?.user?.username, dispatch, order, order?.id]);

  useEffect(() => {
    const checkMapAndOrder = async () => {
      if (!localStorage.getItem("map")) {
        localStorage.setItem("map", "refresh");
        window.location.href = "/checkout";
      }

      // Kiểm tra xem có orderId trong URL không
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get('orderId');

      if (orderId) {
        // Nếu có orderId, lấy thông tin đơn hàng từ API
        try {
          const response = await OrderService.getOrderById(orderId);
          if (response.data) {
            // Lưu thông tin đơn hàng vào Redux store
            dispatch({ type: 'SET_ORDER', payload: response.data });
          } else {
            window.location.href = "/";
          }
        } catch (error) {
          console.error("Error fetching order:", error);
          window.location.href = "/";
        }
      } else if (!order) {
        // Nếu không có orderId và không có order trong store
        window.location.href = "/";
      }
    };
    
    checkMapAndOrder();
  }, [order, dispatch]);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      // Check if API is already loaded
      if (window.google && window.google.maps) {
        setMapLoaded(true);
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      
      // Add event listener
      script.addEventListener('load', () => {
        setMapLoaded(true);
      });
      
      // Add error handling
      script.addEventListener('error', (e) => {
        console.error('Error loading Google Maps API:', e);
      });
      
      // Append script to document
      document.head.appendChild(script);
    };
    
    loadGoogleMapsAPI();
  }, []);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (mapLoaded && window.google && window.google.maps && window.google.maps.places) {
      try {
        const to_places = new window.google.maps.places.Autocomplete(
          document.getElementById("to_places")
        );

        // Listen for place selection
        window.google.maps.event.addListener(to_places, "place_changed", function () {
          const to_place = to_places.getPlace();
          const to_address = to_place.formatted_address;
          setAddress(prev => ({
            ...prev,
            to: to_address
          }));
          
          // Update hidden input
          const destinationInput = document.getElementById("destination");
          if (destinationInput) {
            destinationInput.value = to_address;
          }
        });
      } catch (error) {
        console.error('Error initializing Places Autocomplete:', error);
      }
    }
  }, [mapLoaded]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      data.shippingPrice = document.getElementById("price_shipping")?.innerHTML || "15000";
      data.to = address.to;
      localStorage.removeItem("map");
      await history.push("/payment", { address: data });
    } catch (error) {
      console.error("Error submitting address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [loadMap] = useState(true);
  const [from] = useState(
    "Số 8, ngõ 121, Tây Mỗ, Đại Mỗ, Nam Từ Liêm, Hà Nội"
  );

  const handleAddressChange = (field) => (e) => {
    const value = e.target.value;
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Update destination input when address changes manually
    if (field === 'to') {
      const destinationInput = document.getElementById("destination");
      if (destinationInput) {
        destinationInput.value = value;
      }
    }
  };

  const onHandleCheckMap = () => {
    const destinationValue = document.getElementById("destination").value;
    if (destinationValue) {
      setAddress(prev => ({
        ...prev,
        to: destinationValue
      }));
      
      // Show map result
      setShowMapResult(true);
      
      // Simulate distance calculation (in a real app, this would use Google Maps Distance Matrix API)
      const inKiloElement = document.getElementById("in_kilo");
      const durationElement = document.getElementById("duration_text");
      const priceElement = document.getElementById("price_shipping");
      
      if (inKiloElement) inKiloElement.textContent = "5.2 km";
      if (durationElement) durationElement.textContent = "15 phút";
      if (priceElement) priceElement.textContent = "15000";
    }
  };

  const isFormValid = address.to && !errors.phone && !errors.to_places;

  return (
    <div>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Địa chỉ giao hàng
          </Typography>
          <Grid container spacing={3}>
            <Grid item md={5} sm={12} style={{ marginTop: 20 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid item xs={12}>
                  <TextField
                    type="text"
                    id="to_places"
                    label="Nhập địa chỉ giao hàng"
                    value={address.to}
                    fullWidth
                    placeholder="Nhập địa chỉ chi tiết (số nhà, đường, phường/xã, quận/huyện)"
                    onChange={handleAddressChange('to')}
                    error={!!errors.to_places}
                    helperText={errors.to_places?.message}
                    disabled={!mapLoaded}
                  />
                  <input
                    id="destination"
                    name="destination"
                    type="hidden"
                    value={address.to}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="phone"
                    label="Số điện thoại"
                    value={address.phone}
                    onChange={handleAddressChange('phone')}
                    inputRef={register({
                      required: "Số điện thoại không được để trống",
                      pattern: {
                        value: /^0[1-9]{1}[0-9]{8}$/,
                        message: "Số điện thoại không hợp lệ",
                      },
                    })}
                    fullWidth
                  />
                  {errors.phone?.message && (
                    <FormHelperText style={{ color: "red" }}>
                      {errors.phone?.message}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    multiline
                    rows={3}
                    name="note"
                    label="Ghi chú"
                    value={address.note}
                    onChange={handleAddressChange('note')}
                    inputRef={register}
                    fullWidth
                  />
                </Grid>
                <button
                  type="submit"
                  style={{ marginTop: 10 }}
                  id="btnSubmit"
                  className={isFormValid ? classes.btnReloadMap : classes.btnReloadMapDisable}
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : "Tiếp theo"}
                </button>
              </form>
            </Grid>
            <Grid item md={7} sm={12}>
              <div className={classes.map}>
                {loadMap && (
                  <>
                    <form>
                      <div className="checkout-form-list" hidden>
                        <label>
                          Vị trí cửa hàng <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          name="from"
                          id="from_places"
                          disabled
                          value={from}
                        />
                        <input
                          id="origin"
                          name="origin"
                          type="hidden"
                          value={from}
                        />
                      </div>

                      <div className="checkout-form-list" hidden>
                        <div className="form-group">
                          <label>Travel Mode</label>
                          <select id="travel_mode" name="travel_mode">
                            <option value="DRIVING">DRIVING</option>
                          </select>
                        </div>
                      </div>

                      <div className="order-button-payment">
                        <input
                          onClick={onHandleCheckMap}
                          value="Cập nhật bản đồ"
                          disabled={address.to === ""}
                          className={
                            address.to !== ""
                              ? classes.btnReloadMap
                              : classes.btnReloadMapDisable
                          }
                          type="button"
                        />
                      </div>
                    </form>

                    <div id="mapResult" className={classes.mapResult} style={{ display: showMapResult ? "block" : "none" }}>
                      <div>
                        <label htmlFor="Kilometers">Khoảng cách: </label>&nbsp;
                        <label translate="no" id="in_kilo"></label>
                      </div>
                      <div>
                        <label htmlFor="Duration">Thời gian giao hàng: </label>
                        &nbsp;
                        <label translate="no" id="duration_text"></label>
                      </div>
                      <div>
                        <label htmlFor="Price">Chi phí giao hàng: </label>&nbsp;
                        <label translate="no" id="price_shipping"></label>
                        &nbsp;<label>VNĐ</label>
                      </div>
                    </div>

                    <GoogleMap />
                  </>
                )}
              </div>
            </Grid>
          </Grid>
        </Paper>
      </main>
    </div>
  );
};

export default CheckAddress;
