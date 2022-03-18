import React, { useState } from "react";
import { Box, Flex, Button, Text } from "rebass";
import { Label, Input } from "@rebass/forms";
import { useAppEnv } from "../env";

const Login = () => {
  const { api } = useAppEnv();
  const [email, setEmail] = useState("");
  const [polling, setPolling] = useState(false);
  return (
    <Box>
      <Box
        sx={{
          maxWidth: 512,
          pt: "2em",
          mx: "auto",
          px: 3,
        }}
      >
        <Text fontSize={"2em"}>TripBox</Text>
        {!polling && (
          <Box as="form" onSubmit={(e) => e.preventDefault()} py={3}>
            <Flex mx={-2} mb={3}>
              <Box width={1} px={2}>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                />
              </Box>
            </Flex>
            <Flex mx={-2} flexWrap="wrap">
              <Box px={2} ml="auto">
                <Button
                  bg="#07c"
                  onClick={async () => {
                    await api.post("/api/login", { email: email });
                    setPolling(true);
                    setInterval(async () => {
                      const pollResp = await api.get("/api/auth_poll");
                      if (pollResp.success) {
                        window.location.href = "/";
                      }
                    }, 1000);
                  }}
                >
                  Login (or sign up)
                </Button>
              </Box>
            </Flex>
          </Box>
        )}
        {polling && (
          <Box py={3}>
            <Text>
              Waiting for login... check your email. <a href="/">Try again</a>
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Login;
