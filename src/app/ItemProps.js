import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ListItemText from "@mui/material/ListItemText";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ErrorIcon from "@mui/icons-material/Error";
import Button from "@mui/material/Button";

const ITEM_PROPS = {
  confirmation: {
    icon: ConfirmationNumberIcon,
    title: "Confirmation Code",
    renderInList: ({ trip, item, propDef, value }) => (
      <ListItemText secondary={propDef.title} primary={"asd"} />
    ),
  },
  contactphone: {
    icon: PhoneIcon,
    title: "Contact Phone",
    renderInList: ({ trip, item, propDef, value }) => (
      <ListItemText secondary={propDef.title} primary={value} />
    ),
  },
  emergencyphone: {
    icon: ErrorIcon,
    title: "Emergency Phone",
    renderInList: ({ trip, item, propDef, value }) => (
      <ListItemText secondary={propDef.title} primary={value} />
    ),
  },
  email: {
    icon: EmailIcon,
    title: "Email",
    renderInList: ({ trip, item, propDef, value }) => (
      <ListItemText primary={<Button variant="text">Open Email</Button>} />
    ),
  },
};

export default ITEM_PROPS;
