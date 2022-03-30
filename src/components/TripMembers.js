import React from "react";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

function TripMembers({ trip, loading, canEdit }) {
  console.log(trip);
  return (
    <Box>
      {canEdit && (
        <Fab
          variant="extended"
          color="secondary"
          sx={{
            position: "fixed",
            bottom: "100px",
            right: "24px",
            zIndex: 10,
            textTransform: "none",
          }}
        >
          <PersonAddIcon />
          <b style={{ marginLeft: "5px" }}>Invite to trip</b>
        </Fab>
      )}
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {trip.users.map((user, i) => (
          <Box key={user.email}>
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                canEdit && !user.owner ? (
                  <IconButton edge="end" aria-label="delete">
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                ) : null
              }
            >
              <ListItemAvatar>
                <Avatar
                  alt={user.username}
                  src="https://source.unsplash.com/random/128x128?bird"
                />
              </ListItemAvatar>
              <ListItemText
                primary={`${user.username} ${user.owner ? "👑" : ""} ${
                  user.viewer_only ? "🔎" : ""
                }`}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {user.email}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            {i !== trip.users.length - 1 && <Divider component="li" />}
          </Box>
        ))}
      </List>
    </Box>
  );
}

// const TripMembers = ({ trip }) => {
//   const { online, api, refresh, canEditTrip } = useAppEnv();
//   const canEdit = canEditTrip(trip) && online;
//   return (
//     <Box p={3}>
//       {canEdit && (
//         <Box>
//           <MemberActionCard
//             link={"/invite_to_trip/" + trip?.trip_id}
//             title={"Invite Member"}
//             desc={"Add someone as a traveller on this trip (can edit)"}
//           />
//           <MemberActionCard
//             link={"/invite_obs_to_trip/" + trip?.trip_id}
//             title={"Invite Observer"}
//             desc={"Add an observer to this trip (view only)"}
//           />
//         </Box>
//       )}
//       {!online && (
//         <Box>
//           <MemberActionCard
//             link={"#"}
//             title={"You're Offline"}
//             desc={"You cannot edit members while offline"}
//           />
//         </Box>
//       )}
//       {trip.users.map((user) => (
//         <Box key={user.email}>
//           <Card sx={{ boxShadow: "rgb(0 0 0 / 13%) 0px 0px 4px" }} p={2} mb={3}>
//             <Flex alignItems="center">
//               <Image
//                 src={"https://source.unsplash.com/random/128x128?bird"}
//                 sx={{
//                   width: 48,
//                   height: 48,
//                   borderRadius: 9999,
//                 }}
//                 mr={3}
//               />
//               <Box>
//                 <Text>
//                   <b>
//                     {user.username} {user.owner && "👑"}
//                     {user.viewer_only && "🔎"}
//                   </b>
//                 </Text>
//                 <Text>{user.email}</Text>
//               </Box>
//               <Box ml="auto" mr={2}>
//                 {online && !user.owner && (
//                   <Text
//                     color="red"
//                     sx={{ cursor: "pointer" }}
//                     onClick={async () => {
//                       if (window.confirm(`Remove ${user.username}?`)) {
//                         await api.post("/api/kick", {
//                           trip_id: trip.trip_id,
//                           email: user.email,
//                         });
//                         refresh();
//                       }
//                     }}
//                   >
//                     <b>X</b>
//                   </Text>
//                 )}
//               </Box>
//             </Flex>
//           </Card>
//         </Box>
//       ))}
//     </Box>
//   );
// };

// let MemberActionCard = ({ link, title, desc }) => {
//   return (
//     <Card
//       sx={{ boxShadow: "rgb(0 0 0 / 13%) 0px 0px 4px", cursor: "pointer" }}
//       w={1 / 2}
//       p={2}
//       mb={3}
//     >
//       <Flex alignItems="center">
//         <Lk to={link} style={{ textDecoration: "none", color: "#000" }}>
//           <Box>
//             <Text>
//               <b>{title}</b>
//             </Text>
//             <Text>{desc}</Text>
//           </Box>
//         </Lk>
//       </Flex>
//     </Card>
//   );
// };

export default TripMembers;
