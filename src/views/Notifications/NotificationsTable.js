import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import moment from "moment";
import { Link } from "react-router-dom";
import _ from 'lodash';

const NotificationsTable = (props) => {
  
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {

      if(!_.isEmpty(props.notifications)) {
        setNotifications(props.notifications);
      }
    }, [props.notifications]);

    return (
      <div id="reportId" >
        <Table hover bordered responsive className="mt-3 text-center">
          <thead>
          <tr>
            <th className={"text-left"}>Title</th>
            <th className={"text-left"}>Message</th>
            <th className="text-center">Created</th>
          </tr>
          </thead>
          <tbody>
          {notifications.map((item, key) => {
            return (
              <tr key={key}>
                <td className={"text-left"}>{item.rows.title}</td>
                <td className={"text-left"}>{item.rows.message}</td>
                <td className="text-center">{moment(item.rows.created_at).format('LL')}</td>
              </tr>
            )
          })}
          {!notifications.length ?
            <tr>
              <td colSpan="3">
                <div className="text-center">No Record Found</div></td>
            </tr>
            : null
          }
          </tbody>
        </Table>
      </div>
    );
};

export default NotificationsTable;
