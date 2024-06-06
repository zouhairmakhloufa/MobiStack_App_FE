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
    chart: {
      type: 'donut',
  
    },
    colors: [donutColors.series1, donutColors.series2],
    plotOptions: {
    
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }],

    legend: {
      show: true,
      position: 'bottom'
    },
    stroke: {
      lineCap: 'round'
    },
    labels: ['Trusted', 'Not Trusted']
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
      <Col >
        <StatsVertical icon={<Twitch size={21} />} color='info' stats={`${questionStats.total}`} statTitle='Questions' />
      </Col>
  
      <Col >
        <StatsVertical icon={<MessageSquare size={21} />} color='info' stats={`${commentStats.total}`} statTitle='Comments' />
      </Col>
      <Col >
        <StatsVertical icon={<Check size={21} />} color='success' stats={`${commentStats.trusted}`} statTitle='Trusted' />
      </Col>
      <Col >
        <StatsVertical icon={<Check size={21} />} color='secondary' stats={`${commentStats.notTrusted}`} statTitle='Not Trusted' />
      </Col>
      {/* Stats With Icons */}
    </Row>

    <Row>
      {/* <Col xl='6' md='12' sm='12'>
        <Card>
          <CardHeader className='d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start'>
            <CardTitle tag='h4'>Question Statistics</CardTitle>
          </CardHeader>
          <CardBody>
            <Chart options={optionsQ} series={[questionStats.replied, questionStats.notReplied]} type='radialBar' height={350} />
          </CardBody>
        </Card>
      </Col> */}
      <Col xl='12' md='12' sm='12'>
        <Card>
          <CardHeader className='d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start'>
            <CardTitle tag='h4'>Comment Statistics</CardTitle>
          </CardHeader>
          <CardBody >
            <Chart options={optionsC} series={[commentStats.trusted, commentStats.notTrusted]} type='donut' height={350} />
          </CardBody>
        </Card>
      </Col>
    </Row>
  </div>
  )
}
