import { BrowserRouter, Routes, Route } from "react-router";

function App(){
    return (
      <div>
        <BrowserRouter>
            <Routes>
                <Route path = "/" element = {<h1>Home</h1>} ></Route>
                <Route path = "/Contact" element = {<h1>Contact</h1>} ></Route>
                <Route path = "/About" element = {<h1>About</h1>} ></Route>
                <Route path = "/Search" element = {<h1>Search</h1>} ></Route>
                <Route path = "/view/:productId" element = {<h1>View</h1>} ></Route>
                <Route path = "*" element = {<h1>No Page</h1>} ></Route>
                
            </Routes>
        </BrowserRouter>
      </div>
      )
}
