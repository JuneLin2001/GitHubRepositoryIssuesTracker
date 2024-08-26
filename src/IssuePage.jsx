import { useState, useEffect, useContext } from "react";
import api from "./utils/api";
import { ActionList, Box, Text, Link } from "@primer/react";
import { useParams } from "react-router-dom";
import { AuthContext } from "./context/authContext";

const IssuePage = () => {
  const [apiResult, setApiResult] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("all");
  const [selectedLabel, setSelectedLabel] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { repoName } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.reloadUserInfo && user.reloadUserInfo.screenName) {
        console.log("repoName:", repoName);
        console.log("user:", user.reloadUserInfo.screenName);
        try {
          const [issuesData, labelsData] = await Promise.all([
            api.getAllIssue(user.reloadUserInfo.screenName, repoName),
            api.getAllLabelFromIssue(user.reloadUserInfo.screenName, repoName),
          ]);

          setApiResult(issuesData);

          const uniqueAuthors = [...new Set(issuesData.map((issue) => issue.user.login))];
          setAuthors(uniqueAuthors);
          setLabels(labelsData);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      }
    };

    fetchData();
  }, [user, repoName]);

  const handleAuthorChange = (e) => {
    setIsSearching(false);
    setSelectedAuthor(e.target.value);
  };

  const handleLabelChange = (e) => {
    setIsSearching(false);
    setSelectedLabel(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchClick = async (e) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      const searchResults = await api.getSearchIssues(user.reloadUserInfo.screenName, repoName, searchValue);
      setSearchResult(searchResults);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const filteredIssues = (issues) =>
    issues
      .filter(
        (issue) =>
          (selectedAuthor === "all" || issue.user.login === selectedAuthor) &&
          (selectedLabel === "all" || issue.labels.some((label) => label.name === selectedLabel))
      )
      .filter((issue) => !issue.pull_request);

  const issuesToDisplay = isSearching ? searchResult : filteredIssues(apiResult);

  return (
    <div>
      <h1>Issue Page</h1>

      <label htmlFor="author-select">篩選作者:</label>
      <select id="author-select" onChange={handleAuthorChange}>
        <option value="all">all</option>
        {authors.map((author) => (
          <option key={author} value={author}>
            {author}
          </option>
        ))}
      </select>

      <label htmlFor="label-select">篩選標籤:</label>
      <select id="label-select" onChange={handleLabelChange}>
        <option value="all">all</option>
        {labels.map((label) => (
          <option key={label.id} value={label.name}>
            {label.name}
          </option>
        ))}
      </select>

      <form>
        <input placeholder="is:issue is:open" value={searchValue} onChange={handleSearchChange}></input>
        <button onClick={handleSearchClick}>搜尋</button>
      </form>
      {/* <ul>
        {issuesToDisplay.map(
          (issue) =>
            !issue.pull_request && (
              <li key={issue.id}>
                <a href={issue.html_url}>{issue.title}</a>
                <p>創建時間: {new Date(issue.created_at).toLocaleString()}</p>
                <p>發布者: {issue.user.login}</p>
                {issue.labels.map((label) => (
                  <p key={label.id}>{label.name}</p>
                ))}
              </li>
            )
        )}
      </ul> */}

      <Box p={3}>
        <ActionList>
          {issuesToDisplay.map((issue) => (
            <ActionList.Item key={issue.id}>
              <Box display="flex" alignItems="center">
                <Box>
                  <Text fontWeight="bold">
                    <Link href={issue.html_url} target="_blank">
                      {issue.title}
                    </Link>
                  </Text>
                </Box>
                {issue.labels.map((label) => {
                  const isWhite = label.color === "ffffff";
                  return (
                    <Box
                      as="span"
                      key={label.id}
                      bg={`#${label.color}`}
                      color={isWhite ? "black" : "white"}
                      borderRadius={100}
                      ml={1}
                      px={2}
                      py={1}
                      border={isWhite ? "1px solid" : 0}
                      borderColor={isWhite ? "gray" : "transparent"}
                    >
                      {label.name}
                    </Box>
                  );
                })}
              </Box>
              <Box mt={1}>
                <Text color="fg.muted">
                  opened on {new Date(issue.created_at).toLocaleDateString()} by {issue.user.login}
                </Text>
              </Box>
            </ActionList.Item>
          ))}
        </ActionList>
      </Box>
    </div>
  );
};

export default IssuePage;