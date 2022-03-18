import React from "react";
import TripModel from "../components/TripModal";
import ItemEditor from "../components/ItemEditor";

const ItemEdit = () => {
  return (
    <TripModel
      renderTitle={({ item }) => `Edit ${item.title}`}
      contents={({ trip, item }) => <ItemEditor trip={trip} item={item} />}
    />
  );
};

export default ItemEdit;
