import { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";
import { Center } from "../../style/Center.styled";
import { useNavigate, useParams } from "react-router-dom";
import IssueSearch from "./IssuePageSearch";
import IssuePageHeader from "./IssuePageHeader";
import IssuePageList from "./IssuePageList";
import { IssueAllContainer } from "../../style/IssuePage.styled";

const IssuePage = () => {
  const [apiResult, setApiResult] = useState([]);
  const [allIssues, setAllIssues] = useState({ openCount: 0, closedCount: 0 });
  const [authors, setAuthors] = useState([]);
  const [labels, setLabels] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("all");
  const [selectedLabel, setSelectedLabel] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [stateFilter, setStateFilter] = useState("open");
  const { repoName, owner } = useParams();
  const navigate = useNavigate();

  const parseUrlParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const query = searchParams.get("q") || "";

    const params = query.split("+").reduce(
      (acc, param) => {
        if (param.startsWith("repo:")) {
          acc.repo = param.substring(5);
        } else if (param.startsWith("is:")) {
          acc.state = param.substring(3);
        } else if (param.startsWith("label:")) {
          acc.labels = acc.labels || [];
          acc.labels.push(param.substring(6));
        } else if (param.startsWith("author:")) {
          acc.author = param.substring(7);
        }
        return acc;
      },
      { labels: [] }
    );

    const resultString = [
      params.repo ? `repo:${params.repo}` : "error",
      params.state ? `is:issue is:${params.state}` : "is:issue",
      params.author ? `author:${params.author}` : "",
      params.labels.length > 0
        ? params.labels.map((label) => `${label}`).join(" ")
        : "",
    ]
      .filter(Boolean)
      .join(" ");

    return resultString;
  };

  const fetchInitialData = useCallback(async () => {
    try {
      if (owner && repoName) {
        const response = await api.fetchInitialData(owner, repoName);
        setApiResult(response.issues);
        setLabels(response.labels);
        setAllIssues({
          openCount: response.openCount,
          closedCount: response.closedCount,
        });
        setAuthors(response.uniqueAuthors);
      }
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
      const errorMessage = error.message || "Something went wrong";
      navigate("/error", { state: { errorMessage } });
    }
  }, [navigate, owner, repoName]);

  const fetchDataAndUpdateUrl = useCallback(() => {
    if (!owner || !repoName || !stateFilter) {
      const errorMessage = "Repository owner, name, and state are required.";
      navigate("/error", { state: { errorMessage } });
      return;
    }

    const updateUrlParams = () => {
      const url = new URL(window.location.href);
      const searchParams = new URLSearchParams();

      const repoInfo = `repo:${owner}/${repoName}`;
      const state = `is:issue is:${stateFilter}`;
      const author = selectedAuthor !== "all" ? `author:${selectedAuthor}` : "";
      const label = selectedLabel !== "all" ? `${selectedLabel}` : "";
      const searchResult = searchValue || "";

      const queryString = [repoInfo, state, author, label, searchResult]
        .filter(Boolean)
        .join(" ");

      searchParams.set("q", queryString);
      url.search = searchParams.toString();
      window.history.pushState({}, "", url);
    };

    updateUrlParams();

    const fetchFilteredIssues = async () => {
      try {
        const authorFilter = selectedAuthor || "all";
        const labelFilter = selectedLabel || "";
        const searchResult = searchValue || "";
        const q = parseUrlParams();

        const response = await api.fetchFilteredIssues(
          q,
          owner,
          repoName,
          authorFilter,
          labelFilter,
          stateFilter,
          searchResult
        );

        setApiResult(response);
      } catch (error) {
        console.error("Failed to fetch filtered issues:", error);
        const errorMessage = error.message || "Something went wrong";
        navigate("/error", { state: { errorMessage } });
      }
    };

    fetchFilteredIssues();
  }, [
    navigate,
    owner,
    repoName,
    searchValue,
    selectedAuthor,
    selectedLabel,
    stateFilter,
  ]);

  useEffect(() => {
    parseUrlParams();
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDataAndUpdateUrl();
    }, 500);

    return () => clearTimeout(timer);
  }, [
    fetchDataAndUpdateUrl,
    searchValue,
    selectedAuthor,
    selectedLabel,
    stateFilter,
  ]);

  const handleFilterChange = (type, value) => {
    if (type === "label") {
      setSelectedLabel(value);
    } else if (type === "author") {
      setSelectedAuthor(value);
    }

    fetchDataAndUpdateUrl();
  };

  const handleAuthorChange = (selectedAuthor) => {
    console.log("Selected author:", selectedAuthor);
    handleFilterChange("author", selectedAuthor);
  };

  const handleLabelChange = (labels) => {
    const formattedString = labels.map((label) => `label:${label}`).join(" ");
    console.log("formattedString: ", formattedString);
    handleFilterChange("label", formattedString);
  };

  const handleSearchClick = async (e, newSearchValue) => {
    e.preventDefault();
    setSearchValue(newSearchValue);
    fetchDataAndUpdateUrl();
  };

  // const issuesToDisplay = apiResult;

  const handleCheckboxChange = (issueId) => {
    console.log(`Checkbox for issue ${issueId} changed.`);
  };

  return (
    <Center>
      <IssueSearch
        handleSearchClick={handleSearchClick}
        labelNum={labels.length}
      />
      <IssueAllContainer>
        <IssuePageHeader
          openCount={allIssues.openCount}
          closedCount={allIssues.closedCount}
          stateFilter={stateFilter}
          setStateFilter={setStateFilter}
          authors={authors}
          labels={labels}
          handleAuthorChange={handleAuthorChange}
          handleLabelChange={handleLabelChange}
        />
        <IssuePageList
          issuesToDisplay={apiResult}
          stateFilter={stateFilter}
          repoName={repoName}
          handleCheckboxChange={handleCheckboxChange}
          owner={owner}
        />
      </IssueAllContainer>
    </Center>
  );
};

export default IssuePage;
