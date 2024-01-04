import SvgIcon from "@mui/material/SvgIcon";
import DirectionsBusFilledTwoToneIcon from "@mui/icons-material/DirectionsBusFilledTwoTone";

export const BusIcon = (props) => {
  const { color } = props;
  return (
    <SvgIcon sx={{ color: color }}>
      <DirectionsBusFilledTwoToneIcon />
    </SvgIcon>
  );
};
