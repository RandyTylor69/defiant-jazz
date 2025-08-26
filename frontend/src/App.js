import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import "./App.css";
import Dashboard from "./pages/community/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="community">
            <Route index element={<Dashboard />}></Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
