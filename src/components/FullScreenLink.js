import React, { useState } from "react";
import { Box, Flex, Text } from "rebass";

const FullScreenViewer = ({ text, viewer }) => {
  const [open, setOpen] = useState(false);
  const Page = viewer;
  if (!open) {
    return (
      <Text
        color="blue"
        sx={{ cursor: "pointer", textDecoration: "underline" }}
        display="inline"
        onClick={() => setOpen(true)}
      >
        {text}
      </Text>
    );
  }
  return (
    <Box
      sx={{
        background: "#fff",
        position: "absolute",
        zIndex: 999,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <Flex
        px={2}
        color="white"
        bg="black"
        alignItems="center"
        justifyContent="space-between"
      >
        <Text
          p={2}
          fontWeight="bold"
          sx={{ cursor: "pointer" }}
          onClick={() => setOpen(false)}
        >
          {"X"}
        </Text>
      </Flex>
      <Page />
    </Box>
  );
};

export default FullScreenViewer;
