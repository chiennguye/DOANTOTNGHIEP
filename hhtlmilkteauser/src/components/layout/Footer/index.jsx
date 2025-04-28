import { Grid, Typography } from "@material-ui/core";
import GoogleMap from "../../../common/GoogleMap";

const Footer = () => {
  return (
    <Grid
      container
      style={{
        paddingTop: 10,
        paddingBottom: 5,
        backgroundColor: "#416c48",
        color: "white",
        minHeight: "calc(100vh - 577px)",
      }}
    >
      <Grid item xs={12} md={8} style={{ paddingLeft: 20 + "px" }}>
        <Typography>
          <b>Trụ sở chính: </b>
          Công ty CP HHTLDrip&Chill - ĐKKD: 0316 871719 do sở KHĐT HaNoi cấp lần
          đầu ngày 21/05/2021
        </Typography>
        <Typography>
          <b>Nhà máy: </b>
          Số 8, ngõ 121, Tây Mỗ, Đại Mỗ, Nam Từ Liêm, Hà Nội , Việt Nam
        </Typography>
        <Typography>
          <b>Địa chỉ: </b>
          Số 8, ngõ 121, Tây Mỗ, Đại Mỗ, Nam Từ Liêm, Hà Nội
        </Typography>
        <Typography>
          <b>Điện thoại: </b>
          028 6263 0377 - 6263 0378
        </Typography>
        <Typography>
          <b>Email: </b>
          Info@Drip&Chill.com.vn
        </Typography>
      </Grid>

      <Grid
        item
        xs={12}
        md={4}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <GoogleMap />
      </Grid>
    </Grid>
  );
};

export default Footer;
