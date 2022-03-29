import React, { useState } from "react";
import { useAppEnv } from "../app/env";

import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LoadingButton from "@mui/lab/LoadingButton";

const Login = () => {
  const { api, online } = useAppEnv();
  const [email, setEmail] = useState("");
  const [polling, setPolling] = useState(false);
  const onLogin = async () => {
    await api.post("/api/login", { email: email });
    setPolling(true);
    setInterval(async () => {
      const { data: pollResp } = await api.get("/api/auth_poll");
      if (pollResp.success) {
        window.location.href = "/";
      }
    }, 1000);
  };
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          TripBox
        </Typography>
        <Link href="https://github.com/sshh12/tripbox" variant="body2">
          What is tripbox?
        </Link>
        <Box sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
          />
          {polling && (
            <Typography variant="caption" display="block">
              Waiting for email verification... check your email.{" "}
              <a href="/">Try again</a>
            </Typography>
          )}
          {!online && (
            <LoadingButton
              disabled={true}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              You are offline
            </LoadingButton>
          )}
          {online && (
            <LoadingButton
              onClick={onLogin}
              loading={polling}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In / Sign Up
            </LoadingButton>
          )}
        </Box>
      </Box>
    </Container>
  );
  return (
    <>Test</>
    // <Box>
    //   <Box
    //     sx={{
    //       maxWidth: 512,
    //       pt: "2em",
    //       mx: "auto",
    //       px: 3,
    //     }}
    //   >
    //     <Text fontSize={"2em"}>TripBox</Text>
    //     {!polling && (
    //       <Box as="form" onSubmit={(e) => e.preventDefault()} py={3}>
    //         <Flex mx={-2} mb={3}>
    //           <Box width={1} px={2}>
    //             <Label htmlFor="email">Email</Label>
    //             <Input
    //               id="email"
    //               name="email"
    //               value={email}
    //               onChange={(e) => setEmail(e.target.value)}
    //               placeholder="name@email.com"
    //             />
    //           </Box>
    //         </Flex>
    //         <Flex mx={-2} flexWrap="wrap">
    //           <Box px={2} ml="auto">
    //             {online && (
    //               <Button
    //                 bg="#07c"
    //                 onClick={async () => {
    //                   await api.post("/api/login", { email: email });
    //                   setPolling(true);
    //                   setInterval(async () => {
    //                     const { data: pollResp } = await api.get(
    //                       "/api/auth_poll"
    //                     );
    //                     if (pollResp.success) {
    //                       window.location.href = "/";
    //                     }
    //                   }, 1000);
    //                 }}
    //               >
    //                 Login (or sign up)
    //               </Button>
    //             )}
    //             {!online && (
    //               <Button bg="grey">You must be online to login.</Button>
    //             )}
    //           </Box>
    //         </Flex>
    //       </Box>
    //     )}
    //     {polling && (
    //       <Box py={3}>
    //         <Text>
    //           Waiting for login... check your email. <a href="/">Try again</a>
    //         </Text>
    //       </Box>
    //     )}
    //   </Box>
    // </Box>
  );
};

export default Login;
