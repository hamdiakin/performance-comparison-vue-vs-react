import React from "react";
import { Route, Routes } from "react-router-dom";
import List from "./components/List";
import ItemDetail from "./components/ItemDetail";
import WrongRoute from "./components/WrongRoute";
import EditItem from "./components/EditItem";
import DataGrid from "./components/DataGrid";


function App() {
  return (
    <div className="container mx-auto p-4">
      <Routes>
        {/* Route for the list page */}
        <Route path="/" element={<List />}>
          {" "}
        </Route>
        {/* <Route path="/item:id" element={<ItemDetail />}></Route>  */}
        <Route path="/item/:id" element={<ItemDetail />}></Route>
        <Route path="/item/:id/edit" element={<EditItem />}></Route>
        <Route path="/datagrid" element={<DataGrid />}></Route>
        <Route path="*" element={<WrongRoute />}></Route>
      </Routes>
    </div>
  );
}

export default App;
