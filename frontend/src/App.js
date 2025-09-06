import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Home from "./pages/Home.tsx";
import "./App.css";
import Dashboard from "./pages/community/Dashboard.tsx";
import Search from "./pages/Search.tsx";
import Sheet from "./pages/Sheet.tsx";
import Profile from "./pages/user/Profile.tsx";
import UserSheets from "./pages/user/UserSheets.tsx";
import EditProfile from "./pages/user/EditProfile.tsx";
import UserSheetsAnnual from "./pages/user/UserSheetsAnnual.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search/:params" element={<Search />} />
          <Route path="sheet/:sheetId" element={<Sheet />} />

          <Route path=":uid">
            <Route index element={<Profile />} />
            <Route path="sheets" element={<UserSheets />} />
            <Route path="sheetsAnnual" element={<UserSheetsAnnual />} />
            <Route path="edit" element={<EditProfile />} />
          </Route>

          <Route path="community">
            <Route index element={<Dashboard />}></Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
