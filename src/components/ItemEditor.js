import React, { useState, useEffect } from "react";
import { Box, Button, Text, Flex } from "rebass";
import { Label, Input } from "@rebass/forms";
import { SimpleSelect } from "react-selectize";
import { useAppEnv } from "../env";
import { MultiSelect } from "react-selectize";
import { tagToLabel } from "../util";
import { useNavigate } from "react-router-dom";
import FullScreenLink from "./FullScreenLink";
import PhoneInput from "react-phone-number-input";
import DatePicker from "react-datepicker";

let deleteItemProp = (item, setItem, propName) => {
  const newProps = Object.assign({}, item.props);
  delete newProps[propName];
  setItem({
    ...item,
    props: newProps,
  });
};

let setItemProp = (item, setItem, propName, propVal) => {
  const newProps = Object.assign({}, item.props);
  newProps[propName] = propVal;
  setItem({
    ...item,
    props: newProps,
  });
};

let createTextProp = (propKey, name, placeholder) => {
  return {
    name: name,
    addable: true,
    renderEditor: ({ item, setItem }) => (
      <Box>
        <Input
          placeholder={placeholder}
          value={item.props[propKey]}
          onChange={(e) => setItemProp(item, setItem, propKey, e.target.value)}
        />
      </Box>
    ),
    render: ({ item, name, key }) => (
      <Text key={key}>
        <b>{name}</b>: {item.props[key]}
      </Text>
    ),
    defaultValue: "",
  };
};

let createPhoneProp = (propKey, name) => {
  return {
    name: name,
    addable: true,
    renderEditor: ({ item, setItem }) => (
      <Box>
        <PhoneInput
          international
          defaultCountry="US"
          value={item.props[propKey]}
          onChange={(v) => setItemProp(item, setItem, propKey, v)}
        />
      </Box>
    ),
    render: ({ item, name, key }) => (
      <Text key={key}>
        <b>{name}</b>: {item.props[key]}
      </Text>
    ),
    defaultValue: "",
  };
};

let createHTMLProp = (propKey, name, placeholder, openText) => {
  return {
    name: name,
    addable: true,
    renderEditor: ({ item, setItem }) => (
      <Box>
        <Input
          placeholder={placeholder}
          value={item.props[propKey]}
          onChange={(e) => setItemProp(item, setItem, propKey, e.target.value)}
        />
      </Box>
    ),
    render: ({ item, name, key }) => {
      let src = item.props[key];
      src = src.replace("<iframe ", '<iframe style="width: 100%" ');
      return (
        <Text key={key}>
          <b>{name}</b>:{" "}
          <FullScreenLink
            text={openText}
            viewer={() => (
              <iframe
                style={{ width: "100%", height: "100%" }}
                title={item.title}
                srcdoc={src}
              />
            )}
          />
        </Text>
      );
    },
    defaultValue: "",
  };
};

export const PROPS = {
  email: {
    name: "Email",
    addable: false,
    renderEditor: ({ item, setItem }) => (
      <Box color="grey">
        This item was created from an email.{" "}
        <FullScreenLink
          text="Open Email"
          viewer={() => (
            <iframe
              style={{ width: "100%", height: "100%" }}
              title={item.title}
              srcdoc={item.props.email?.html}
            />
          )}
        />
      </Box>
    ),
    render: ({ item, name, key }) => (
      <Text key={key}>
        <b>{name}</b>:{" "}
        <FullScreenLink
          text="Open Email"
          viewer={() => (
            <iframe
              style={{ width: "100%", height: "100%" }}
              title={item.title}
              srcdoc={item.props.email?.html}
            />
          )}
        />
      </Text>
    ),
    defaultValue: {},
  },
  embeddedHTML: createHTMLProp(
    "embeddedHTML",
    "HTML",
    "<iframe ...>",
    "Open HTML"
  ),
  embeddedMap: createHTMLProp("embeddedMap", "Map", "<iframe ...>", "Open Map"),
  desc: createTextProp("desc", "Description", "Description..."),
  confirmation: createTextProp("confirmation", "Confirmation #", "ABC123"),
  note: createTextProp("note", "Note", "Note..."),
  fullname: createTextProp("fullname", "Full Name", "John Smith"),
  emergencyphone: createPhoneProp("emergencyphone", "Emergency Phone"),
  contactphone: createPhoneProp("contactphone", "Contact Phone"),
  date: {
    name: "Date",
    addable: true,
    renderEditor: ({ item, setItem }) => (
      <Box>
        <DatePicker
          withPortal
          selected={new Date(item.props.date)}
          onChange={(date) => setItemProp(item, setItem, "date", "" + date)}
        />
      </Box>
    ),
    render: ({ item, name, key }) => (
      <Text key={key}>
        <b>{name}</b>: {item.props[key].split(" ").slice(0, 4).join(" ")}
      </Text>
    ),
    defaultValue: "" + new Date(),
  },
  datetime: {
    name: "Date & Time",
    addable: true,
    renderEditor: ({ item, setItem }) => (
      <Box>
        <DatePicker
          withPortal
          showTimeInput={true}
          selected={new Date(item.props.datetime)}
          onChange={(date) => setItemProp(item, setItem, "datetime", "" + date)}
        />
      </Box>
    ),
    render: ({ item, name, key }) => (
      <Text key={key}>
        <b>{name}</b>: {item.props[key]}
      </Text>
    ),
    defaultValue: "" + new Date(),
  },
  dateRange: {
    name: "Date Range",
    addable: true,
    renderEditor: ({ item, setItem }) => (
      <Box>
        <DatePicker
          selectsRange
          withPortal
          selected={new Date(item.props.dateRange.split(",")[0])}
          startDate={new Date(item.props.dateRange.split(",")[0])}
          endDate={new Date(item.props.dateRange.split(",")[1])}
          onChange={(dates) => {
            const start =
              dates[0] || new Date(item.props.dateRange.split(",")[0]);
            const end =
              dates[1] || new Date(item.props.dateRange.split(",")[1]);
            setItemProp(item, setItem, "dateRange", `${start},${end}`);
          }}
        />
      </Box>
    ),
    render: ({ item, name, key }) => (
      <Text key={key}>
        <b>{name}</b>:{" "}
        {item.props[key].split(",")[0].split(" ").slice(0, 4).join(" ")} to{" "}
        {item.props[key].split(",")[1].split(" ").slice(0, 4).join(" ")}
      </Text>
    ),
    defaultValue: `${new Date()},${new Date(Date() + 1000 * 60 * 60 * 24)}`,
  },
};

