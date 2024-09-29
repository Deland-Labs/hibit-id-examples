import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom";

const MainPage = lazy(() => import("./pages/Main"));
const TonConnectPage = lazy(() => import("./pages/TonConnect"));
const IcrcPage = lazy(() => import("./pages/ICRC"));

function App() {
  return (
    <Suspense>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/tonconnect" element={<TonConnectPage />} />
        <Route path="/dfinity-icrc" element={<IcrcPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
