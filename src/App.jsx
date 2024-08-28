import { Routes, Route } from "react-router-dom";
import IssuePage from "./IssuePage.jsx";
import GitHubLogin from "./utils/GitHubLogin";
import CommentPage from "./CommentPage.jsx";
import { AuthContextProvider } from "./context/authContext";
import { CommentContextProvider } from "./context/commentContext.jsx";

function App() {
  return (
    <>
      <AuthContextProvider>
        <CommentContextProvider>
          <Routes>
            <Route path="/login" element={<GitHubLogin />} />
            <Route path="/issue" element={<IssuePage />} />
            <Route path="/comment/:issueNumber" element={<CommentPage />} />
          </Routes>
        </CommentContextProvider>
      </AuthContextProvider>
    </>
  );
}

export default App;
