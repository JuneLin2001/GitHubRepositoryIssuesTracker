import { useState, createContext, useEffect, useContext } from "react";
import api from "../utils/api";
import { useParams } from "react-router-dom";
import { AuthContext } from "./authContext";

export const CommentContext = createContext({
  issueData: {},
  commentData: {},
  loading: true,
  error: null,
  editingCommentId: null,
  currentTextareaValue: "",
  setComments: () => {},
  handleDelete: () => {},
  handleEdit: () => {},
  handleTextareaChange: () => {},
  handleCreateComment: () => {},
  setEditingCommentId: () => {},
});

export const CommentContextProvider = ({ children }) => {
  const [issueData, setIssueData] = useState(null);
  const [commentData, setCommentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [currentTextareaValue, setCurrentTextareaValue] = useState("");
  const { issueNumber } = useParams();
  const { CRUDtoken } = useContext(AuthContext);

  const owner = "JuneLin2001";
  const repo = "91APP_front-end-class";

  useEffect(() => {
    const fetchInitData = async () => {
      try {
        setLoading(true);
        const timestamp = new Date().getTime();
        const issueBodyData = await api.getIssueBody(
          owner,
          repo,
          issueNumber,
          CRUDtoken
        );
        const commentsData = await api.getIssueComments(
          owner,
          repo,
          issueNumber,
          timestamp
        );
        console.log("fetch到的資料", commentsData);
        console.log("fetch到的issueBodyData", issueBodyData);
        setIssueData(issueBodyData);
        setCommentData(commentsData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitData();
  }, [issueNumber, CRUDtoken]);

  const fetchData = async () => {
    try {
      const timestamp = new Date().getTime();
      const commentsData = await api.getIssueComments(
        owner,
        repo,
        issueNumber,
        timestamp
      );
      console.log("不是首次fetch到的資料", commentsData);
      setCommentData(commentsData);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const userConfirmed = confirm("Are you sure you want to delete this?");
      if (userConfirmed) {
        await api.deleteComment(owner, repo, commentId, CRUDtoken);
        fetchData();
      }
    } catch (e) {
      console.error("删除失敗", e.message);
    }
  };

  const handleUpdate = async (commentId, newContent) => {
    try {
      console.log("新的內容：", newContent);
      await api.updateComment(owner, repo, commentId, newContent, CRUDtoken);
      setEditingCommentId(null);
      fetchData();
    } catch (e) {
      console.error("修改失敗", e.message);
    }
  };

  const handleTextareaChange = (value) => {
    setCurrentTextareaValue(value);
  };

  const handleCreateComment = async (currentTextareaValue) => {
    console.log("現在的create textarea: ", currentTextareaValue);
    await api.createComment(
      owner,
      repo,
      issueNumber,
      currentTextareaValue,
      CRUDtoken
    );
    setCurrentTextareaValue("");
    fetchData();
  };

  return (
    <CommentContext.Provider
      value={{
        issueData,
        commentData,
        loading,
        error,
        editingCommentId,
        currentTextareaValue,
        handleDelete,
        handleUpdate,
        handleTextareaChange,
        handleCreateComment,
        setEditingCommentId,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};