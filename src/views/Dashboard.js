import React, { useEffect } from 'react'
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

export default function Dashboard() {

  const donutColors = {
    series1: '#1fd655',
    series2: '#fd6a02',
 
    
  }

  // ** Chart Options
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
              return '80%'
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
            label: 'Question',
            formatter() {
              return '80%'
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

  useEffect(()=>{

  })

  return (
    <div>
      <Row>
        {/* Stats With Icons */}
        <Col xl='4' md='4' sm='6'>
          <StatsVertical icon={<Twitch size={21} />} color='info' stats='20' statTitle='Questions' />
        </Col>
        <Col xl='4' md='4' sm='6'>
          <StatsVertical icon={<Check size={21} />} color='success' stats='18' statTitle='Replied' />
        </Col>
        <Col xl='4' md='4' sm='6'>
          <StatsVertical icon={<XSquare size={21} />} color='warning' stats='2' statTitle='Not Replied' />
        </Col>
        <Col xl='4' md='4' sm='6'>
          <StatsVertical icon={<MessageSquare size={21} />} color='info' stats='50' statTitle='Comment' />
        </Col>
        <Col xl='4' md='4' sm='6'>
          <StatsVertical icon={<Check size={21} />} color='success' stats='13' statTitle='Trusted' />
        </Col>
        <Col xl='4' md='4' sm='6'>
          <StatsVertical icon={<Check size={21} />} color='secondary' stats='27' statTitle='Not Trusted' />
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
              <Chart options={optionsQ} series={[80, 50]} type='radialBar' height={350} />
            </CardBody>
          </Card>
        </Col>
        <Col xl='6' md='12' sm='12'>
          <Card>
            <CardHeader className='d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start'>
              <CardTitle tag='h4'>Comment Statistics</CardTitle>
            </CardHeader>
            <CardBody>
              <Chart options={optionsC} series={[80, 35]} type='radialBar' height={350} />
            </CardBody>
          </Card>
        </Col>
      </Row>


    </div>
  )
}
