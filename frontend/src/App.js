import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Home from "./pages/Home.tsx";
import "./App.css";
import Dashboard from "./pages/community/Dashboard.tsx";
import Search from "./pages/Search.tsx";
import Sheet from "./pages/Sheet.tsx";
import Profile from "./pages/Profile.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search/:params" element={<Search />} />
          <Route path="sheet/:sluggedFullName" element={<Sheet />} />
          <Route path=":displayName" element={<Profile />} />

          <Route path="community">
            <Route index element={<Dashboard />}></Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

