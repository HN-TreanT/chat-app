import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "react-notifications-component/dist/theme.css";
import { store, persistor } from "./redux";
import { Route, Routes, BrowserRouter, Navigate, Router } from "react-router-dom";
import RouterLinks from "./const/router_link";
import { ReactNotifications } from "react-notifications-component";
import LoginPage from "./page/login-page/loginPage";
import RegisterPage from "./page/register-page/registerPage";
import HomePage from "./page/home-page/HomePage";
import { AuthorizationComponent } from "./components/authorization/AuthorizationComponent";
import { socket1, AppContext } from "./context/appContext";
function App() {
  return (
    <>
      <ReactNotifications />
      <AppContext.Provider value={{ socket1 }}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <div className="MainApp">
              <div className="MainContent">
                <div className="ContentPage">
                  <Routes>
                    {/* <Route path="/" element={<Navigate to={RouterLinks.LOGIN_PAGE} />} /> */}
                    <Route
                      path={RouterLinks.HOME_PAGE}
                      element={<AuthorizationComponent element={<HomePage />} />}
                    />
                    <Route path={RouterLinks.LOGIN_PAGE} element={<LoginPage />} />
                    <Route path={RouterLinks.REGISTER_PAGE} element={<RegisterPage />} />
                  </Routes>
                </div>
              </div>
            </div>
          </PersistGate>
        </Provider>
      </AppContext.Provider>
    </>
  );
}

export default App;
