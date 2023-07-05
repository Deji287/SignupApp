import "./App.css";
import { Routes, Route } from "react-router-dom";

// import all components
import Username from "./components/Username";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Password from "./components/Password";
import Reset from "./components/Reset";
import Recovery from "./components/Recovery";
import PageNotFound from "./components/PageNotFound";

import { AuthorizeUser, ProtectRoute } from "./middleware/auth";

function App() {
  return (
    <div className="App">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Routes>
        <Route path="/" element={<Username />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route
          path="/password"
          element={
            <ProtectRoute>
              <Password />
            </ProtectRoute>
          }
        ></Route>
        <Route path="/reset" element={<Reset />}></Route>
        <Route path="/recovery" element={<Recovery />}></Route>
        <Route
          path="/profile"
          element={
            <AuthorizeUser>
              <Profile />
            </AuthorizeUser>
          }
        ></Route>
        <Route path="*" element={<PageNotFound />}></Route>
      </Routes>
    </div>
  );
}

export default App;
