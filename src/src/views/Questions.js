// ** React Imports
import { Link } from 'react-router-dom'
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import axios from 'axios'
import { MessageSquare } from 'react-feather'
import format from 'date-fns/format'
// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import {
    Row,
    Col,
    Card,
    CardBody,
    CardText,
    CardTitle,
    CardImg,
    Badge,
    Pagination,
    PaginationItem,
    PaginationLink
} from 'reactstrap'

// ** Styles
import '@styles/base/pages/page-blog.scss'

export default function Questions() {
    const [data, setData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(6);





    useEffect(() => {
        axios.get('http://localhost:5000/api/question/getWithCommentCount')
            .then((res) => {
                setData(res.data.data);

                console.log("res.data.data", res.data.data);

            })
            .catch((error) => {
                console.error('Error fetching question:', error);
            });
    }, [])

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = data && data.slice(indexOfFirstPost, indexOfLastPost);


    const paginate =(value)=>{
        setCurrentPage(value)
    }


    const renderRenderList = () => {

        return currentPosts && currentPosts.map((item ,idx) => {


            return (
                <Col key={idx} md='6'>
                    <Card className='match-height' >
                        <CardBody>
                            <CardTitle tag='h4'  className="card-title-truncate" style={{ minHeight:"50px" }}>
                                <Link className='blog-title-truncate text-body-heading' to={`/question-detail/${item._id}`}>
                                    {item.name}
                                </Link>
                            </CardTitle>
                            <div className='my-1 py-25'>
                                <Badge
                                    className='me-50 '
                                    color={'light-info'}
                                    pill
                                >
                                    {item.type}
                                </Badge>

                            </div>

                            <div className='d-flex'>

                                {/* <Avatar className='me-50' img={item.avatar} imgHeight='24' imgWidth='24' /> */}
                                <div>
                                    <small className='text-muted me-25'>by</small>
                                    <small>
                                        <a className='text-body' href='/' onClick={e => e.preventDefault()}>
                                            {item.user_id.firstName + ' ' + item.user_id.lastName}
                                        </a>
                                    </small>
                                    <span className='text-muted ms-50 me-25'>|</span>
                                    <small className='text-muted'>{format(new Date(item.createdAt), 'dd-MM-yyyy')}</small>
                                </div>
                            </div>
                            {/* <CardText className='blog-content-truncate'>{item.excerpt}</CardText> */}
                            <hr />
                            <div className='d-flex justify-content-between align-items-center'>
                                <Link to={`/question-detail/${item._id}`}>
                                    <MessageSquare size={15} className='text-body me-50' />
                                    <span className='text-body fw-bold'>{item.commentCount} Comments</span>
                                </Link>
                                <Link className='fw-bold' to={`/question-detail/${item._id}`}>
                                    Read More
                                </Link>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            )
        })
    }

    return (
        <Fragment>
            <div className='blog-wrapper'>
                <div className='content-detached content-center'>
                    <div className='content-body '>
                        {data !== null ? (
                            <div className='blog-list-wrapper '>
                                <Row >{renderRenderList()}</Row>
                                <Row>
                                    <Col sm='12'>
                                        <Pagination className='d-flex justify-content-center mt-2'>
                                            <PaginationItem>
                                                <PaginationLink previous onClick={() => paginate(currentPage - 1)} />
                                            </PaginationItem>
                                            {Array.from({ length: Math.ceil(data.length / postsPerPage) }, (_, i) => (
                                                <PaginationItem key={i} active={i + 1 === currentPage}>
                                                    <PaginationLink onClick={() => paginate(i + 1)}>
                                                        {i + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))}
                                            <PaginationItem>
                                                <PaginationLink next onClick={() => paginate(currentPage + 1)} />
                                            </PaginationItem>
                                        </Pagination>
                                    </Col>
                                </Row>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