const ItemEditor = ({ trip, item, newItem }) => {
  const [loading, setLoading] = useState(false);
  const { api, refresh } = useAppEnv();
  const [editItem, setEditItem] = useState(item);
  useEffect(() => {
    setEditItem(item);
  }, [item]);
  const propNames = Object.keys(PROPS);
  const allTags =
    trip.items.reduce((acc, cur) => {
      for (let tag of cur.tags) {
        if (!acc.includes(tag)) {
          acc.push(tag);
        }
        return acc;
      }
    }, []) || [];
  const nav = useNavigate();
  return (
    <Box p={2}>
      <Box pb={2}>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="Item Title"
          value={editItem.title}
          onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
        />
      </Box>
      <hr />
      <Box>
        <Label htmlFor="tags">Tags</Label>
        <MultiSelect
          name="tags"
          style={{ width: "100%" }}
          placeholder={"Tags"}
          defaultValues={editItem.tags.map((tag) => ({
            value: tag,
            label: tagToLabel(tag),
          }))}
          options={allTags.map((tag) => ({
            value: tag,
            label: tagToLabel(tag),
          }))}
          onValuesChange={(newVal) =>
            setEditItem({ ...editItem, tags: newVal.map((v) => v.value) })
          }
          createFromSearch={(opts, val, query) => {
            return { value: query, label: tagToLabel(query) };
          }}
        />
      </Box>
      <hr />
      <Box py={2}>
        {propNames
          .filter((fieldName) =>
            Object.keys(editItem.props).includes(fieldName)
          )
          .map((propName) => {
            const FieldEditor = PROPS[propName].renderEditor;
            return (
              <>
                <Label htmlFor={propName}>{PROPS[propName].name}</Label>
                <Flex alignItems="center" name={propName}>
                  <FieldEditor
                    key={propName}
                    item={editItem}
                    setItem={(newItem) => setEditItem(newItem)}
                  />
                  <Text
                    fontSize="1.5em"
                    ml="auto"
                    color="red"
                    sx={{ cursor: "pointer" }}
                    onClick={() => deleteItemProp(item, setEditItem, propName)}
                  >
                    <b>X</b>
                  </Text>
                </Flex>
                <hr />
              </>
            );
          })}
      </Box>
      <Box>
        <SimpleSelect
          style={{ width: "100%" }}
          placeholder="Add Field"
          onValueChange={({ value }) => {
            setEditItem({
              ...editItem,
              props: { ...editItem.props, [value]: PROPS[value].defaultValue },
            });
          }}
          value={null}
        >
          {propNames
            .filter(
              (fieldName) =>
                PROPS[fieldName].addable &&
                !Object.keys(editItem.props).includes(fieldName)
            )
            .map((fieldName) => (
              <option key={fieldName} value={fieldName}>
                {PROPS[fieldName].name}
              </option>
            ))}
        </SimpleSelect>
      </Box>
      <Box mt={4}>
        {!loading && newItem && (
          <Button
            sx={{ cursor: "pointer" }}
            onClick={async () => {
              setLoading(true);
              await api.post("/api/items?trip_id=" + trip.trip_id, editItem);
              refresh();
              nav("/trips/" + trip.trip_id);
            }}
            bg="#07c"
          >
            Create
          </Button>
        )}
        {!loading && !newItem && (
          <Button
            sx={{ cursor: "pointer" }}
            onClick={async () => {
              setLoading(true);
              await api.put("/api/items?item_id=" + item.item_id, editItem);
              refresh();
              nav("/trips/" + trip.trip_id);
            }}
            bg="#07c"
          >
            Save Changes
          </Button>
        )}
        {!loading && !newItem && (
          <Button
            ml={2}
            sx={{ cursor: "pointer" }}
            onClick={async () => {
              if (
                !window.confirm(
                  "Are you sure you want to delete this? It cannot be undone."
                )
              ) {
                return;
              }
              setLoading(true);
              await api.del("/api/items?item_id=" + item.item_id);
              refresh();
              nav("/trips/" + trip.trip_id);
            }}
            bg="red"
          >
            Delete
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ItemEditor;
