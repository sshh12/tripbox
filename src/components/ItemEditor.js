import React, { useState, useEffect } from "react";
import { Box, Button, Text, Flex } from "rebass";
import { Label, Input, Textarea } from "@rebass/forms";
import { SimpleSelect } from "react-selectize";
import { useAppEnv } from "../env";

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

export const PROPS = {
  email: {
    name: "Email",
    addable: false,
    renderEditor: ({ item, setItem }) => (
      <Box color="grey">This item was created from an email.</Box>
    ),
    render: ({ item }) => (
      <iframe
        style={{ width: "100%" }}
        title={item.title}
        srcdoc={item.props.email?.html}
      />
    ),
    defaultValue: {},
  },
  desc: {
    name: "Description",
    addable: true,
    renderEditor: ({ item, setItem }) => (
      <Box>
        <Textarea
          placeholder="..."
          value={item.props.desc}
          onChange={(e) => setItemProp(item, setItem, "desc", e.target.value)}
        />
      </Box>
    ),
    render: ({ item }) => <Text>{item.props.desc}</Text>,
    defaultValue: "",
  },
  confirmation: {
    name: "Confirmation #",
    addable: true,
    renderEditor: ({ item, setItem }) => (
      <Box>
        <Input
          placeholder="ABC123"
          value={item.props.confirmation}
          onChange={(e) =>
            setItemProp(item, setItem, "confirmation", e.target.value)
          }
        />
      </Box>
    ),
    render: ({ item, name, key }) => (
      <Text>
        <b>{name}</b>: {item.props.confirmation}
      </Text>
    ),
    defaultValue: "",
  },
};

const ItemEditor = ({ trip, item }) => {
  const { api, refresh } = useAppEnv();
  const [editItem, setEditItem] = useState(item);
  useEffect(() => {
    setEditItem(item);
  }, [item]);
  const fieldNames = Object.keys(PROPS);
  fieldNames.sort((a, b) => a.localeCompare(b));
  return (
    <Box p={2}>
      <Box pb={2}>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="text"
          type="title"
          placeholder="Item Title"
          value={editItem.title}
          onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
        />
      </Box>
      <hr />
      <Box py={2}>
        {fieldNames
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
          {fieldNames
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
        <Button
          sx={{ cursor: "pointer" }}
          onClick={async () => {
            await api.put("/api/items?item_id=" + item.item_id, editItem);
            refresh();
          }}
          bg="#07c"
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default ItemEditor;
