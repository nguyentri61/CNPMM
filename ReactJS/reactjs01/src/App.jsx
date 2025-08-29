import { Spin } from "antd";
import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "./components/context/auth.context";
import Header from "./components/layout/header";
import axios from "./util/axios.customize";

function App() {
  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      try {
        const res = await axios.get("/v1/api/user");
        console.log("App.jsx user response:", res);

        if (res && res.EC === 0 && res.DS && res.DS.length > 0) {
          // Lấy user đầu tiên từ danh sách hoặc tìm user hiện tại
          const currentUser = res.DS.find(user =>
            user.email === localStorage.getItem("user_email") ||
            user.name === localStorage.getItem("user_name")
          ) || res.DS[0];

          setAuth({
            isAuthenticated: true,
            user: {
              email: currentUser.email,
              name: currentUser.name,
            },
          });
        }
      } catch (error) {
        console.log("Error fetching user:", error);
      }
      setAppLoading(false);
    };
    fetchAccount();
  }, []);

  return (
    <div>
      {appLoading === true ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spin />
        </div>
      ) : (
        <>
          <Header />
          <Outlet />
        </>
      )}
    </div>
  );
}

export default App;