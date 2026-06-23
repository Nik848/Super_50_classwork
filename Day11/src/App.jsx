import { BrowserRouter, Routes, Route } from "react-router";
import { ROUTES } from "@/constants";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import SearchPage from "@/pages/SearchPage";
import ViewPage from "@/pages/ViewPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.SEARCH} element={<SearchPage />} />
          <Route path="/view/:id" element={<ViewPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
