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
  desc: createTextProp("desc", "Description", "Description..."),
  confirmation: createTextProp("confirmation", "Confirmation #", "ABC123"),
  note: createTextProp("note", "Note", "Note..."),
  fullname: createTextProp("fullname", "Full Name", "John Smith"),
  emergencyphone: createPhoneProp("emergencyphone", "Emergency Phone"),
  contactphone: createPhoneProp("contactphone", "Contact Phone"),
};

const ItemEditor = ({ trip, item }) => {
  const [loading, setLoading] = useState(false);
  const { api, refresh } = useAppEnv();
  const [editItem, setEditItem] = useState(item);
  useEffect(() => {
    setEditItem(item);
  }, [item]);
  const propNames = Object.keys(PROPS);
  const allTags = trip.items.reduce((acc, cur) => {
    for (let tag of cur.tags) {
      if (!acc.includes(tag)) {
        acc.push(tag);
      }
      return acc;
    }
  }, []);
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
                    item={item}
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
        {!loading && (
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
      </Box>
    </Box>
  );
};

export default ItemEditor;
