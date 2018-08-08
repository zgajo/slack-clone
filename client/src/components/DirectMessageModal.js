import React from "react";
import { Button, Form, Modal, Input } from "semantic-ui-react";
import Downshift from "downshift";

import { graphql } from "react-apollo";
import withRouter from "react-router-dom/withRouter";
import { getTeamMembersQuery } from "../graphql/team";

const DirectMessageModal = ({
  open,
  onClose,
  history,
  teamId,
  data: { loading, getTeamMembers }
}) => (
  <Modal open={open} onClose={onClose} style={{ display: "inline !important" }}>
    <Modal.Header>Add Channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input name="name" fluid placeholder="Search users" />

          {!loading && (
            <Downshift
              onChange={selectedUser => {
                history.push(`/view_team/user/${teamId}/${selectedUser.id}`);
                onClose();
              }}
            >
              {({
                getInputProps,
                getItemProps,
                isOpen,
                inputValue,
                selectedItem,
                highlightedIndex
              }) => (
                <div>
                  <Input
                    {...getInputProps({ placeholder: "Favorite fruit ?" })}
                  />
                  {isOpen ? (
                    <div style={{ border: "1px solid #ccc" }}>
                      {getTeamMembers
                        .filter(
                          i =>
                            !inputValue ||
                            i.username
                              .toLowerCase()
                              .includes(inputValue.toLowerCase())
                        )
                        .map((item, index) => (
                          <div
                            {...getItemProps({ item })}
                            key={item.id}
                            style={{
                              backgroundColor:
                                highlightedIndex === index ? "gray" : "white",
                              fontWeight:
                                selectedItem === item ? "bold" : "normal"
                            }}
                          >
                            {item.username}
                          </div>
                        ))}
                    </div>
                  ) : null}
                </div>
              )}
            </Downshift>
          )}
        </Form.Field>
        <Form.Group widths="equal">
          <Button fluid onClick={onClose}>
            Cancel
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

export default withRouter(graphql(getTeamMembersQuery)(DirectMessageModal));
