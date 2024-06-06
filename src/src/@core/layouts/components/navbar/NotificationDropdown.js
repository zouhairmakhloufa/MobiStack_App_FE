// ** React Imports
import { Fragment, useEffect, useState } from "react"

// ** Custom Components
import Avatar from "@components/avatar"

// ** Third Party Components
import classnames from "classnames"
import PerfectScrollbar from "react-perfect-scrollbar"
import { Bell, X, Check, AlertTriangle } from "react-feather"
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg"

// ** Reactstrap Imports
import {
  Button,
  Badge,
  Input,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown
} from "reactstrap"
import axios from "axios"
import { getUserData } from "../../../../utility/Utils"
import { Link, useNavigate } from "react-router-dom"

const NotificationDropdown = () => {

  const [notification, setNotification] = useState([])
  const [user , setUser]=useState(null)




  const navigate = useNavigate()


  useEffect(() => {
    setUser(getUserData()) 

    getAllNotification()
  }, [])

  const getAllNotification = () => {

    let connectedUser=getUserData()
    if (connectedUser) {
      axios.get('http://localhost:5000/api/notification/getByUserId/' + connectedUser.id).then((res) => {

        setNotification(res.data.data)
  
        setTimeout(()=>{
          getAllNotification()
           setUser(getUserData()) 
        },2000)
      })
    }
  
  }

  const navigateTo = (item) => {

    item.isRead=true
    axios.put('http://localhost:5000/api/notification/update', item).then((res) => {

      getAllNotification()
    })
    navigate("/question-detail/" + item.question_id)
  }

  // ** Function to render Notifications
  /*eslint-disable */
  const renderNotificationItems = () => {
    return (
      <PerfectScrollbar
        component="li"
        className="media-list scrollable-container"
        options={{
          wheelPropagation: false,
        }}
      >
        {notification.map((item, index) => {
          return (
            <a
              key={index}
              className="d-flex"
              onClick={() => navigateTo(item)}
            >
              <div
                className={classnames("list-item d-flex", {
                  "align-items-start": !item.switch,
                  "align-items-center": item.switch,
                })}
              >
                <Fragment>
                  <div className="me-1">
                    <Avatar
                      img={item?.user_added?.avatar || defaultAvatar}
                      imgHeight="32"
                      imgWidth="32"
                    />

                  </div>
                  <div className="list-item-body flex-grow-1">
                    <h5>
                      {item?.user_added?.firstName + ' ' + item?.user_added?.lastName} {" "}
                      <small className="notification-text">
                        has added {item.type === 'question' ? 'a new question' : 'a new comment'}
                      </small>
                    </h5>
                  </div>
                </Fragment>
              </div>
            </a>
          );
        })}
      </PerfectScrollbar>
    );
  };
  /*eslint-enable */

  return (
    <UncontrolledDropdown
      tag="li"
      className="dropdown-notification nav-item me-25"
    >
      <DropdownToggle
        tag="a"
        className="nav-link"
        href="/"
        onClick={(e) => e.preventDefault()}
      >
        <Bell size={21} />
        <Badge pill color="danger" className="badge-up">
          {notification.length}
        </Badge>
      </DropdownToggle>
      <DropdownMenu end tag="ul" className="dropdown-menu-media mt-0">
        <li className="dropdown-menu-header">
          <DropdownItem className="d-flex" tag="div" header>
            <h4 className="notification-title mb-0 me-auto">Notifications</h4>
            <Badge tag="div" color="light-primary" pill>
              {notification.length} New
            </Badge>
          </DropdownItem>
        </li>
        {renderNotificationItems()}
        <li className="dropdown-menu-footer">
          <Button color="primary" block>
            Read all notifications
          </Button>
        </li>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default NotificationDropdown
