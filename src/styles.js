
/*const cssMerge = (array) => {
  return array.reduce( (item, accum) => {
    accum += "px" + " " + item + "px";
    return accum.slice(-2) === "px"? accum : accum + "px";
  } );
} incorrect as css does not format like this*/

const chordButtonSize = 60;
const naturalWidth = 50;
const naturalHeight = 200;
const naturalMarginRL = 2;
const naturalBorderRL = 1;
const naturalBorderUD = 2;
const sharpWidth = naturalWidth * 3/5;
const sharpHeight = naturalHeight * 3/5;
//const sharpOffset = naturalWidth - sharpWidth/2;
const naturalKeys = ["C", "D", "E", "F", "G", "A", "B"];
const sharpPositions = [
  ((naturalKeys.indexOf("C")+1) * naturalWidth) + (1*2*naturalMarginRL) + (1*2*naturalBorderRL) - sharpWidth/2,
  ((naturalKeys.indexOf("D")+1) * naturalWidth) + (2*2*naturalMarginRL) + (2*2*naturalBorderRL) - sharpWidth/2,
  ((naturalKeys.indexOf("F")+1) * naturalWidth) + (4*2*naturalMarginRL) + (4*2*naturalBorderRL) - sharpWidth/2,
  ((naturalKeys.indexOf("G")+1) * naturalWidth) + (5*2*naturalMarginRL) + (5*2*naturalBorderRL) - sharpWidth/2,
  ((naturalKeys.indexOf("A")+1) * naturalWidth) + (6*2*naturalMarginRL) + (6*2*naturalBorderRL) - sharpWidth/2,
];

//general styles:

const general = {

  sharps: {
    textAlign: "center",
    position: "absolute",
    display: "inline-block",
    zIndex: "5",
    color: "white",
    backgroundColor: "black",
    height: sharpHeight,
    width: sharpWidth,
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: "2px 1px"
  }

}

//specific styles, mostly broken into modules:

export const appStyles = {
  textAlign: "center",
  boxSizing: "border-box",
  userSelect: "none", //disables drag and drop function on some elements
  backgroundColor: "#282c34",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "#000000",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "calc(10px + 2vmin)",
  color: "white"
}

export const chordPadStyles = {

  container: {
    display: 'inline-block',
    marginBottom: '8px'
  },

  button: {

    inactive: {
      backgroundColor: 'hsl(200, 70%, 65%)',
      textAlign: 'center',
      display: 'inline-block',
      height: '100%',
      width: '100%'
    },

    active: {
        backgroundColor: '#FF0000',
        textAlign: 'center',
        display: 'inline-block',
        height: '100%',
        width: '100%'
    }

  }

}

export const synthParentStyles = {
  backgroundColor: "#505050",
  display: "inline-block",
  position: "relative",
  padding: "4px 4px"
}


export const synthSelectStyles = {
  label: {}
}


export const synthKeysStyles = {

  keysContainer: {
    display: "inline-block",
    backgroundColor: "#505050"
  },

  octaveContainer: {
    backgroundColor: "#505050",
    position: "relative",
    display: "inline-block",
    padding: 0
  },

  keyIsActive: {
    backgroundColor: "#00FF00"
  },

  naturals: {
    textAlign: "center",
    position: "relative",
    display: "inline-block",
    color: "black",
    backgroundColor: "white",
    height: naturalHeight,
    width: naturalWidth,
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: naturalBorderUD + "px " + naturalBorderRL + "px",
    margin: "0px " + naturalMarginRL + "px"
  },

  sharps: {

    Csh: {
      ...general.sharps,
      left: sharpPositions[0]
    },

    Dsh: {
      ...general.sharps,
      left: sharpPositions[1]
    },

    Fsh: {
      ...general.sharps,
      left: sharpPositions[2]
    },

    Gsh: {
      ...general.sharps,
      left: sharpPositions[3]
    },

    Ash: {
      ...general.sharps,
      left: sharpPositions[4]
    }

  }

}
