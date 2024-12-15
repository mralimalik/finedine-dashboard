import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Main from "./pages/Main/Main.jsx";
import Login from "./pages/Login/Login.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import MenuManagement from "./pages/MenuManagement/MenuManagement.jsx";
import MenuEditor from "./pages/MenuEditor/MenuEditor.jsx";
import { SidebarContextProvider } from "./context/SidebarContext.jsx";
import { VenueContextProvider } from "./context/VenueContext.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { MenuContextProvider } from "./context/MenuContext.jsx";
import { TableContextProvider } from "./context/TablesContext.jsx";
import OperationMain from "./pages/Settings/Operations/OperationMain.jsx";
import { ModifierContextProvider } from "./context/ModifierContext.jsx";
import AllOrders from "./pages/Orders/AllOrders/AllOrders.jsx";
import OrderSettings from "./pages/Orders/OrderSettings/OrderSettings.jsx";
function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <SidebarContextProvider>
          <VenueContextProvider>
            <MenuContextProvider>
              <ModifierContextProvider>
              <TableContextProvider>
                <Routes>
                  {/* Default Route */}
                  <Route path="/" element={<Navigate to="/login" replace />} />

                  {/* Login Page */}
                  <Route path="login" element={<Login />} />

                  {/* Protected Routes */}
                  <Route path="venue/:venueId?" element={<Main />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="menu-management" element={<MenuManagement />}/>
                    <Route path="menu-management/:menuId" element={<MenuEditor />} />

                    <Route path="operations" element={<OperationMain />}/>
                    <Route path="orders/all-orders" element={<AllOrders />} />
                    <Route path="orders/order-settings" element={<OrderSettings />} />
                  </Route>


                  {/* Catch-all Route */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </TableContextProvider>
              </ModifierContextProvider>
            
            </MenuContextProvider>
          </VenueContextProvider>
        </SidebarContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
