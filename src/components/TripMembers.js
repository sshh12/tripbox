import React from "react";

import Box from "@mui/material/Box";

function TripMembers({ trip, loading, canEdit }) {
  return <Box></Box>;
}

// import { Box, Flex, Text, Card } from "rebass";
// import { Link as Lk } from "react-router-dom";
// import { tagToColor, tagToLabel } from "../util";
// import CopyInput from "../components/CopyInput";
// import { useAppEnv } from "../env";
// import { PROPS } from "../components/ItemEditor";

// const TripItems = ({ trip }) => {
//   const { online, canEditTrip } = useAppEnv();
// const itemsByTag = {};
// for (let item of trip.items) {
//   const itemTags = item.tags.length > 0 ? item.tags : ["Untagged"];
//   for (let tag of itemTags) {
//     if (!(tag in itemsByTag)) {
//       itemsByTag[tag] = [];
//     }
//     itemsByTag[tag].push(item);
//   }
// }
//   const tagsSorted = Object.keys(itemsByTag);
//   tagsSorted.sort((a, b) => a.localeCompare(b));
//   const canEdit = canEditTrip(trip) && online;
//   return (
//     <Box p={3}>
//       {canEdit && (
//         <Box>
//           <Card
//             sx={{ boxShadow: "rgb(0 0 0 / 13%) 0px 0px 4px" }}
//             w={1 / 2}
//             p={2}
//             mb={3}
//           >
//             <Flex alignItems="center">
//               <Box>
//                 <Lk
//                   to={"/add_to_trip/" + trip.trip_id}
//                   style={{ textDecoration: "none", color: "#000" }}
//                 >
//                   <Text>
//                     <b>Add Item</b>
//                   </Text>
//                 </Lk>
//                 <Text>
//                   Add a confirmation, receipt, etc to this trip. You can also
//                   forward emails directly to:{" "}
//                   <CopyInput mt={1} name={"email"} value={trip.inbox_email} />
//                 </Text>
//               </Box>
//               <Box ml="auto" mr={2} pl={4}>
//                 <Lk
//                   to={"/add_to_trip/" + trip.trip_id}
//                   style={{ textDecoration: "none", color: "#000" }}
//                 >
//                   <Text fontSize={"2em"}>
//                     <b>+</b>
//                   </Text>
//                 </Lk>
//               </Box>
//             </Flex>
//           </Card>
//         </Box>
//       )}
//       {tagsSorted.map((tag) => (
//         <Box key={tag}>
//           <TagCard trip={trip} tag={tag} items={itemsByTag[tag]} />
//         </Box>
//       ))}
//     </Box>
//   );
// };

// const TagCard = ({ trip, tag, items }) => {
//   const { api } = useAppEnv();
//   const expandKey = `${trip.trip_id}:${tag}:expand`;
//   const defaultExpand = api.getKey(expandKey);
//   const [expanded, _setExpanded] = useState(
//     defaultExpand === null ? 1 : defaultExpand
//   );
//   const setExpanded = (val) => {
//     _setExpanded(val);
//     api.setKey(expandKey, val);
//   };
//   return (
//     <Card sx={{ boxShadow: "rgb(0 0 0 / 13%) 0px 0px 4px" }} p={0} mb={3}>
//       <Flex
//         color={"#fff"}
//         bg={tagToColor(tag)}
//         width={1}
//         p={1}
//         alignItems="center"
//       >
//         <Text>
//           <b>{tagToLabel(tag)}</b>
//         </Text>
//         <Text
//           ml="auto"
//           onClick={() => setExpanded((expanded + 1) % 3)}
//           sx={{ cursor: "pointer" }}
//         >
//           {expanded === 0 && <b>[+]</b>}
//           {expanded === 1 && <b>[+]</b>}
//           {expanded === 2 && <b>[-]</b>}
//         </Text>
//       </Flex>
//       <Flex alignItems="center" px={expanded === 2 ? 1 : 0}>
//         {expanded === 1 && (
//           <Box>
//             <ul style={{ paddingLeft: "30px" }}>
//               {items.map((item) => (
//                 <li key={item.item_id}>{item.title}</li>
//               ))}
//             </ul>
//           </Box>
//         )}
//         {expanded === 2 && (
//           <Box width={1}>
//             {items.map((item) => (
//               <ItemCard trip={trip} tag={tag} key={item.item_id} item={item} />
//             ))}
//           </Box>
//         )}
//       </Flex>
//     </Card>
//   );
// };

// const ItemCard = ({ trip, item }) => {
//   const { online } = useAppEnv();
//   return (
//     <Card width={1} p={1} sx={{ boxShadow: "rgb(0 0 0 / 13%) 0px 0px 4px" }}>
//       <Flex
//         color={"#000"}
//         width={1}
//         p={1}
//         alignItems="center"
//         justifyContent={"space-between"}
//       >
//         <Text width={0.8}>
//           <b>{item.title}</b>
//         </Text>
//         <Text textAlign="right" ml={"auto"} width={0.2}>
//           {online && (
//             <Lk
//               to={`/trips/${trip.trip_id}/edit_item/${item.item_id}`}
//               style={{ textDecoration: "none" }}
//             >
//               <b>✏️</b>
//             </Lk>
//           )}
//         </Text>
//       </Flex>
//       <Box pl={3} pb={2}>
//         {Object.keys(item.props).map((propName) => {
//           return PROPS[propName].render({
//             item: item,
//             name: PROPS[propName].name,
//             key: propName,
//           });
//         })}
//       </Box>
//     </Card>
//   );
// };

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
