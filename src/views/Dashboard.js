import React, { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,

  Row,
  Col
} from "reactstrap"
import StatsVertical from '@components/widgets/stats/StatsVertical'
import { Check,  MessageSquare,  Twitch, XSquare } from 'react-feather'
import Chart from 'react-apexcharts'
import { getUserData } from '../utility/Utils'
import axios from 'axios'

export default function Dashboard() {
  const [questionStats, setQuestionStats] = useState({ total: 0, replied: 0, notReplied: 0 });
  const [commentStats, setCommentStats] = useState({ total: 0, trusted: 0, notTrusted: 0 });

  const donutColors = {
    series1: '#1fd655',
    series2: '#fd6a02',
 
    
  }

  const userId = getUserData()?.id
  const optionsC = {
    colors: [donutColors.series1, donutColors.series2],
    plotOptions: {
      radialBar: {
        size: 185,
        hollow: {
          size: '25%'
        },
        track: {
          margin: 15
        },
        dataLabels: {
          name: {
            fontSize: '2rem',
            fontFamily: 'Montserrat'
          },
          value: {
            fontSize: '1rem',
            fontFamily: 'Montserrat'
          },
          total: {
            show: true,
            fontSize: '1rem',
            label: 'Comments',
            formatter() {
              return `${commentStats.total}`
            }
          }
        }
      }
    },
    grid: {
      padding: {
        top: -35,
        bottom: -30
      }
    },
    legend: {
      show: true,
      position: 'bottom'
    },
    stroke: {
      lineCap: 'round'
    },
    labels: ['Trusted', 'Not Trusted']
  }

  const optionsQ = {
    colors: [donutColors.series1, donutColors.series2],
    plotOptions: {
      radialBar: {
        size: 185,
        hollow: {
          size: '25%'
        },
        track: {
          margin: 15
        },
        dataLabels: {
          name: {
            fontSize: '2rem',
            fontFamily: 'Montserrat'
          },
          value: {
            fontSize: '1rem',
            fontFamily: 'Montserrat'
          },
          total: {
            show: true,
            fontSize: '1rem',
            label: 'Questions',
            formatter() {
              return `${questionStats.total}`
            }
          }
        }
      }
    },
    grid: {
      padding: {
        top: -35,
        bottom: -30
      }
    },
    legend: {
      show: true,
      position: 'bottom'
    },
    stroke: {
      lineCap: 'round'
    },
    labels: ['Replied', 'Not Replied']
  }

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await axios.get(`http://localhost:5000/api/kpi/dashboardUser/${userId}`);
        const data = response.data;
        console.log(data);
        setQuestionStats(data.question);
        setCommentStats(data.comment);
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    }

    fetchStats();
  }, [userId]);

  return (
    <div>
    <Row>
      {/* Stats With Icons */}
      <Col xl='4' md='4' sm='6'>
        <StatsVertical icon={<Twitch size={21} />} color='info' stats={`${questionStats.total}`} statTitle='Questions' />
      </Col>
      <Col xl='4' md='4' sm='6'>
        <StatsVertical icon={<Check size={21} />} color='success' stats={`${questionStats.replied}`} statTitle='Replied' />
      </Col>
      <Col xl='4' md='4' sm='6'>
        <StatsVertical icon={<XSquare size={21} />} color='warning' stats={`${questionStats.notReplied}`} statTitle='Not Replied' />
      </Col>
      <Col xl='4' md='4' sm='6'>
        <StatsVertical icon={<MessageSquare size={21} />} color='info' stats={`${commentStats.total}`} statTitle='Comments' />
      </Col>
      <Col xl='4' md='4' sm='6'>
        <StatsVertical icon={<Check size={21} />} color='success' stats={`${commentStats.trusted}`} statTitle='Trusted' />
      </Col>
      <Col xl='4' md='4' sm='6'>
        <StatsVertical icon={<Check size={21} />} color='secondary' stats={`${commentStats.notTrusted}`} statTitle='Not Trusted' />
      </Col>
      {/* Stats With Icons */}
    </Row>

    <Row>
      <Col xl='6' md='12' sm='12'>
        <Card>
          <CardHeader className='d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start'>
            <CardTitle tag='h4'>Question Statistics</CardTitle>
          </CardHeader>
          <CardBody>
            <Chart options={optionsQ} series={[questionStats.replied, questionStats.notReplied]} type='radialBar' height={350} />
          </CardBody>
        </Card>
      </Col>
      <Col xl='6' md='12' sm='12'>
        <Card>
          <CardHeader className='d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start'>
            <CardTitle tag='h4'>Comment Statistics</CardTitle>
          </CardHeader>
          <CardBody>
            <Chart options={optionsC} series={[commentStats.trusted, commentStats.notTrusted]} type='radialBar' height={350} />
          </CardBody>
        </Card>
      </Col>
    </Row>
  </div>
  )
}
