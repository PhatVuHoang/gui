import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CloneRepo from "./pages/clone-repo";
import CommitHistory from "./pages/commit-history";
import { GlobalProvider } from "./context/GlobalContext";

function App() {
  return (
    <GlobalProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<CloneRepo />} />
            <Route path="/commit-history" element={<CommitHistory />} />
          </Routes>
        </div>
      </Router>
    </GlobalProvider>
  );
}

export default App;
