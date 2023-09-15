import { createSignal } from 'solid-js';
import { Routes, Route, A } from "@solidjs/router";

import banner from './assets/banner.png';
import Home from './pages/Home';


import { useCartContext } from "./context/CartContext";
import DataGrid from './pages/DataGrid';
import EditItem from './pages/EditItem';
import ItemDetail from './pages/ItemDetail';
import List from './pages/List';
import ListItem from './pages/ListItem';
import WrongRoute from './pages/WrongRoute';
import LandingPage from './pages/LandingPage';


function App() {
  const [darkTheme, setDarkTheme] = createSignal(false)

  

  const { items } = useCartContext()

  const quantity = () => {
    return items.reduce((acc, current) => {
      return acc + current.quantity
    }, 0)
  }

  return (
    <div class="container m-auto bg">
      <header
        class="my-4 p-2 text-xl flex items-center gap-4 justify-end"
      >


      </header>
      
      

      <Routes>
      <Route path="/" component={LandingPage} />
        <Route path="/DataGrid" component={DataGrid} />
        <Route path="/item/:id/edit" component={EditItem} />
        <Route path="/item/:id" component={ItemDetail} />
        <Route path="/List" component={List} />
        <Route path="*" component={WrongRoute} />
        
        
      </Routes>
      
    </div>
  );
}

export default App;
