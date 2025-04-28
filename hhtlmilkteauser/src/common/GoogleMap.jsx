import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
    map: {
        border: 0,
        width: 400,
        heigth: 200,
        [theme.breakpoints.down("md")]: {
            width: 300,
            heigth: 200,
        },
    }
}))

const GoogleMap = () => {
    const classes = useStyles();

    return (
        <div>
            <iframe 
                title="map" 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.4854095468064!2d105.76814867605983!3d21.003460880636373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab86cece9ac1%3A0xa9bc04e04602dd85!2zTmfDtSAxMjEgxJAuIFTDonkgTeG7lSwgxJDhuqFpIE3hu5csIE5hbSBU4burIExpw6ptLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1710400877045!5m2!1svi!2s" 
                className={classes.map} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
            />
        </div>
    );
}

export default GoogleMap