import { useContext } from "react";
import {
  Box,
  Timeline,
  Text,
  Label,
  ActionMenu,
  ActionList,
  RelativeTime,
  Button,
  PointerBox,
  Avatar,
} from "@primer/react";
import { KebabHorizontalIcon, SmileyIcon } from "@primer/octicons-react";
import { CommentContext } from "./context/commentContext";
import CommentBox from "./comment";

const IssueBody = () => {
  const {
    issueData,
    editingCommentId,
    currentTextareaValue,
    handleUpdate,
    handleTextareaChange,
    setEditingCommentId,
    getHeaderColor,
  } = useContext(CommentContext);

  return (
    <>
      <Avatar
        size={40}
        src={issueData.user.avatar_url}
        alt={issueData.user.login}
      />
      <Box
        borderWidth={1}
        borderStyle="solid"
        borderColor="border.default"
        borderRadius={2}
      >
        <PointerBox
          caret="left-top"
          px={3}
          py={2}
          bg={getHeaderColor(issueData.user.login)}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderColor="border.default"
          borderTopLeftRadius={2}
          borderTopRightRadius={2}
        >
          <Box>
            <Text fontWeight="bold">{issueData.user.login} commented </Text>

            <RelativeTime date={new Date(issueData.created_at)} />
          </Box>
          <Box>
            {issueData.author_association === "OWNER" && (
              //<Tooltip aria-label="Hello, Tooltip!">
              <Label ml={2} color="fg.muted">
                {issueData.author_association}
              </Label>
              //</Tooltip>
            )}
            <ActionMenu>
              <ActionMenu.Button
                aria-label="Actions"
                sx={{
                  '[data-component="trailingAction"]': {
                    display: "none",
                  },
                  border: "none",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                  },
                  "&:focus": {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                  },
                  "&:active": {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                  },
                  "&:hover:not([disabled]):not([data-inactive])": {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                  },
                  "& svg": {
                    color: "currentColor",
                    "&:hover": {
                      color: "var(--bgColor-accent-emphasis)",
                    },
                    "&:focus": {
                      color: "var(--bgColor-accent-emphasis)",
                    },
                  },
                  "&[aria-expanded='true']": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <KebabHorizontalIcon />
              </ActionMenu.Button>
              <ActionMenu.Overlay width="medium">
                <ActionList>
                  <ActionList.Item>Copy link</ActionList.Item>
                  <ActionList.Item>Quote reply</ActionList.Item>
                  <ActionList.Divider />
                  <ActionList.Item
                    onSelect={() => setEditingCommentId(issueData.id)}
                  >
                    Edit
                  </ActionList.Item>
                  <ActionList.Divider />
                  <ActionList.Item>Report content</ActionList.Item>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </Box>
        </PointerBox>
        <Box p={2}>
          {editingCommentId === issueData.id ? (
            <>
              <CommentBox
                initialValue={issueData.body}
                onTextareaChange={handleTextareaChange}
              />
              <Box
                display="flex"
                justifyContent="flex-end"
                mt={2}
                columnGap={1}
              >
                <Button
                  variant="danger"
                  onClick={() => setEditingCommentId(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() =>
                    handleUpdate(issueData.id, currentTextareaValue)
                  }
                >
                  Update comment
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box p={3}>
                <Text>{issueData.body}</Text>
              </Box>
              <Box px={3} pb={3} display="flex" alignItems="center">
                <Timeline.Badge
                  variant="invisible"
                  sx={{
                    fontSixe: "14px",
                    display: "flex",
                    padding: "0px",
                    width: "26px",
                    height: "26px",
                    marginLeft: "0",
                  }}
                >
                  <SmileyIcon />
                </Timeline.Badge>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default IssueBody;
