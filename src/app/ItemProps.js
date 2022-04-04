import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ListItemText from "@mui/material/ListItemText";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ErrorIcon from "@mui/icons-material/Error";
import Button from "@mui/material/Button";
import FullScreenLink from "../components/FullScreenLink";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

const modifyItemProp = (item, propKey, value) => {
  return { ...item, props: { ...item.props, [propKey]: value } };
};

const deleteItemProp = (item, propKey) => {
  let newProps = Object.assign({}, item.props);
  delete newProps[propKey];
  return { ...item, props: newProps };
};

const ITEM_PROPS = {
  confirmation: {
    icon: ConfirmationNumberIcon,
    title: "Confirmation Code",
    defaultValue: "",
    addable: true,
    renderInList: ({ trip, item, propDef, value }) => (
      <ListItemText secondary={propDef.title} primary={value} />
    ),
    renderInListEditor: ({ trip, item, propDef, value, setEditItem }) => (
      <ListItemText
        primary={
          <TextField
            label={propDef.title}
            variant="standard"
            placeholder="A1B2C3"
            value={value}
            onChange={(e) =>
              setEditItem(modifyItemProp(item, "confirmation", e.target.value))
            }
          />
        }
      />
    ),
  },
  contactphone: {
    icon: PhoneIcon,
    title: "Contact Phone",
    defaultValue: "",
    addable: true,
    renderInList: ({ trip, item, propDef, value }) => (
      <ListItemText secondary={propDef.title} primary={value} />
    ),
    renderInListEditor: ({ trip, item, propDef, value }) => (
      <ListItemText secondary={propDef.title} primary={value} />
    ),
  },
  emergencyphone: {
    icon: ErrorIcon,
    title: "Emergency Phone",
    defaultValue: "",
    addable: true,
    renderInList: ({ trip, item, propDef, value }) => (
      <ListItemText secondary={propDef.title} primary={value} />
    ),
    renderInListEditor: ({ trip, item, propDef, value }) => (
      <ListItemText secondary={propDef.title} primary={value} />
    ),
  },
  email: {
    icon: EmailIcon,
    title: "Email",
    defaultValue: "",
    addable: false,
    renderInList: ({ trip, item, propDef, value }) => (
      <ListItemText
        primary={
          <FullScreenLink
            opener={({ onClick }) => (
              <Button onClick={onClick} variant="text">
                Open Email
              </Button>
            )}
            viewer={() => (
              <iframe
                style={{ width: "100%", height: "100%" }}
                title={propDef.title}
                srcdoc={value.html}
              />
            )}
          />
        }
      />
    ),
    renderInListEditor: ({ trip, item, propDef, value, setEditItem }) => (
      <ListItemText
        primary={
          <Box>
            <FullScreenLink
              opener={({ onClick }) => (
                <Button onClick={onClick} variant="text">
                  Open Email
                </Button>
              )}
              viewer={() => (
                <iframe
                  style={{ width: "100%", height: "100%" }}
                  title={propDef.title}
                  srcdoc={value.html}
                />
              )}
            />
            <Button
              onClick={() => setEditItem(deleteItemProp(item, "email"))}
              variant="text"
              color="error"
            >
              Remove Email
            </Button>
          </Box>
        }
      />
    ),
  },
};

export default ITEM_PROPS;
