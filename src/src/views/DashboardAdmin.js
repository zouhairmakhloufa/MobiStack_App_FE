import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col
} from "reactstrap"
import StatsVertical from '@components/widgets/stats/StatsVertical'
import { Check, MessageSquare, Twitch, XSquare, Users } from 'react-feather'
import Chart from 'react-apexcharts'

export default function DashboardAdmin() {
  const [userCount, setUserCount] = useState(0);
  const [questionStats, setQuestionStats] = useState({ total: 0, replied: 0, notReplied: 0 });
  const [commentStats, setCommentStats] = useState({ total: 0, trusted: 0, notTrusted: 0 });
  const [series, setSeries] = useState([]);

  const donutColors = {
    series1: '#1fd655',
    series2: '#fd6a02',
  }

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
        const response = await axios.get(`http://localhost:5000/api/kpi/adminDashboard`);
        const data = response.data;
        console.log(data);
        setUserCount(data.users);
        setQuestionStats(data.question);
        setCommentStats(data.comment);
        

  setSeries([{name:'Questions' ,data:data.question.perMonth}])
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    }

    fetchStats();
  }, []);

  const questionPerMonthOptions = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val} questions`
        }
      }
    }
  };


  return (
    <div>
      <Row>
        {/* Stats With Icons */}
        <Col >
          <StatsVertical icon={<Users size={21} />} color='primary' stats={`${userCount}`} statTitle='Users' />
        </Col>
        <Col >
          <StatsVertical icon={<Twitch size={21} />} color='info' stats={`${questionStats.total}`} statTitle='Questions' />
        </Col>
        {/* <Col >
          <StatsVertical icon={<Check size={21} />} color='success' stats={`${questionStats.replied}`} statTitle='Replied' />
        </Col>
        <Col >
          <StatsVertical icon={<XSquare size={21} />} color='warning' stats={`${questionStats.notReplied}`} statTitle='Not Replied' />
        </Col> */}
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
    
      </Row>

      <Row className='match-height'>
      <Col xl='6' md='12' sm='12'>
          <Card>
            <CardHeader className='d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start'>
              <CardTitle tag='h4'>Questions Per Month</CardTitle>
            </CardHeader>
            <CardBody>
              {console.log(series)}
              <Chart options={questionPerMonthOptions} series={series} type='bar' height={350} />
            </CardBody>
          </Card>
        </Col>
        <Col xl='6' md='12' sm='12'>
          <Card>
            <CardHeader className='d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start'>
              <CardTitle tag='h4'>Comment Statistics</CardTitle>
            </CardHeader>
            <CardBody>
              <Chart options={optionsC} series={[commentStats.trusted, commentStats.notTrusted]} type='donut' height={350} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
