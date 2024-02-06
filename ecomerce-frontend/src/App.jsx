/** @format */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Loader from "./components/layout/Loader";
import Header from "./components/layout/Header";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { getUser } from "./redux/api/userAPI";
import ProtectedRoutes from "./components/layout/ProtectedRoutes";

const Home = lazy(() => import("./pages/Home"));
const Cart = lazy(() => import("./pages/Cart"));
const Search = lazy(() => import("./pages/Search"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Login = lazy(() => import("./pages/Login"));
const MyOrders = lazy(() => import("./pages/Orders"));
const PageNotFound = lazy(() => import("./components/layout/PageNotFound"));
const Chekout = lazy(() => import("./pages/Chekout"));

// dashboard imports
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const Transactions = lazy(() => import("./pages/admin/Transactions"));
const Customers = lazy(() => import("./pages/admin/Customers"));
const NewProduct = lazy(() => import("./pages/admin/NewProduct"));
const ProductManagemet = lazy(() => import("./pages/admin/ProductManagemet"));
const TransactionManagement = lazy(() =>
    import("./pages/admin/TransactionManagement")
);
const BarCharts = lazy(() => import("./pages/admin/charts/BarCharts"));
const PieCharts = lazy(() => import("./pages/admin/charts/PieCharts"));
const LineCharts = lazy(() => import("./pages/admin/charts/LineCharts"));
const StopWatchApp = lazy(() => import("./pages/admin/apps/StopWatch"));
const CouponApp = lazy(() => import("./pages/admin/apps/Coupon"));
const TossApp = lazy(() => import("./pages/admin/apps/Toss"));

function App() {
    const { user, loading } = useSelector((state) => state.userReducer);

    const dispatch = useDispatch();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const data = await getUser(user.uid);
                dispatch(userExist(data.user));
            } else {
                dispatch(userNotExist());
            }
        });
    }, [dispatch]);

    return loading ? (
        <Loader />
    ) : (
        <Router>
            <Header user={user} />
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route
                        path="/"
                        element={<Home />}
                    />
                    <Route
                        path="/search"
                        element={<Search />}
                    />
                    <Route
                        path="/cart"
                        element={<Cart />}
                    />

                    {/* auth routes */}
                    <Route
                        path="/login"
                        element={
                            <ProtectedRoutes
                                isAuthenticated={user ? false : true}>
                                <Login />
                            </ProtectedRoutes>
                        }
                    />

                    {/* logged in user routes */}
                    <Route
                        element={
                            <ProtectedRoutes
                                isAuthenticated={user ? true : false}
                            />
                        }>
                        <Route
                            path="/shipping"
                            element={<Shipping />}
                        />
                        <Route
                            path="/orders"
                            element={<MyOrders />}
                        />
                        <Route
                            path="/pay"
                            element={<Chekout />}
                        />
                    </Route>

                    {/* admin dashboard routes */}
                    <Route
                        element={
                            <ProtectedRoutes
                                isAuthenticated={true}
                                adminOnly={true}
                                admin={user?.role === "admin" ? true : false}
                            />
                        }>
                        <Route
                            path="/admin/dashboard"
                            element={<Dashboard />}
                        />
                        <Route
                            path="/admin/products"
                            element={<AdminProducts />}
                        />
                        <Route
                            path="/admin/customers"
                            element={<Customers />}
                        />
                        <Route
                            path="/admin/transactions"
                            element={<Transactions />}
                        />

                        {/* admin dashboard charts */}
                        <Route
                            path="/admin/chart/bar"
                            element={<BarCharts />}
                        />
                        <Route
                            path="/admin/chart/pie"
                            element={<PieCharts />}
                        />
                        <Route
                            path="/admin/chart/line"
                            element={<LineCharts />}
                        />

                        {/* admin dashboard apps */}
                        <Route
                            path="/admin/app/stopwatch"
                            element={<StopWatchApp />}
                        />
                        <Route
                            path="/admin/app/toss"
                            element={<TossApp />}
                        />
                        <Route
                            path="/admin/app/coupon"
                            element={<CouponApp />}
                        />

                        {/* management Routes */}
                        <Route
                            path="/admin/product/new"
                            element={<NewProduct />}
                        />
                        <Route
                            path="/admin/product/:id"
                            element={<ProductManagemet />}
                        />
                        <Route
                            path="/admin/transaction/:id"
                            element={<TransactionManagement />}
                        />
                    </Route>
                    <Route
                        path="*"
                        element={<PageNotFound />}
                    />
                </Routes>
            </Suspense>
            <Toaster position={"bottom-center"} />
        </Router>
    );
}

export default App;
