import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Home from "./pages/Home.tsx";
import "./App.css";
import Dashboard from "./pages/community/Dashboard.tsx";
import Search from "./pages/Search.tsx";
import Sheet from "./pages/Sheet.tsx";

function App() {
  return (
    <BrowserRouter forceRefresh={true}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search/:params" element={<Search />} />
          <Route path="sheet/:title/:composer" element={<Sheet />} />

          <Route path="community">
            <Route index element={<Dashboard />}></Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
